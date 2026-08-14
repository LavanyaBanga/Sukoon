import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sparkles, Heart, Brain, Wind, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Sleep = () => {
  const [note, setNote] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!note.trim() && !gratitude.trim())
      return toast.error('Write something you would like to leave here');

    setSaving(true);

    try {
      if (note.trim())
        await api.post('/journals', {
          content: note.trim(),
          type: 'Brain Dump',
        });

      if (gratitude.trim())
        await api.post('/gratitude', {
          text: gratitude.trim(),
        });

      toast.success('Left here safely. Sleep well 🌙');
      setNote('');
      setGratitude('');
    } catch {
      toast.error('Could not save right now');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <Card>
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-pink-100 to-violet-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
              🌙
            </div>

            <div>
              <Label>Your evening pause</Label>

              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Slow Down
              </h1>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                You have carried enough for today. Leave a few thoughts here before you rest.
              </p>
            </div>
          </div>
        </Card>

        <p className="flex items-center justify-center gap-2 px-2 text-center text-[10px] text-slate-400 sm:text-xs">
          <Sparkles size={12} className="shrink-0 text-pink-400" />
          What do you want to leave here before sleeping?
          <Sparkles size={12} className="shrink-0 text-pink-400" />
        </p>

        {/* BRAIN DUMP */}
        <Card>
          <TitleBox
            icon={Brain}
            label="Empty your mind"
            title="Brain Dump"
            color="bg-blue-100 text-blue-500"
          />

          <p className="mb-3 text-[11px] leading-5 text-slate-400 sm:text-xs">
            Write anything still circling in your mind. It does not need to make sense.
          </p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            placeholder="Let it all out before you rest..."
            className="w-full resize-none rounded-2xl border border-blue-100 bg-white/80 p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 sm:p-4"
          />

          <p className="mt-2 text-[10px] text-slate-400 sm:text-xs">
            ☁️ You do not have to solve these thoughts tonight.
          </p>
        </Card>

        {/* GRATITUDE */}
        <Card>
          <TitleBox
            icon={Heart}
            label="One gentle thought"
            title="Gratitude Before Sleep"
            color="bg-pink-100 text-pink-500"
          />

          <p className="mb-3 text-[11px] leading-5 text-slate-400 sm:text-xs">
            Think of one small thing that felt warm or meaningful today.
          </p>

          <div className="relative">
            <Heart
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400"
            />

            <input
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Today I'm grateful for..."
              className="w-full rounded-full border border-pink-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />
          </div>
        </Card>

        {/* BREATHE */}
        <Link
          to="/breathe"
          className="group flex items-center gap-3 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-blue-50 to-pink-100/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:gap-4 sm:p-5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white sm:h-12 sm:w-12">
            <Wind size={19} className="text-teal-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-[.15em] text-teal-600/70 sm:text-xs">
              Before closing your eyes
            </p>

            <h3 className="mt-1 text-xs font-semibold text-[#36566A] sm:text-sm">
              Try a 2-minute wind-down breath
            </h3>

            <p className="mt-1 text-[10px] leading-4 text-slate-400 sm:text-xs">
              Calm Breathing can help you settle into a gentle bedtime rhythm.
            </p>
          </div>

          <ArrowRight
            size={18}
            className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-500"
          />
        </Link>

        {/* SAVE */}
        <button
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
        >
          <Moon size={17} />
          {saving ? 'Leaving it here...' : 'Leave It Here'}
        </button>

        <p className="px-3 py-3 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 The day is complete. You are allowed to rest. 🌙
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

const TitleBox = ({ icon: Icon, label, title, color }) => (
  <div className="mb-3 flex items-center gap-3">
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color}`}>
      <Icon size={18} />
    </div>

    <div>
      <Label>{label}</Label>
      <h2 className="text-base font-semibold text-[#36566A] sm:text-lg">
        {title}
      </h2>
    </div>
  </div>
);

export default Sleep;