import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  ResponsiveContainer, Tooltip,
  BarChart, Bar, CartesianGrid
} from 'recharts';

import {
  Sparkles, BookOpen, Flower2,
  Brain, TrendingUp, CalendarDays,
  Heart, Leaf
} from 'lucide-react';

import api from '../utils/api';

const Insights = () => {
  const [analytics, setAnalytics] = useState(null);
  const [journalCount, setJournalCount] = useState(0);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [mindful, setMindful] = useState({ totalMinutes: 0 });
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, j, g, m] = await Promise.all([
          api.get('/moods/analytics'),
          api.get('/journals'),
          api.get('/gratitude'),
          api.get('/mindfulness/stats'),
        ]);

        setAnalytics(a.data.data);
        setJournalCount(j.data.data?.length || 0);
        setGratitudeCount(g.data.count || 0);
        setMindful(m.data.data || { totalMinutes: 0 });
      } catch (err) {
        console.error('Analytics error:', err);
      }
    };

    const weeklyInsight = async () => {
      try {
        const { data } = await api.get('/ai/weekly-insight');
        setInsight(data.data.insight);
      } catch {
        setInsight('Could not generate your weekly reflection right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
    weeklyInsight();
  }, []);

  const positivePct = analytics?.recent?.length
    ? Math.round(
        analytics.recent.filter(x => x.score >= 6).length /
        analytics.recent.length * 100
      )
    : 0;

  const moodData = analytics?.recent?.map(x => ({
    date: new Date(x.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    score: x.score,
  })) || [];

  const weekdayData =
    analytics?.weekdayAverages?.filter(x => x.average !== null) || [];

  const stats = [
    {
      label: 'Journal Entries',
      value: journalCount,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-500',
      emoji: '📖',
    },
    {
      label: 'Gratitude Entries',
      value: gratitudeCount,
      icon: Flower2,
      color: 'bg-pink-50 text-pink-500',
      emoji: '🌻',
    },
    {
      label: 'Mindful Minutes',
      value: mindful.totalMinutes || 0,
      icon: Brain,
      color: 'bg-emerald-50 text-emerald-500',
      emoji: '🪷',
    },
  ];

  return (
    <div className="min-h-screen rounded-3xl bg-gradient-to-br from-[#FFF9F3] via-[#FFF4F8] to-[#EDF7FF] p-4 sm:p-6">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <section className="rounded-3xl border border-pink-100 bg-white/75 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 text-3xl">
              🪷
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-700/70">
                Understanding your journey
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-slate-700 sm:text-3xl">
                Your Patterns
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                A gentle look at your moods, gratitude and mindful moments.
              </p>
            </div>

          </div>
        </section>


        {/* AI REFLECTION */}
        <section className="min-h-[220px] rounded-3xl border border-yellow-100 bg-gradient-to-br from-white via-pink-50 to-yellow-50 p-6 shadow-sm">

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
              <Sparkles size={19} className="text-amber-400" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-amber-700/70">
                A reflection for you
              </p>

              <h2 className="text-xl font-semibold text-slate-700">
                AI Weekly Reflection
              </h2>
            </div>
          </div>

          <div className="mb-5 h-px bg-gradient-to-r from-pink-200 via-yellow-200 to-transparent" />

          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {loading ? '✨ Reflecting on your week...' : insight}
          </p>

          <div className="mt-5 flex items-center gap-2 border-t border-pink-100 pt-4 text-xs text-slate-400">
            <Leaf size={13} className="text-emerald-500" />
            Notice the patterns without judging them.
          </div>

        </section>


        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, color, emoji }) => (
            <div
              key={label}
              className="flex min-h-[180px] items-center justify-between rounded-3xl border border-pink-100 bg-white/75 p-5 shadow-sm"
            >
              <div>
                <p className="text-xs text-slate-400">{label}</p>

                <p className="mt-2 text-3xl font-semibold text-slate-700">
                  {value}
                </p>

                <p className="mt-3 text-xl">{emoji}</p>
              </div>

              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                <Icon size={19} />
              </div>
            </div>
          ))}
        </div>


        {analytics && (
          <>

            {/* MOOD TREND */}
            <ChartCard
              title="Mood Trend"
              subtitle="Emotional rhythm"
              icon={<TrendingUp size={19} className="text-blue-500" />}
            >
              {moodData.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={moodData}>

                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="4 4"
                      stroke="#eee"
                    />

                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis domain={[0, 10]} hide />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#5B8BD0"
                      strokeWidth={3}
                    />

                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Empty
                  emoji="🌱"
                  text="Your mood trend will appear here."
                />
              )}
            </ChartCard>


            {/* WEEKDAY */}
            <ChartCard
              title="Mood by Weekday"
              subtitle="Across your week"
              icon={<CalendarDays size={19} className="text-pink-500" />}
            >
              {weekdayData.length ? (
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={weekdayData}>

                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="4 4"
                      stroke="#eee"
                    />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="average"
                      fill="#4E9C91"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty
                  emoji="🪷"
                  text="Continue logging moods to see this pattern."
                />
              )}
            </ChartCard>


            {/* BOTTOM STATS */}
            <div className="grid gap-4 sm:grid-cols-3">

              <SmallCard
                icon={Heart}
                title="Positive-Day %"
                value={`${positivePct}%`}
                color="bg-pink-50 text-pink-400"
              />

              <SmallCard
                icon={Sparkles}
                title="Main Triggers"
                value={analytics.topFactors?.join(', ') || '—'}
                color="bg-yellow-50 text-amber-400"
              />

              <SmallCard
                icon={CalendarDays}
                title="Best Day"
                value={analytics.bestDayOfWeek || '—'}
                color="bg-emerald-50 text-emerald-500"
              />

            </div>

          </>
        )}


        <p className="py-4 text-center text-xs text-slate-400">
          🦚 Growth is easier to notice when you look back gently. 🪷
        </p>

      </div>
    </div>
  );
};


const ChartCard = ({ title, subtitle, icon, children }) => (
  <section className="min-h-[390px] rounded-3xl border border-pink-100 bg-white/75 p-6 shadow-sm">

    <div className="mb-6 flex items-center justify-between">

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-amber-700/70">
          {subtitle}
        </p>

        <h2 className="mt-1 text-xl font-semibold text-slate-700">
          {title}
        </h2>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-50">
        {icon}
      </div>

    </div>

    {children}

  </section>
);


const SmallCard = ({ icon: Icon, title, value, color }) => (
  <div className="flex min-h-[180px] flex-col items-center justify-center rounded-3xl border border-pink-100 bg-white/75 p-5 text-center shadow-sm">

    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full ${color}`}>
      <Icon size={19} />
    </div>

    <p className="text-xs text-slate-400">
      {title}
    </p>

    <p className="mt-2 text-lg font-semibold text-slate-700">
      {value}
    </p>

  </div>
);


const Empty = ({ emoji, text }) => (
  <div className="flex h-[270px] flex-col items-center justify-center text-center">

    <span className="mb-3 text-5xl">
      {emoji}
    </span>

    <p className="text-sm text-slate-400">
      {text}
    </p>

  </div>
);


export default Insights;