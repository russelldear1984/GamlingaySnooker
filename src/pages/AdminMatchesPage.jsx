import { useMemo, useState } from 'react';
import { MatchForm } from '../components/MatchForm';
import { useApp } from '../context/AppContext';

export const AdminMatchesPage = () => {
  const { matches, players, tables, upsertMatch, deleteMatch } = useApp();
  const [editingId, setEditingId] = useState(null);

  const editingMatch = matches.find((m) => m.id === editingId) || null;

  const playersById = useMemo(() => Object.fromEntries(players.map((p) => [p.id, p.name])), [players]);

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">Booking Management</h1>
      <MatchForm
        players={players}
        tables={tables}
        onSubmit={(draft) => upsertMatch(draft)}
        submitText="Create match"
      />

      {editingMatch && (
        <MatchForm
          key={editingMatch.id}
          players={players}
          tables={tables}
          initialValue={{ ...editingMatch, tableNumber: String(editingMatch.tableNumber) }}
          onSubmit={(draft) => {
            const result = upsertMatch(draft, editingMatch.id);
            if (result.ok) setEditingId(null);
            return result;
          }}
          submitText="Update match"
        />
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-t border-slate-800 text-slate-200">
                  <td className="px-4 py-3">{playersById[match.player1]} vs {playersById[match.player2]}</td>
                  <td className="px-4 py-3">{match.date}</td>
                  <td className="px-4 py-3">{match.startTime} - {match.endTime}</td>
                  <td className="px-4 py-3">{match.tableNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3 py-1 text-xs" onClick={() => setEditingId(match.id)}>Edit</button>
                      <button className="rounded-lg border border-rose-500/60 px-3 py-1 text-xs text-rose-300" onClick={() => deleteMatch(match.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
