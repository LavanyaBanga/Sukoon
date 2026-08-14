import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PLANTS = ['🌱', '🌿', '🌷', '🌻'];
const plantFor = index => PLANTS[index % PLANTS.length];

const GratitudeGarden = () => {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/gratitude');
      setEntries(data.data || []);
    } catch (err) {
      console.error('Could not load gratitude entries', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!text.trim())
      return toast.error('Write something you are grateful for');

    setSaving(true);

    try {
      const { data } = await api.post('/gratitude', {
        text: text.trim(),
      });

      setText('');
      load();

      data.milestone
        ? toast.success(`${data.milestone.emoji} ${data.milestone.label}!`)
        : toast.success('Added to your garden 🌿');
    } catch {
      toast.error('Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <Card>
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
              🌻
            </div>

            <div>
              <Label>A little garden of joy</Label>

              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Gratitude Garden
              </h1>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Every grateful thought plants something beautiful here.
              </p>
            </div>
          </div>
        </Card>

        {/* ADD GRATITUDE */}
        <Card>
          <div className="mb-3 flex items-start justify-between gap-3 sm:items-center">
            <div>
              <Label>Plant a thought</Label>

              <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                Today I'm grateful for...
              </h2>
            </div>

            <span className="text-2xl sm:text-3xl">🌱</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Heart
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400"
              />

              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="A warm cup of chai, a kind message..."
                className="w-full rounded-full border border-pink-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <button
              onClick={submit}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 sm:w-auto"
            >
              <Sprout size={17} />
              {saving ? 'Planting...' : 'Plant'}
            </button>
          </div>

          <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-slate-400 sm:items-center sm:text-xs">
            <Sparkles
              size={12}
              className="mt-1 shrink-0 text-pink-500 sm:mt-0"
            />
            Even the smallest good thing is worth remembering.
          </p>
        </Card>

        {/* GARDEN HEADING */}
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <Label>Your growing garden</Label>

            <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
              {entries.length}{' '}
              {entries.length === 1
                ? 'grateful thought'
                : 'grateful thoughts'}
            </h2>
          </div>

          <p className="hidden text-xs text-slate-400 md:block">
            🌿 Keep nurturing the little things.
          </p>
        </div>

        {/* GARDEN */}
        <section className="rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF7FB] via-[#F9E5F0] to-[#EEF1FF] p-3 shadow-sm sm:p-5">

          {entries.length ? (
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {entries.map((entry, index) => (
                <div
                  key={entry._id}
                  title={entry.text}
                  className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-pink-200 bg-white/75 p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-md sm:min-h-[140px] sm:p-4"
                >
                  <span className="mb-2 text-3xl sm:text-4xl">
                    {plantFor(entries.length - 1 - index)}
                  </span>

                  <p className="line-clamp-3 break-words text-xs leading-5 text-slate-500 sm:leading-6">
                    {entry.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-4 text-center sm:min-h-[320px]">
              <span className="mb-3 text-5xl sm:text-6xl">🌱</span>

              <h3 className="text-lg font-semibold text-[#36566A] sm:text-xl">
                Your garden is waiting
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
                Plant your first grateful thought above and watch your garden slowly bloom.
              </p>
            </div>
          )}

        </section>

        {/* GROWTH PATH */}
        {entries.length > 0 && (
          <Card>
            <p className="mb-4 text-center text-[10px] uppercase tracking-[.15em] text-pink-700/60 sm:text-xs">
              Every thought helps your garden bloom
            </p>

            <div className="flex items-center justify-center">
              {PLANTS.map((plant, index) => (
                <React.Fragment key={plant}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-white/80 text-lg shadow-sm sm:h-12 sm:w-12 sm:text-2xl">
                    {plant}
                  </div>

                  {index < PLANTS.length - 1 && (
                    <div className="h-px w-3 bg-gradient-to-r from-pink-300 to-violet-300 min-[400px]:w-6 sm:w-10 md:w-16" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </Card>
        )}

        <p className="px-3 py-3 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 Gratitude turns little moments into something worth keeping. 🪷
        </p>

      </div>
    </div>
  );
};

const Card = ({ children }) => (
  <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/85 p-4 shadow-sm sm:p-5">
    {children}
  </section>
);

const Label = ({ children }) => (
  <p className="text-[9px] uppercase tracking-[.16em] text-pink-700/70 sm:text-xs">
    {children}
  </p>
);

export default GratitudeGarden;