import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, ResponsiveContainer,
  Tooltip, CartesianGrid
} from 'recharts';
import {
  Bird, MessageCircle, Wind, BookOpen,
  Moon, Flame, Clock3, NotebookPen, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';

const MOODS = [
  ['Great', '😄'], ['Good', '🙂'], ['Okay', '😐'],
  ['Low', '😔'], ['Very Low', '😭'], ['Anxious', '😰'],
];

const greetingForTime = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);
  const [journalCount, setJournalCount] = useState(0);
  const [mindfulMinutes, setMindfulMinutes] = useState(0);
  const [streak, setStreak] = useState(user?.streak || 0);
  const [loggingMood, setLoggingMood] = useState(false);

  const load = async () => {
    try {
      const [moodRes, journalRes, mindfulRes] = await Promise.all([
        api.get('/moods', { params: { days: 7 } }),
        api.get('/journals'),
        api.get('/mindfulness/stats'),
      ]);

      setMoods(moodRes.data.data || []);
      setJournalCount(journalRes.data.data?.length || 0);
      setMindfulMinutes(mindfulRes.data.data?.totalMinutes || 0);
    } catch (err) {
      console.error('Dashboard error:', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logMood = async mood => {
    if (loggingMood) return;

    setLoggingMood(true);
    try {
      const { data } = await api.post('/moods', { mood });
      setStreak(data.streak ?? streak);
      toast.success('Mood logged 🪷');
      load();
    } catch {
      toast.error('Could not log mood');
    } finally {
      setLoggingMood(false);
    }
  };

  const chartData = [...moods].reverse().map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(undefined, {
      weekday: 'short',
    }),
    score: item.score,
  }));

  const stats = [
    ['Current Mood', moods[0]?.mood || '—', Moon, '🌙'],
    ['Wellness Streak', `${streak} days`, Flame, '🔥'],
    ['Journal Entries', journalCount, NotebookPen, '📖'],
    ['Mindful Minutes', mindfulMinutes, Clock3, '🪷'],
  ];

  const actions = [
    ['/ask-krishna', 'Ask Krishna', Bird, '🦚'],
    ['/journal', 'Write Journal', BookOpen, '📖'],
    ['/breathe', 'Breathe', Wind, '🌿'],
    ['/talk', 'Talk to AI', MessageCircle, '💬'],
    ['/mood', 'Mood Check-in', Moon, '🌙'],
  ];

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <section className="relative overflow-hidden rounded-3xl border border-pink-200 bg-[#FFF7FB]/85 p-4 shadow-sm sm:p-6">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-pink-300/20 blur-3xl" />
          <span className="absolute right-5 top-4 hidden text-4xl opacity-40 sm:block">🦚</span>

          <div className="relative">
            <Label>Your peaceful corner</Label>

            <h1 className="mt-2 text-2xl font-semibold text-[#36566A] sm:text-3xl lg:text-4xl">
              {greetingForTime()},{' '}
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0] || 'friend'}
              </span>{' '}
              🪷
            </h1>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              How is your mind feeling today?
            </p>
          </div>
        </section>

        {/* MOOD */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Label>Mood check-in</Label>
              <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                How are you feeling?
              </h2>
            </div>
            <span className="text-2xl">🪷</span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-[430px]:grid-cols-3 lg:grid-cols-6">
            {MOODS.map(([label, emoji]) => (
              <button
                key={label}
                disabled={loggingMood}
                onClick={() => logMood(label)}
                className="flex min-h-[85px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-pink-200 bg-white/75 p-2 transition hover:-translate-y-0.5 hover:bg-pink-50 hover:shadow-sm disabled:opacity-50 sm:min-h-[100px]"
              >
                <span className="text-2xl sm:text-3xl">{emoji}</span>
                <span className="text-[11px] text-slate-500 sm:text-xs">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value, Icon, emoji]) => (
            <Card key={label}>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 via-fuchsia-50 to-violet-100">
                  <Icon size={18} className="text-pink-500" />
                </div>
                <span className="text-xl sm:text-2xl">{emoji}</span>
              </div>

              <p className="mt-4 text-[10px] text-slate-400 sm:text-xs">
                {label}
              </p>

              <p className="mt-1 break-words text-lg font-semibold text-[#36566A] sm:text-2xl">
                {value}
              </p>
            </Card>
          ))}
        </div>

        {/* GRAPH + REFLECTION */}
        <div className="grid gap-4 xl:grid-cols-3">

          <Card extra="xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Label>Your emotional rhythm</Label>
                <h3 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                  Weekly Mood
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                <Sparkles size={18} className="text-pink-500" />
              </div>
            </div>

            <div className="h-[220px] w-full sm:h-[270px] lg:h-[300px]">
              {chartData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="4 4"
                      stroke="#F1DDE7"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#D36A9A"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="mb-2 text-4xl">🌱</span>
                  <p className="text-sm text-slate-500">
                    Your mood journey will appear here.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Start with today's check-in.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* REFLECTION */}
          <section className="relative overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF7FB] via-[#F7DCEA] to-[#EEE9FF] p-5 shadow-sm sm:p-6">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl" />
            <span className="absolute right-5 top-5 text-3xl opacity-25">🦚</span>

            <div className="relative">
              <Label>A gentle reminder</Label>

              <h3 className="mt-2 text-lg font-semibold text-[#36566A] sm:text-xl">
                Daily Reflection
              </h3>

              <p className="mt-5 text-sm italic leading-7 text-slate-500 sm:mt-7">
                “Your thoughts are visitors, not permanent residents. Let today's
                feelings pass through without needing to hold onto them.”
              </p>

              <p className="mt-5 text-xs text-slate-400">
                🪶 Pause · Reflect · Let go
              </p>
            </div>
          </section>

        </div>

        {/* QUICK ACTIONS */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Label>Your space</Label>
              <h3 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                Quick Actions
              </h3>
            </div>
            <span className="text-2xl">✨</span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {actions.map(([to, label, Icon, emoji]) => (
              <Link
                key={to}
                to={to}
                className="flex min-h-[95px] flex-col items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-white/75 p-3 text-center transition hover:-translate-y-0.5 hover:bg-pink-50 hover:shadow-sm sm:min-h-[110px]"
              >
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 via-fuchsia-50 to-violet-100 sm:h-11 sm:w-11">
                    <Icon size={18} className="text-pink-500" />
                  </div>

                  <span className="absolute -right-2 -top-2 text-xs">
                    {emoji}
                  </span>
                </div>

                <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <p className="py-3 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 One gentle step at a time. 🪷
        </p>

      </div>
    </div>
  );
};

const Card = ({ children, extra = '' }) => (
  <section className={`rounded-3xl border border-pink-200 bg-[#FFF7FB]/85 p-4 shadow-sm sm:p-5 ${extra}`}>
    {children}
  </section>
);

const Label = ({ children }) => (
  <p className="text-[9px] uppercase tracking-[.16em] text-pink-700/70 sm:text-xs">
    {children}
  </p>
);

export default Dashboard;