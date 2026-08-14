import React, { useEffect, useRef, useState } from 'react';
import { Wind, Play, Square, Clock3, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const EXERCISES = {
  'Box Breathing': [
    { label: 'Breathe In', secs: 4 },
    { label: 'Hold', secs: 4 },
    { label: 'Breathe Out', secs: 4 },
    { label: 'Hold', secs: 4 },
  ],
  '4-7-8': [
    { label: 'Breathe In', secs: 4 },
    { label: 'Hold', secs: 7 },
    { label: 'Breathe Out', secs: 8 },
  ],
  'Calm Breathing': [
    { label: 'Breathe In', secs: 5 },
    { label: 'Breathe Out', secs: 5 },
  ],
};

const INFO = {
  'Box Breathing': ['🪷', 'A balanced four-part rhythm to settle your mind.'],
  '4-7-8': ['🌙', 'Slow breathing to help your body unwind.'],
  'Calm Breathing': ['🌿', 'A gentle inhale-exhale rhythm.'],
};

const DURATIONS = [1, 3, 5, 10];

const Breathe = () => {
  const [exercise, setExercise] = useState('Box Breathing');
  const [duration, setDuration] = useState(3);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseTime, setPhaseTime] = useState(4);
  const [timeLeft, setTimeLeft] = useState(180);
  const startRef = useRef(null);

  const phases = EXERCISES[exercise];
  const currentPhase = phases[phaseIdx];

  const finish = async () => {
    setRunning(false);

    try {
      await api.post('/mindfulness', {
        exercise,
        duration: duration * 60,
        completed: true,
      });
      toast.success('Session complete 🪷');
    } catch (err) {
      console.error('Mindfulness error:', err);
    }
  };

  useEffect(() => {
    if (!running) return;

    startRef.current = Date.now();
    let index = 0;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const remaining = Math.max(duration * 60 - elapsed, 0);

      setTimeLeft(remaining);

      setPhaseTime(current => {
        if (current <= 1) {
          index = (index + 1) % phases.length;
          setPhaseIdx(index);
          return phases[index].secs;
        }
        return current - 1;
      });

      if (remaining <= 0) {
        clearInterval(interval);
        finish();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const start = () => {
    setPhaseIdx(0);
    setPhaseTime(phases[0].secs);
    setTimeLeft(duration * 60);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    toast('Session ended gently 🌿');
  };

  const formattedTime = `${Math.floor(timeLeft / 60)}:${String(
    timeLeft % 60
  ).padStart(2, '0')}`;

  const scale =
    currentPhase?.label === 'Breathe In'
      ? 'scale-125'
      : currentPhase?.label === 'Breathe Out'
      ? 'scale-90'
      : 'scale-105';

  const transitionTime = {
    4: 'duration-[4000ms]',
    5: 'duration-[5000ms]',
    7: 'duration-[7000ms]',
    8: 'duration-[8000ms]',
  }[currentPhase?.secs];

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <Card>
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
              🫁
            </div>

            <div>
              <Label>Return to your breath</Label>
              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Breathe With Me
              </h1>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Take a few quiet breaths and give your mind some space.
              </p>
            </div>
          </div>
        </Card>

        {!running ? (
          /* SETUP */
          <Card>
            <div className="mb-4 flex items-start justify-between gap-3 sm:items-center">
              <div>
                <Label>Choose your rhythm</Label>
                <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
                  Which breathing exercise feels right?
                </h2>
              </div>

              <Wind size={20} className="shrink-0 text-pink-400" />
            </div>

            {/* EXERCISES */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(EXERCISES).map(item => {
                const selected = exercise === item;

                return (
                  <button
                    key={item}
                    onClick={() => setExercise(item)}
                    className={`relative rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      selected
                        ? 'border-pink-300 bg-gradient-to-br from-pink-100 via-fuchsia-50 to-violet-100 shadow-md'
                        : 'border-pink-100 bg-white/70 hover:border-pink-200 hover:bg-pink-50'
                    }`}
                  >
                    <span className="mb-2 block text-2xl sm:text-3xl">
                      {INFO[item][0]}
                    </span>

                    <h3 className="text-sm font-semibold text-[#36566A]">
                      {item}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {INFO[item][1]}
                    </p>

                    {selected && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-xs text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="my-5 h-px bg-pink-100" />

            {/* DURATION */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Clock3 size={16} className="text-pink-500" />
                <h3 className="text-sm font-semibold text-[#36566A]">
                  How long would you like to breathe?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 min-[430px]:grid-cols-4 sm:flex sm:flex-wrap">
                {DURATIONS.map(item => (
                  <button
                    key={item}
                    onClick={() => setDuration(item)}
                    className={`rounded-full border px-4 py-2.5 text-sm transition sm:min-w-[80px] ${
                      duration === item
                        ? 'border-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-sm'
                        : 'border-pink-200 bg-white/70 text-slate-500 hover:bg-pink-50'
                    }`}
                  >
                    {item} min
                  </button>
                ))}
              </div>
            </div>

            {/* SESSION INFO */}
            <div className="my-5 flex items-center gap-3 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 via-fuchsia-50 to-violet-50 p-3 sm:p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80">
                <Leaf size={18} className="text-teal-500" />
              </div>

              <div>
                <p className="text-sm font-medium text-[#36566A]">
                  Your session
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {exercise} · {duration} minute{duration > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex sm:justify-end">
              <button
                onClick={start}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              >
                <Play size={16} fill="currentColor" />
                Begin Session
              </button>
            </div>
          </Card>
        ) : (
          /* ACTIVE SESSION */
          <section className="flex min-h-[480px] flex-col items-center justify-center rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF8FC] via-[#F9E3EF] to-[#EEE9FF] px-4 py-8 text-center shadow-sm sm:min-h-[560px] sm:p-6">

            <Label>{exercise}</Label>

            <p className="mt-2 text-[11px] text-slate-400 sm:text-xs">
              Follow the circle · breathe gently
            </p>

            {/* BREATHING CIRCLE */}
            <div className="my-8 flex h-52 w-52 items-center justify-center min-[430px]:h-60 min-[430px]:w-60 sm:my-10 sm:h-72 sm:w-72 lg:h-80 lg:w-80">
              <div
                className={`flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-pink-200 via-fuchsia-100 to-violet-200 shadow-xl transition-transform ease-in-out min-[430px]:h-36 min-[430px]:w-36 sm:h-44 sm:w-44 lg:h-48 lg:w-48 ${scale} ${transitionTime}`}
              >
                <span className="mb-1 text-2xl sm:text-3xl">
                  {currentPhase?.label === 'Breathe In'
                    ? '🪷'
                    : currentPhase?.label === 'Breathe Out'
                    ? '🌿'
                    : '✨'}
                </span>

                <p className="text-sm font-semibold text-[#36566A] sm:text-xl">
                  {currentPhase?.label}
                </p>

                <p className="mt-1 text-xl font-medium text-pink-500 sm:text-2xl">
                  {phaseTime}
                </p>
              </div>
            </div>

            {/* TIMER */}
            <p className="text-2xl font-semibold text-[#36566A] sm:text-3xl">
              {formattedTime}
            </p>

            <p className="mt-1 text-xs text-slate-400">remaining</p>

            {/* PHASE DOTS */}
            <div className="my-5 flex gap-2 sm:my-6">
              {phases.map((phase, index) => (
                <span
                  key={`${phase.label}-${index}`}
                  className={`h-2 rounded-full transition-all ${
                    phaseIdx === index
                      ? 'w-7 bg-gradient-to-r from-pink-500 to-violet-500'
                      : 'w-2 bg-pink-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={stop}
              className="flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-6 py-3 text-sm text-slate-500 transition hover:bg-pink-50"
            >
              <Square size={14} />
              End Session
            </button>

            <p className="mt-6 text-[10px] text-slate-400 sm:text-xs">
              🦚 One breath at a time. 🪷
            </p>
          </section>
        )}

      </div>
    </div>
  );
};

const Card = ({ children }) => (
  <section className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/85 p-4 shadow-sm sm:p-5 lg:p-6">
    {children}
  </section>
);

const Label = ({ children }) => (
  <p className="text-[9px] uppercase tracking-[.16em] text-pink-700/70 sm:text-xs">
    {children}
  </p>
);

export default Breathe;