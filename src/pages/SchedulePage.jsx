import { useMemo, useState } from 'react';
import { MatchList } from '../components/MatchList';
import { useApp } from '../context/AppContext';

export const SchedulePage = () => {
  const { matches, players } = useApp();
  const [dateFilter, setDateFilter] = useState('');

  const playersById = useMemo(() => Object.fromEntries(players.map((p) => [p.id, p])), [players]);

  const filteredMatches = useMemo(
    () => (dateFilter ? matches.filter((match) => match.date === dateFilter) : matches),
    [matches, dateFilter]
  );

  return (
    <section className="space-y-5">
      <div className="card p-5 md:flex md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournament Schedule</h1>
          <p className="mt-1 text-sm text-slate-300">Chronologically sorted fixtures with table assignments.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <label className="text-sm">Filter by date</label>
          <input className="field" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </div>
      </div>
      <MatchList matches={filteredMatches} playersById={playersById} />
    </section>
  );
};
