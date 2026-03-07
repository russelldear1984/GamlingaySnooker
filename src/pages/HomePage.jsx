import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <section className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
      <div className="card p-6 md:p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-300">Gamlingay Social Club</p>
        <h1 className="mt-3 text-3xl font-extrabold text-white md:text-5xl">Snooker Tournament Scheduler</h1>
        <p className="mt-4 max-w-xl text-slate-300">
          View upcoming matches, check table allocations, and stay ready for your next frame.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/schedule" className="btn-primary">View tournament schedule</Link>
          <Link to="/admin/login" className="btn-secondary">Admin access</Link>
        </div>
      </div>
      <div className="card p-6 md:p-8">
        <h2 className="text-xl font-semibold">Quick Access</h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-300">event</span> Daily match listing</li>
          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-300">sports</span> Table-by-table bookings</li>
          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-300">groups</span> Player fixtures and rounds</li>
        </ul>
      </div>
    </section>
  );
};
