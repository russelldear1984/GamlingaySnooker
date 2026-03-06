import { useMemo, useState } from 'react';
import { MatchForm } from '../components/MatchForm';
import { useApp } from '../context/AppContext';

export const AdminMatchesPage = () => {
  const { matches, players, tables, upsertMatch, deleteMatch, upsertPlayer, deletePlayer } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [playerNameDraft, setPlayerNameDraft] = useState('');
  const [playerError, setPlayerError] = useState('');

  const editingMatch = matches.find((m) => m.id === editingId) || null;

  const playersById = useMemo(() => Object.fromEntries(players.map((p) => [p.id, p.name])), [players]);

  const submitPlayer = async (event) => {
    event.preventDefault();
    const result = await upsertPlayer({ id: editingPlayerId, name: playerNameDraft });

    if (!result.ok) {
      setPlayerError(result.error);
      return;
    }

    setPlayerError('');
    setEditingPlayerId(null);
    setPlayerNameDraft('');
  };

  const startEditingPlayer = (player) => {
    setEditingPlayerId(player.id);
    setPlayerNameDraft(player.name);
    setPlayerError('');
  };

  const removePlayer = async (playerId) => {
    const result = await deletePlayer(playerId);
    if (!result.ok) {
      setPlayerError(result.error);
      return;
    }
    setPlayerError('');
  };

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">Booking Management</h1>

      <div className="card space-y-4 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-white">Players</h2>
        <p className="text-sm text-slate-300">Add, rename, or remove players used in match dropdowns.</p>

        <form className="space-y-3" onSubmit={submitPlayer}>
          {playerError && (
            <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{playerError}</p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="field"
              value={playerNameDraft}
              onChange={(event) => setPlayerNameDraft(event.target.value)}
              placeholder="Enter player name"
            />
            <button className="btn-primary whitespace-nowrap" type="submit">
              {editingPlayerId ? 'Update player' : 'Add player'}
            </button>
            {editingPlayerId && (
              <button
                className="btn-secondary whitespace-nowrap"
                type="button"
                onClick={() => {
                  setEditingPlayerId(null);
                  setPlayerNameDraft('');
                  setPlayerError('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="max-h-56 overflow-auto rounded-xl border border-slate-700/70">
          {players.length ? (
            <ul className="divide-y divide-slate-800/90">
              {players.map((player) => (
                <li key={player.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span>{player.name}</span>
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary px-3 py-1 text-xs"
                      onClick={() => startEditingPlayer(player)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-rose-500/60 px-3 py-1 text-xs text-rose-300"
                      onClick={() => removePlayer(player.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-slate-300">No players yet. Add one above to get started.</p>
          )}
        </div>
      </div>

      <MatchForm players={players} tables={tables} onSubmit={(draft) => upsertMatch(draft)} submitText="Create match" />

      {editingMatch && (
        <MatchForm
          key={editingMatch.id}
          players={players}
          tables={tables}
          initialValue={{ ...editingMatch, tableNumber: String(editingMatch.tableNumber) }}
          onSubmit={async (draft) => {
            const result = await upsertMatch(draft, editingMatch.id);
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
                  <td className="px-4 py-3">
                    {playersById[match.player1]} vs {playersById[match.player2]}
                  </td>
                  <td className="px-4 py-3">{match.date}</td>
                  <td className="px-4 py-3">
                    {match.startTime} - {match.endTime}
                  </td>
                  <td className="px-4 py-3">{match.tableNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3 py-1 text-xs" onClick={() => setEditingId(match.id)} type="button">
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-rose-500/60 px-3 py-1 text-xs text-rose-300"
                        onClick={async () => {
                          const result = await deleteMatch(match.id);
                          if (!result.ok) setPlayerError(result.error);
                        }}
                        type="button"
                      >
                        Delete
                      </button>
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
