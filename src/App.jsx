import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './layouts/AppShell';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminMatchesPage } from './pages/AdminMatchesPage';
import { AdminOpeningHoursPage } from './pages/AdminOpeningHoursPage';
import { HomePage } from './pages/HomePage';
import { SchedulePage } from './pages/SchedulePage';

export default function App() {
  return (
    <AppShell>
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
