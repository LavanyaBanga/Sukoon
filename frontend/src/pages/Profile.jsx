import React, { useEffect, useState } from 'react';
import {
  BookOpen, Heart, Brain, Sparkles, UserRound,
  Mail, CalendarDays, Pencil, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';

const ACHIEVEMENTS = {
  'First Step': '🌱',
  '3 Day Check-in': '🔥',
  '7 Day Reflection': '🌿',
  'Gratitude Grower': '🌻',
  'Mindful Soul': '🪷',
  'Thoughtful Writer': '📖',
  'Night Owl Reflection': '🌙',
};

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    journals: 0,
    moods: 0,
    mindfulMinutes: 0,
  });

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        const [j, m, mind] = await Promise.all([
          api.get('/journals'),
          api.get('/moods'),
          api.get('/mindfulness/stats'),
        ]);

        setStats({
          journals: j.data.data?.length || 0,
          moods: m.data.data?.length || 0,
          mindfulMinutes: mind.data.data?.totalMinutes || 0,
        });
      } catch (err) {
        console.error('Profile stats error:', err);
      }
    };

    load();
  }, []);

  const save = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty');

    setSaving(true);
    try {
      await api.put('/auth/profile', { name: name.trim() });
      await refreshUser();
      toast.success('Profile updated 🪷');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    ['Journal Entries', stats.journals, BookOpen, 'bg-blue-100 text-blue-500'],
    ['Mood Check-ins', stats.moods, Heart, 'bg-pink-100 text-pink-500'],
    ['Mindful Minutes', stats.mindfulMinutes, Brain, 'bg-violet-100 text-violet-500'],
  ];

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <Card>
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-pink-100 to-violet-100 sm:h-14 sm:w-14">
              <UserRound size={24} className="text-blue-500" />
            </div>

            <div>
              <Label>Your Sukoon journey</Label>
              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Profile
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Look back at the care you have given yourself.
              </p>
            </div>
          </div>
        </Card>


        {/* USER CARD */}
        <section className="rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF7FB] via-[#F7DDEA] to-[#EEF1FF] p-4 shadow-sm sm:p-6">

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-pink-500 to-violet-500 p-[3px] sm:h-24 sm:w-24">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-2xl font-semibold text-[#36566A] sm:text-3xl">
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <Label>Your quiet space</Label>

              <h2 className="mt-1 break-words text-xl font-semibold text-[#36566A] sm:text-2xl">
                {user?.name || 'Sukoon User'}
              </h2>

              <div className="mt-3 space-y-2 text-slate-500">
                <p className="flex min-w-0 items-center justify-center gap-2 text-xs sm:justify-start sm:text-sm">
                  <Mail size={14} className="shrink-0 text-pink-500" />
                  <span className="truncate">{user?.email || '—'}</span>
                </p>

                <p className="flex items-center justify-center gap-2 text-[11px] sm:justify-start sm:text-xs">
                  <CalendarDays size={13} className="shrink-0 text-blue-500" />
                  Joined{' '}
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    undefined,
                    { day: 'numeric', month: 'long', year: 'numeric' }
                  )}
                </p>
              </div>
            </div>

            <span className="hidden text-4xl sm:block">🪷</span>

          </div>
        </section>


        {/* STATS */}
        <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:grid-cols-3">
          {statCards.map(([label, value, Icon, color]) => (
            <Card key={label}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold text-[#36566A] sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    {label}
                  </p>
                </div>

                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                  <Icon size={18} />
                </div>
              </div>
            </Card>
          ))}
        </div>


        {/* ACHIEVEMENTS */}
        <Card>
          <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100">
                <Trophy size={18} className="text-amber-500" />
              </div>

              <div>
                <Label>Little milestones</Label>
                <h2 className="text-lg font-semibold text-[#36566A]">
                  Achievements
                </h2>
              </div>
            </div>

            <Sparkles size={18} className="text-pink-400" />
          </div>


          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {Object.entries(ACHIEVEMENTS).map(([label, emoji]) => {
              const earned = user?.achievements?.includes(label);

              return (
                <div
                  key={label}
                  className={`flex min-h-[105px] flex-col items-center justify-center rounded-2xl border p-3 text-center sm:min-h-[120px] ${
                    earned
                      ? 'border-pink-200 bg-gradient-to-br from-blue-50 via-pink-100 to-violet-50'
                      : 'border-slate-100 bg-slate-50/70 opacity-40 grayscale'
                  }`}
                >
                  <span className="mb-1 text-2xl sm:text-3xl">
                    {emoji}
                  </span>

                  <p className="text-[10px] font-medium text-slate-600 sm:text-xs">
                    {label}
                  </p>

                  <span
                    className={`mt-2 rounded-full px-2 py-1 text-[8px] uppercase ${
                      earned
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {earned ? 'Earned' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>


        {/* UPDATE NAME */}
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100">
              <Pencil size={17} className="text-pink-500" />
            </div>

            <div>
              <Label>Personal details</Label>
              <h2 className="text-lg font-semibold text-[#36566A]">
                Update Name
              </h2>
            </div>
          </div>


          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <UserRound
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400"
              />

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-full border border-pink-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="w-full rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-teal-500 px-7 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-50 sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </Card>


        <p className="px-3 py-3 text-center text-[10px] leading-5 text-slate-400 sm:text-xs">
          🦚 Every small moment of care becomes part of your journey. 🪷
        </p>

      </div>
    </div>
  );
};


const Card = ({ children }) => (
  <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 shadow-sm sm:p-5">
    {children}
  </section>
);

const Label = ({ children }) => (
  <p className="text-[9px] uppercase tracking-[.16em] text-pink-700/70 sm:text-xs">
    {children}
  </p>
);

export default Profile;
