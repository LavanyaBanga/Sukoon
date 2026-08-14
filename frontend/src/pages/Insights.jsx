import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, BarChart, Bar,
  ResponsiveContainer, Tooltip, CartesianGrid
} from 'recharts';
import {
  Sparkles, BookOpen, Flower2, Brain,
  TrendingUp, CalendarDays, Heart, Leaf
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
          api.get('/mindfulness/stats')
        ]);

        setAnalytics(a.data.data);
        setJournalCount(j.data.data?.length || 0);
        setGratitudeCount(g.data.count || 0);
        setMindful(m.data.data || { totalMinutes: 0 });
      } catch (err) {
        console.error('Analytics error:', err);
      }
    };

    const weekly = async () => {
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
    weekly();
  }, []);

  const positivePct = analytics?.recent?.length
    ? Math.round(
        (analytics.recent.filter(x => x.score >= 6).length /
          analytics.recent.length) * 100
      )
    : 0;

  const moodData = analytics?.recent?.map(x => ({
    date: new Date(x.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    }),
    score: x.score
  })) || [];

  const weekdayData =
    analytics?.weekdayAverages?.filter(x => x.average !== null) || [];

  const stats = [
    ['Journal Entries', journalCount, BookOpen, '📖', 'bg-blue-100 text-blue-500'],
    ['Gratitude Entries', gratitudeCount, Flower2, '🌻', 'bg-pink-100 text-pink-500'],
    ['Mindful Minutes', mindful.totalMinutes || 0, Brain, '🪷', 'bg-violet-100 text-violet-500']
  ];

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">

        {/* HEADER */}
        <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-pink-100 to-violet-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
              🪷
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
                Understanding your journey
              </p>
              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Your Patterns
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                A gentle look at your moods, gratitude and mindful moments.
              </p>
            </div>
          </div>
        </section>


        {/* AI REFLECTION */}
        <section className="rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF8FC] via-[#F7DDEA] to-[#EEF1FF] p-4 shadow-sm sm:p-6">

          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
              <Sparkles size={18} className="text-pink-500" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
                A reflection for you
              </p>
              <h2 className="text-lg font-semibold text-[#36566A] sm:text-xl">
                AI Weekly Reflection
              </h2>
            </div>
          </div>

          <div className="mb-4 h-px bg-gradient-to-r from-pink-300 via-violet-200 to-transparent" />

          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {loading ? '✨ Reflecting on your week...' : insight}
          </p>

          <div className="mt-4 flex items-center gap-2 border-t border-pink-100 pt-3 text-[11px] text-slate-400 sm:text-xs">
            <Leaf size={13} className="text-emerald-500" />
            Notice the patterns without judging them.
          </div>
        </section>


        {/* STATS */}
        <div className="grid gap-3 min-[430px]:grid-cols-2 sm:grid-cols-3">
          {stats.map(([label, value, Icon, emoji, color]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 shadow-sm sm:p-5"
            >
              <div>
                <p className="text-[10px] text-slate-400 sm:text-xs">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-[#36566A] sm:text-3xl">
                  {value}
                </p>
                <p className="mt-2 text-lg">{emoji}</p>
              </div>

              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${color}`}>
                <Icon size={18} />
              </div>
            </div>
          ))}
        </div>


        {analytics && (
          <>
            {/* CHARTS */}
            <div className="grid gap-4 xl:grid-cols-2">

              <ChartCard
                title="Mood Trend"
                subtitle="Emotional rhythm"
                icon={<TrendingUp size={18} className="text-blue-500" />}
              >
                {moodData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData} margin={{ left: -25 }}>
                      <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1DDE7" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 10]} hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#5B8BD0" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty emoji="🌱" text="Your mood trend will appear here." />
                )}
              </ChartCard>


              <ChartCard
                title="Mood by Weekday"
                subtitle="Across your week"
                icon={<CalendarDays size={18} className="text-pink-500" />}
              >
                {weekdayData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekdayData} margin={{ left: -20 }}>
                      <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1DDE7" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#4E9C91" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty emoji="🪷" text="Continue logging moods to see this pattern." />
                )}
              </ChartCard>

            </div>


            {/* BOTTOM STATS */}
            <div className="grid gap-3 sm:grid-cols-3">
              <SmallCard
                icon={Heart}
                title="Positive-Day %"
                value={`${positivePct}%`}
                color="bg-pink-100 text-pink-500"
              />

              <SmallCard
                icon={Sparkles}
                title="Main Triggers"
                value={analytics.topFactors?.join(', ') || '—'}
                color="bg-violet-100 text-violet-500"
              />

              <SmallCard
                icon={CalendarDays}
                title="Best Day"
                value={analytics.bestDayOfWeek || '—'}
                color="bg-emerald-100 text-emerald-500"
              />
            </div>
          </>
        )}


        <p className="py-3 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 Growth is easier to notice when you look back gently. 🪷
        </p>

      </div>
    </div>
  );
};


const ChartCard = ({ title, subtitle, icon, children }) => (
  <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/80 p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
          {subtitle}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
          {title}
        </h2>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
        {icon}
      </div>
    </div>

    <div className="h-[230px] sm:h-[270px] lg:h-[300px]">
      {children}
    </div>
  </section>
);


const SmallCard = ({ icon: Icon, title, value, color }) => (
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


const Empty = ({ emoji, text }) => (
  <div className="flex h-full flex-col items-center justify-center text-center">
    <span className="mb-2 text-4xl">{emoji}</span>
    <p className="text-xs text-slate-400 sm:text-sm">{text}</p>
  </div>
);

export default Insights;