import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home', label: 'Home' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/admin/dashboard', label: 'Admin' }
];

export const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link to="/home" className="text-lg font-bold text-teal-400">
            Gamlingay Snooker Club
          </Link>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/70'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
};
