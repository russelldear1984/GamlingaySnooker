import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  initialPlayers,
  openingHours as seedHours,
  tables as seedTables
} from '../data/seedData';
import { supabaseRest } from '../lib/supabaseClient';
import { compareMatches } from '../utils/dateUtils';
import { validateMatch } from '../utils/validation';

const AppContext = createContext(null);

const loadOrSeed = async (tableName, seedData, orderBy = null) => {
  const data = await supabaseRest.select(tableName, { orderBy });
  if (data?.length) return data;
  const inserted = await supabaseRest.insert(tableName, seedData);
  return inserted || seedData;
};

const normalizeMatch = (match) => ({
  ...match,
  tableNumber: Number(match.tableNumber ?? match.table_number),
  startTime: match.startTime ?? match.start_time,
  endTime: match.endTime ?? match.end_time
});

export const AppProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);
  const [tables, setTables] = useState([]);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const sortedMatches = useMemo(() => [...matches].sort(compareMatches), [matches]);

  const refreshMatches = async () => {
    const loadedMatches = await supabaseRest.select('matches', { orderBy: 'date' });
    setMatches((loadedMatches || []).map(normalizeMatch));
    return loadedMatches || [];
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const [loadedPlayers, loadedTables, loadedMatches, loadedOpeningHours] = await Promise.all([
          loadOrSeed('players', initialPlayers, 'name'),
          loadOrSeed(
            'tables',
            seedTables.map((table) => ({ id: table.id, table_number: table.tableNumber })),
            'table_number'
          ),
          supabaseRest.select('matches', { orderBy: 'date' }),
          loadOrSeed(
            'opening_hours',
            seedHours.map((day) => ({
              day_of_week: day.dayOfWeek,
              is_open: day.isOpen,
              open_time: day.openTime,
              close_time: day.closeTime
            })),
            'day_of_week'
          )
        ]);

        setPlayers(loadedPlayers);
        setTables(loadedTables.map((table) => ({ ...table, tableNumber: table.table_number ?? table.tableNumber })));
        setMatches(loadedMatches.map(normalizeMatch));
        setOpeningHours(
          loadedOpeningHours.map((day) => ({
            dayOfWeek: day.dayOfWeek ?? day.day_of_week,
            isOpen: day.isOpen ?? day.is_open,
            openTime: day.openTime ?? day.open_time,
            closeTime: day.closeTime ?? day.close_time
          }))
        );
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load data from Supabase.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const upsertMatch = async (draft, editMatchId = null) => {
    const validationError = validateMatch({ draft, openingHours, matches, editMatchId });
    if (validationError) return { ok: false, error: validationError };

    const payload = {
      id: editMatchId ?? crypto.randomUUID(),
      player1: draft.player1,
      player2: draft.player2,
      table_number: Number(draft.tableNumber),
      round: draft.round,
      date: draft.date,
      start_time: draft.startTime,
      end_time: draft.endTime,
      status: draft.status || 'Scheduled'
    };

    try {
      if (editMatchId) {
        await supabaseRest.updateEq('matches', 'id', editMatchId, payload);
      } else {
        await supabaseRest.insert('matches', payload);
      }
      await refreshMatches();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || 'Unable to save match.' };
    }
  };

  const deleteMatch = async (id) => {
    try {
      await supabaseRest.deleteEq('matches', 'id', id);
      await refreshMatches();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || 'Unable to delete match.' };
    }
  };

  const upsertPlayer = async ({ id, name }) => {
    const trimmedName = (name || '').trim();
    if (!trimmedName) return { ok: false, error: 'Player name is required.' };

    const duplicateName = players.some(
      (player) => player.id !== id && player.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicateName) return { ok: false, error: 'That player name already exists.' };

    try {
      if (id) {
        const rows = await supabaseRest.updateEq('players', 'id', id, { name: trimmedName });
        setPlayers((prev) => prev.map((player) => (player.id === id ? rows[0] : player)));
      } else {
        const rows = await supabaseRest.insert('players', { id: crypto.randomUUID(), name: trimmedName });
        setPlayers((prev) => [...prev, rows[0]]);
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || 'Unable to save player.' };
    }
  };

  const deletePlayer = async (playerId) => {
    const hasMatch = matches.some((match) => match.player1 === playerId || match.player2 === playerId);
    if (hasMatch) {
      return {
        ok: false,
        error: 'Cannot delete this player because they are already assigned to one or more matches.'
      };
    }

    try {
      await supabaseRest.deleteEq('players', 'id', playerId);
      setPlayers((prev) => prev.filter((player) => player.id !== playerId));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || 'Unable to delete player.' };
    }
  };

  const updateOpeningHour = async (dayOfWeek, patch) => {
    const payload = {
      ...(patch.isOpen !== undefined ? { is_open: patch.isOpen } : {}),
      ...(patch.openTime !== undefined ? { open_time: patch.openTime } : {}),
      ...(patch.closeTime !== undefined ? { close_time: patch.closeTime } : {})
    };

    try {
      const rows = await supabaseRest.updateEq('opening_hours', 'day_of_week', dayOfWeek, payload);
      const updated = rows[0];
      setOpeningHours((prev) =>
        prev.map((day) =>
          day.dayOfWeek === dayOfWeek
            ? {
                dayOfWeek: updated.day_of_week,
                isOpen: updated.is_open,
                openTime: updated.open_time,
                closeTime: updated.close_time
              }
            : day
        )
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || 'Unable to update opening hours.' };
    }
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
    updateOpeningHour,
    isLoading,
    errorMessage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
