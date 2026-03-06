import { createContext, useContext, useMemo, useState } from 'react';
import { matches as seedMatches, openingHours as seedHours, players, tables } from '../data/seedData';
import { compareMatches } from '../utils/dateUtils';
import { validateMatch } from '../utils/validation';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
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
    updateOpeningHour
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
