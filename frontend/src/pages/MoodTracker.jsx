import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, ResponsiveContainer,
  Tooltip, CartesianGrid
} from 'recharts';
import { Sparkles, TrendingUp, CalendarDays, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const MOODS = ['Amazing','Happy','Good','Neutral','Sad','Very Sad','Anxious','Angry','Exhausted'];

const EMOJI = {
  Amazing:'🤩', Happy:'😊', Good:'🙂', Neutral:'😐',
  Sad:'😔', 'Very Sad':'😢', Anxious:'😰', Angry:'😡', Exhausted:'😴'
};

const FACTORS = [
  'Studies','Work','Family','Friends','Relationship','Health',
  'Sleep','Career','Money','Social Media','Self-image','Other'
];

const MoodTracker = () => {
  const [mood, setMood] = useState('');
  const [factors, setFactors] = useState([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [range, setRange] = useState(7);
  const [entries, setEntries] = useState([]);

  const load = async () => {
    try {
      const [a, e] = await Promise.all([
        api.get('/moods/analytics'),
        api.get('/moods', { params: { days: range } })
      ]);
      setAnalytics(a.data.data);
      setEntries(e.data.data || []);
    } catch (err) {
      console.error('Could not load mood data', err);
    }
  };

  useEffect(() => { load(); }, [range]);

  const toggleFactor = (item) =>
    setFactors((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

  const submit = async () => {
    if (!mood) return toast.error('Select a mood first');

    setSaving(true);
    try {
      await api.post('/moods', { mood, factors, note });
      toast.success('Mood saved 🪷');
      setMood('');
      setFactors([]);
      setNote('');
      load();
    } catch {
      toast.error('Could not save mood');
    } finally {
      setSaving(false);
    }
  };

  const chartData = [...entries].reverse().map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    }),
    score: e.score
  }));

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">

        {/* HEADER */}
        <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-pink-100 to-violet-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
              🌙
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
                Your emotional rhythm
              </p>
              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Mood Tracker
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Notice how you feel and gently understand your patterns.
              </p>
            </div>
          </div>
        </section>


        {/* CHECK-IN */}
        <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 shadow-sm sm:p-6">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
                Mood check-in
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                How are you feeling today?
              </h2>
            </div>
            <span className="text-2xl">🪷</span>
          </div>


          {/* MOODS */}
          <div className="grid grid-cols-2 gap-2 min-[430px]:grid-cols-3 sm:grid-cols-5 xl:grid-cols-9">
            {MOODS.map((item) => (
              <button
                key={item}
                onClick={() => setMood(item)}
                className={`flex min-h-[90px] flex-col items-center justify-center gap-1.5 rounded-2xl border p-2 transition hover:-translate-y-0.5 ${
                  mood === item
                    ? 'border-pink-300 bg-gradient-to-br from-blue-100 via-pink-100 to-violet-100 shadow-md'
                    : 'border-pink-100 bg-white/80 hover:border-pink-200 hover:bg-pink-50'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{EMOJI[item]}</span>
                <span className="text-[11px] font-medium text-slate-600 sm:text-xs">
                  {item}
                </span>
              </button>
            ))}
          </div>


          <div className="my-5 h-px bg-pink-100" />


          {/* FACTORS */}
          <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
            What shaped your day?
          </p>

          <h3 className="mb-3 mt-1 text-base font-semibold text-[#36566A] sm:text-lg">
            What influenced your mood?
          </h3>

          <div className="flex flex-wrap gap-2">
            {FACTORS.map((item) => (
              <button
                key={item}
                onClick={() => toggleFactor(item)}
                className={`rounded-full border px-3 py-2 text-[11px] transition sm:px-4 sm:text-xs ${
                  factors.includes(item)
                    ? 'border-transparent bg-gradient-to-r from-blue-500 via-violet-400 to-pink-500 text-white shadow-sm'
                    : 'border-pink-200 bg-white/80 text-slate-500 hover:bg-pink-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>


          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write anything you'd like to remember about today..."
            className="mt-5 w-full resize-none rounded-2xl border border-pink-200 bg-white/80 p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 sm:p-4"
          />

          <button
            onClick={submit}
            disabled={saving}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50 sm:ml-auto sm:block sm:w-auto"
          >
            {saving ? 'Saving...' : 'Save Mood 🪷'}
          </button>

        </section>


        {/* HISTORY HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
              Your patterns
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
              Mood History
            </h2>
          </div>

          <div className="flex gap-2">
            {[7, 30].map((days) => (
              <button
                key={days}
                onClick={() => setRange(days)}
                className={`rounded-full border px-4 py-2 text-xs ${
                  range === days
                    ? 'border-transparent bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                    : 'border-pink-200 bg-white/80 text-slate-500'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>

        </div>


        {/* GRAPH */}
        <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 shadow-sm sm:p-6">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
                Emotional pattern
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                Mood Graph
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <TrendingUp size={18} className="text-blue-500" />
            </div>
          </div>


          <div className="h-[230px] w-full sm:h-[270px] lg:h-[300px]">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -20 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F3DCE7" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#60A5FA" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="mb-2 text-4xl">🌱</span>
                <p className="text-sm text-slate-500">No mood history yet.</p>
                <p className="mt-1 text-xs text-slate-400">
                  Your emotional journey will appear here.
                </p>
              </div>
            )}
          </div>

        </section>


        {/* ANALYTICS */}
        {analytics && (
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">

            <StatCard
              icon={Heart}
              title="Most Frequent Mood"
              value={analytics.mostFrequentMood || '—'}
              color="bg-pink-100 text-pink-500"
            />

            <StatCard
              icon={CalendarDays}
              title="Best Day of Week"
              value={analytics.bestDayOfWeek || '—'}
              color="bg-blue-100 text-blue-500"
            />

            <StatCard
              icon={Sparkles}
              title="Common Triggers"
              value={analytics.topFactors?.join(', ') || '—'}
              color="bg-violet-100 text-violet-500"
            />

          </div>
        )}


        <p className="py-3 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 Every feeling is worth noticing. 🪷
        </p>

      </div>
    </div>
  );
};


const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 text-center shadow-sm sm:p-5">

    <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full ${color}`}>
      <Icon size={17} />
    </div>

    <p className="text-[10px] text-slate-400 sm:text-xs">{title}</p>

    <p className="mt-1 break-words text-base font-semibold text-[#36566A] sm:text-lg">
      {value}
    </p>

  </div>
);

export default MoodTracker;