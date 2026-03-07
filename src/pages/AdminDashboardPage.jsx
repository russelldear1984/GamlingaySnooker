import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage = () => {
  const { matches, tables, players } = useApp();
  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4"><p className="text-sm text-slate-400">Matches</p><p className="text-3xl font-bold">{matches.length}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-400">Players</p><p className="text-3xl font-bold">{players.length}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-400">Tables</p><p className="text-3xl font-bold">{tables.length}</p></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/matches" className="card p-6 hover:border-teal-300/50">
          <h2 className="text-xl font-semibold">Booking Management</h2>
          <p className="mt-2 text-slate-300">Create, edit and delete tournament matches.</p>
        </Link>
        <Link to="/admin/opening-hours" className="card p-6 hover:border-teal-300/50">
          <h2 className="text-xl font-semibold">Opening Hours</h2>
          <p className="mt-2 text-slate-300">Set club opening windows and closed days.</p>
        </Link>
      </div>
    </section>
  );
};
