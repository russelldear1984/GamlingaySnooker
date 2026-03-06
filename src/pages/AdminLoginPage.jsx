import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || '246802';

export const AdminLoginPage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { setAdminAuthenticated } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    if (code !== ADMIN_CODE) {
      setError('Incorrect access code.');
      return;
    }

    setAdminAuthenticated(true);
    navigate('/admin/dashboard');
  };

  return (
    <section className="mx-auto max-w-md">
      <form className="card p-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">Enter your 6-digit code to access admin features.</p>
        {error && <p className="mt-3 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
        <label className="mt-4 block text-sm">Access code</label>
        <input
          className="field"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="••••••"
        />
        <button className="btn-primary mt-5 w-full" type="submit">Sign in</button>
      </form>
    </section>
  );
};
