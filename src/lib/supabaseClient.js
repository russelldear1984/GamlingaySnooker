const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const isJwt = (value) => typeof value === 'string' && value.split('.').length === 3;

const buildHeaders = ({ forceAuthorization = false, method = 'GET' } = {}) => {
  const headers = {
    apikey: supabaseKey,
    'Content-Type': 'application/json',
    ...(method === 'GET' ? {} : { Prefer: 'return=representation' })
  };

  // Publishable keys are not JWTs, but some Supabase API configurations
  // still expect an Authorization header for PostgREST writes.
  if (forceAuthorization || isJwt(supabaseKey)) {
    headers.Authorization = `Bearer ${supabaseKey}`;
  }

  return headers;
};

const parsePayload = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const performFetch = async ({ url, method, body, forceAuthorization = false }) => {
  const response = await fetch(url, {
    method,
    headers: buildHeaders({ forceAuthorization, method }),
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await parsePayload(response);
  return { response, data };
};

const request = async (path, { method = 'GET', body, query = {} } = {}) => {
  const url = new URL(`${supabaseUrl}/rest/v1/${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });

  let { response, data } = await performFetch({ url, method, body, forceAuthorization: false });

  if (!response.ok && (response.status === 401 || response.status === 403) && !isJwt(supabaseKey)) {
    ({ response, data } = await performFetch({ url, method, body, forceAuthorization: true }));
  }

  if (!response.ok) {
    const details = data?.details ? ` ${data.details}` : '';
    const hint = data?.hint ? ` ${data.hint}` : '';
    throw new Error((data?.message || data?.error || `Supabase request failed (${response.status}).`) + details + hint);
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
