import { createContext, useContext, useMemo, useState } from 'react';
import {
  initialPlayers,
  matches as seedMatches,
  openingHours as seedHours,
  tables
} from '../data/seedData';
import { compareMatches } from '../utils/dateUtils';
import { validateMatch } from '../utils/validation';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [matches, setMatches] = useState(seedMatches);
  const [openingHours, setOpeningHours] = useState(seedHours);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const sortedMatches = useMemo(() => [...matches].sort(compareMatches), [matches]);

  const upsertMatch = (draft, editMatchId = null) => {
    const error = validateMatch({ draft, openingHours, matches, editMatchId });
    if (error) return { ok: false, error };

    const normalized = {
      ...draft,
      id: editMatchId ?? crypto.randomUUID(),
      tableNumber: Number(draft.tableNumber),
      status: draft.status || 'Scheduled'
    };

    setMatches((prev) => {
      if (editMatchId) {
        return prev.map((match) => (match.id === editMatchId ? normalized : match));
      }
      return [...prev, normalized];
    });

    return { ok: true };
  };

  const deleteMatch = (id) => setMatches((prev) => prev.filter((match) => match.id !== id));

  const upsertPlayer = ({ id, name }) => {
    const trimmedName = (name || '').trim();
    if (!trimmedName) return { ok: false, error: 'Player name is required.' };

    const duplicateName = players.some(
      (player) => player.id !== id && player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicateName) return { ok: false, error: 'That player name already exists.' };

    if (id) {
      setPlayers((prev) => prev.map((player) => (player.id === id ? { ...player, name: trimmedName } : player)));
      return { ok: true };
    }

    setPlayers((prev) => [...prev, { id: crypto.randomUUID(), name: trimmedName }]);
    return { ok: true };
  };

  const deletePlayer = (playerId) => {
    const hasMatch = matches.some((match) => match.player1 === playerId || match.player2 === playerId);
    if (hasMatch) {
      return {
        ok: false,
        error: 'Cannot delete this player because they are already assigned to one or more matches.'
      };
    }

    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    return { ok: true };
  };

  const updateOpeningHour = (dayOfWeek, patch) => {
    setOpeningHours((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day))
    );
  };

  const value = {
    players,
    tables,
    matches: sortedMatches,
    openingHours,
    adminAuthenticated,
    setAdminAuthenticated,
    upsertMatch,
    deleteMatch,
    upsertPlayer,
    deletePlayer,
    updateOpeningHour
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
