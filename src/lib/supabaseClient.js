const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const baseHeaders = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json'
};

const request = async (path, { method = 'GET', body, query = {} } = {}) => {
  const url = new URL(`${supabaseUrl}/rest/v1/${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method,
    headers: {
      ...baseHeaders,
      ...(method === 'GET' ? {} : { Prefer: 'return=representation' })
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Supabase request failed (${response.status}).`);
  }

  return data;
};

export const supabaseRest = {
  select: (table, { orderBy, ascending = true, filters = {} } = {}) =>
    request(table, {
      query: {
        select: '*',
        ...(orderBy ? { order: `${orderBy}.${ascending ? 'asc' : 'desc'}` } : {}),
        ...Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, `eq.${value}`]))
      }
    }),
  insert: (table, payload) => request(table, { method: 'POST', body: payload }),
  updateEq: (table, field, value, payload) =>
    request(table, { method: 'PATCH', body: payload, query: { [field]: `eq.${value}` } }),
  deleteEq: (table, field, value) => request(table, { method: 'DELETE', query: { [field]: `eq.${value}` } })
};
