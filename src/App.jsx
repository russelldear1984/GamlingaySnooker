import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useApp } from './context/AppContext';
import { AppShell } from './layouts/AppShell';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminMatchesPage } from './pages/AdminMatchesPage';
import { AdminOpeningHoursPage } from './pages/AdminOpeningHoursPage';
import { HomePage } from './pages/HomePage';
import { SchedulePage } from './pages/SchedulePage';

export default function App() {
  const { isLoading, errorMessage } = useApp();

  if (isLoading) {
    return (
      <AppShell>
        <div className="card p-6 text-sm text-slate-300">
          Loading tournament data from Supabase...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {errorMessage}
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute>
              <AdminMatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/opening-hours"
          element={
            <ProtectedRoute>
              <AdminOpeningHoursPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  );
}
