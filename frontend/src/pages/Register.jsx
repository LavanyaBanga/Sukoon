import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const fields = [
  ['name', 'Name', 'text', 'Your name'],
  ['email', 'Email', 'email', 'you@example.com'],
  ['password', 'Password', 'password', '••••••••'],
  ['confirm', 'Confirm Password', 'password', '••••••••'],
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password !== form.confirm)
      return toast.error('Passwords do not match');

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      toast.success('Welcome to Sukoon 🪷');
      navigate('/onboarding');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] px-3 py-6 sm:px-5 sm:py-8">

      {/* BACKGROUND */}
      <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute -right-28 top-1/3 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl sm:h-96 sm:w-96" />

      <span className="absolute left-[7%] top-[10%] hidden text-5xl opacity-40 md:block">🦚</span>
      <span className="absolute bottom-[10%] left-[8%] hidden text-4xl opacity-35 md:block">🪈</span>
      <span className="absolute right-[9%] top-[14%] hidden text-3xl opacity-45 md:block">✨</span>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-pink-200 bg-[#FFF8FC]/85 p-4 shadow-xl backdrop-blur-xl sm:p-7 lg:p-8">

        {/* LOGO */}
        <Link to="/" className="mb-5 flex items-center gap-2 sm:mb-6">
          <span className="text-2xl sm:text-3xl">🪷</span>
          <span className="bg-gradient-to-r from-blue-600 via-pink-500 to-violet-500 bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
            Sukoon
          </span>
        </Link>

        {/* HEADING */}
        <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
          Your peaceful corner
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[#35566A] sm:text-3xl">
          Begin your journey
        </h1>

        <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
          Create a calm space for your thoughts, emotions and reflections.
        </p>

        <div className="my-5 flex items-center gap-3 sm:my-6">
          <div className="h-px flex-1 bg-pink-100" />
          <span className="text-sm">🪶</span>
          <div className="h-px flex-1 bg-pink-100" />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {fields.map(([name, label, type, placeholder]) => (
            <div key={name}>
              <label className="mb-1.5 block text-[11px] font-medium text-slate-500 sm:text-xs">
                {label}
              </label>

              <input
                name={name}
                type={type}
                required
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-pink-200 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 sm:py-3.5"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-sky-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* LOGIN */}
        <p className="mt-5 text-center text-xs text-slate-500 sm:mt-6 sm:text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-pink-500 hover:text-pink-600"
          >
            Log in
          </Link>
        </p>

        <p className="mt-5 text-center text-[10px] leading-5 text-slate-400 sm:mt-6 sm:text-xs">
          🦚 Every peaceful journey begins with one small step ✨
        </p>

      </div>
    </div>
  );
};

export default Register;