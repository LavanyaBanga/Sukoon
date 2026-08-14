import React, { useState } from 'react';
import { Sparkles, Brain, ListChecks, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CATEGORIES = [
  ['canControl', 'Things I can control', '🌱', 'border-emerald-100 bg-emerald-50/60'],
  ['cannotControl', 'Things I cannot control', '🌊', 'border-blue-100 bg-blue-50/60'],
  ['needsAction', 'Things that need action', '⚡', 'border-amber-100 bg-amber-50/60'],
  ['canWait', 'Things that can wait', '⏳', 'border-pink-100 bg-pink-50/60'],
  ['assumptions', 'Things I may be assuming', '🌫️', 'border-violet-100 bg-violet-50/60'],
];

const UnloadMind = () => {
  const [thoughts, setThoughts] = useState('');
  const [loading, setLoading] = useState(false);
  const [sorted, setSorted] = useState(null);

  const sort = async () => {
    if (!thoughts.trim())
      return toast.error('Write down what is on your mind first');

    setLoading(true);
    setSorted(null);

    try {
      const { data } = await api.post('/ai/sort-thoughts', {
        thoughts: thoughts.trim(),
      });
      setSorted(data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Could not sort your thoughts right now'
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setThoughts('');
    setSorted(null);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <Card>
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-pink-100 to-violet-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
              ☁️
            </div>

            <div>
              <Label>Make a little space</Label>
              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Unload Your Mind
              </h1>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Put everything running through your mind here and let Sukoon help you sort it gently.
              </p>
            </div>
          </div>
        </Card>

        {/* INPUT */}
        <Card>
          <div className="mb-3 flex items-start justify-between gap-3 sm:items-center">

            <div>
              <Label>Brain dump</Label>
              <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                What's taking up space in your mind?
              </h2>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
              <Brain size={18} className="text-blue-500" />
            </div>
          </div>

          <p className="mb-3 text-[11px] text-slate-400 sm:text-xs">
            Don't organize it. Just write everything as it comes.
          </p>

          <textarea
            rows={6}
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="I have a deadline tomorrow... I'm worried about..."
            className="w-full resize-none rounded-2xl border border-pink-200 bg-white/80 p-3 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 sm:p-4 sm:leading-7"
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[10px] text-slate-400 sm:text-xs">
              <Sparkles size={12} className="text-pink-400" />
              It does not need to be neat or logical.
            </p>

            <button
              onClick={sort}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Sorting...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Help Me Sort This
                </>
              )}
            </button>
          </div>
        </Card>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[140px] flex-col items-center justify-center rounded-3xl border border-pink-200 bg-[#FFF7FB]/70 text-center shadow-sm">
            <span className="mb-2 text-3xl">☁️ 🪷 ✨</span>
            <p className="text-sm font-medium text-slate-600">
              Making some space...
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Sukoon is gently sorting what you shared.
            </p>
          </div>
        )}

        {/* RESULTS */}
        {sorted && !loading && (
          <div className="space-y-4">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Label>A clearer view</Label>
                <h2 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-2xl">
                  Let's separate what's here
                </h2>
              </div>

              <button
                onClick={reset}
                className="flex items-center gap-2 self-start text-xs text-slate-400 hover:text-pink-500"
              >
                <RefreshCw size={13} />
                Start again
              </button>
            </div>

            {/* CATEGORIES */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {CATEGORIES.map(([key, label, emoji, style]) => {
                const items = sorted[key] || [];

                return (
                  <section
                    key={key}
                    className={`rounded-3xl border p-4 shadow-sm sm:p-5 ${style}`}
                  >
                    <div className="mb-3 flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-xl">
                        {emoji}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-700">
                          {label}
                        </h3>
                        <p className="text-[10px] text-slate-400 sm:text-xs">
                          {items.length} {items.length === 1 ? 'thought' : 'thoughts'}
                        </p>
                      </div>
                    </div>

                    {items.length ? (
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 rounded-2xl bg-white/70 px-3 py-2.5 text-xs leading-5 text-slate-600 sm:px-4 sm:py-3 sm:text-sm"
                          >
                            <span className="text-pink-400">•</span>
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-4 text-center text-xs text-slate-400">
                        Nothing here
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* NEXT STEPS */}
            <section className="rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF7FB] via-[#F7DDEA] to-[#EEF1FF] p-4 shadow-sm sm:p-5">

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
                  <ListChecks size={18} className="text-pink-500" />
                </div>

                <div>
                  <Label>Just for now</Label>
                  <h2 className="text-lg font-semibold text-[#36566A] sm:text-xl">
                    My next 3 small steps
                  </h2>
                </div>
              </div>

              {(sorted.nextSteps || []).length ? (
                <ol className="space-y-2">
                  {sorted.nextSteps.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-2xl border border-pink-100 bg-white/75 p-3 sm:p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-[10px] font-semibold text-white sm:h-8 sm:w-8 sm:text-xs">
                        {i + 1}
                      </span>

                      <p className="min-w-0 flex-1 pt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                        {item}
                      </p>

                      <ArrowRight
                        size={14}
                        className="mt-1 shrink-0 text-slate-300"
                      />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-400">
                  No next steps suggested right now.
                </p>
              )}

              <p className="mt-4 border-t border-pink-100 pt-3 text-[10px] leading-5 text-slate-400 sm:text-xs">
                🪷 You don't have to handle everything at once. One small step is enough.
              </p>

            </section>
          </div>
        )}

        <p className="px-3 py-3 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 Not every thought needs an answer today. 🪷
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

export default UnloadMind;