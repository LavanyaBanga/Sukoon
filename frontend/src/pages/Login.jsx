import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      toast.success(
        `Welcome back${user.name ? `, ${user.name.split(' ')[0]}` : ''} 🪷`
      );

      navigate(
        user.onboardingCompleted
          ? '/dashboard'
          : '/onboarding'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Could not log in'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEE9FF] px-3 py-6 sm:px-5">

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl" />

      <span className="absolute left-[8%] top-[12%] hidden text-5xl opacity-40 md:block">🦚</span>
      <span className="absolute bottom-[15%] left-[10%] hidden text-4xl opacity-30 md:block">🪈</span>
      <span className="absolute right-[12%] top-[15%] hidden text-3xl opacity-40 md:block">✨</span>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-pink-200 bg-[#FFF8FC]/90 p-5 shadow-xl backdrop-blur-xl sm:p-7 lg:p-8">

        <Link to="/" className="mb-5 flex items-center gap-2">
          <span className="text-3xl">🪷</span>
          <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-xl font-semibold text-transparent">
            Sukoon
          </span>
        </Link>

        <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
          Welcome home
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#36566A] sm:text-3xl">
          Welcome back
        </h1>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Continue your peaceful journey inward.
        </p>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-pink-200" />
          <span>🪶</span>
          <div className="h-px flex-1 bg-pink-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Field
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <Field
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

        </form>

        <p className="mt-5 text-center text-xs text-slate-500 sm:text-sm">
          New here?{' '}
          <Link
            to="/register"
            className="font-medium text-pink-500 hover:text-pink-600"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-5 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 Peace begins with a single pause ✨
        </p>

      </div>
    </div>
  );
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-slate-500">
      {label}
    </label>

    <input
      {...props}
      required
      className="w-full rounded-2xl border border-pink-200 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
    />
  </div>
);

export default Login;