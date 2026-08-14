import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';

const focus = {
  Stress: '🌿', Overthinking: '☁️', 'Self confidence': '🌻',
  Studies: '📚', 'Career anxiety': '✨', Relationships: '💗',
  Sleep: '🌙', 'Building better habits': '🌱', Mindfulness: '🪷',
};

const times = {
  Morning: '🌅', Afternoon: '☀️', Evening: '🌤️', 'Late night': '🌙',
};

const coping = {
  Music: '🎵', Talking: '💬', Writing: '📖', Meditation: '🧘',
  Walking: '🌿', 'Being alone': '🌙', 'Spiritual reflection': '🦚',
};

const Onboarding = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [focusAreas, setFocusAreas] = useState([]);
  const [strugglesMostAt, setStrugglesMostAt] = useState('');
  const [copingStyles, setCopingStyles] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggle = (value, list, setter) =>
    setter(list.includes(value) ? list.filter(x => x !== value) : [...list, value]);

  const steps = [
    {
      label: 'Your peaceful space',
      title: 'What would you like Sukoon to help you with?',
      text: 'Choose the areas where you would like more calm and clarity.',
      options: focus,
      selected: focusAreas,
      select: x => toggle(x, focusAreas, setFocusAreas),
      valid: focusAreas.length > 0,
      icon: '🪷',
      multiple: true,
    },
    {
      label: 'Know your rhythm',
      title: 'When do you struggle the most?',
      text: 'Understanding difficult moments helps Sukoon support you better.',
      options: times,
      selected: strugglesMostAt,
      select: setStrugglesMostAt,
      valid: !!strugglesMostAt,
      icon: '🌙',
    },
    {
      label: 'Your comfort rituals',
      title: 'What usually helps you feel better?',
      text: 'Choose the little things that bring you back to yourself.',
      options: coping,
      selected: copingStyles,
      select: x => toggle(x, copingStyles, setCopingStyles),
      valid: copingStyles.length > 0,
      icon: '🦚',
      multiple: true,
    },
  ];

  const current = steps[step];

  const finish = async () => {
    setSaving(true);

    try {
      const { data } = await api.put('/auth/onboarding', {
        focusAreas,
        strugglesMostAt,
        copingStyles,
      });

      setUser(data.data);
      toast.success('All set. Welcome to Sukoon 🪷');
      navigate('/dashboard');
    } catch {
      toast.error('Could not save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] px-3 py-6 sm:px-5 sm:py-8 lg:py-10">

      {/* BACKGROUND */}
      <div className="absolute -left-32 -top-28 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl sm:h-96 sm:w-96" />

      <span className="absolute left-[6%] top-[10%] hidden text-5xl opacity-40 md:block">🦚</span>
      <span className="absolute bottom-[10%] right-[7%] hidden text-4xl opacity-40 md:block">🪷</span>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-pink-200 bg-[#FFF8FC]/85 p-4 text-center shadow-xl backdrop-blur-xl sm:p-7 lg:p-9">

        <span className="text-3xl sm:text-4xl">{current.icon}</span>

        {/* PROGRESS */}
        <div className="my-4 flex justify-center gap-2 sm:my-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-10 sm:w-12' : 'w-6 sm:w-8'
              } ${
                i <= step
                  ? 'bg-gradient-to-r from-blue-500 via-pink-500 to-violet-500'
                  : 'bg-pink-100'
              }`}
            />
          ))}
        </div>

        <p className="text-[10px] uppercase tracking-[.18em] text-pink-700/70 sm:text-xs">
          {current.label}
        </p>

        <h1 className="mx-auto mt-2 max-w-xl text-xl font-semibold leading-snug text-[#35566A] sm:mt-3 sm:text-2xl lg:text-3xl">
          {current.title}
        </h1>

        <p className="mx-auto mb-5 mt-2 max-w-lg text-xs leading-5 text-slate-500 sm:mb-7 sm:mt-3 sm:text-sm">
          {current.text}
        </p>


        {/* OPTIONS */}
        <div
          className={
            step === 1
              ? 'mx-auto grid max-w-md grid-cols-2 gap-2 sm:gap-3'
              : 'grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'
          }
        >
          {Object.entries(current.options).map(([name, emoji]) => {
            const selected = current.multiple
              ? current.selected.includes(name)
              : current.selected === name;

            return (
              <button
                key={name}
                onClick={() => current.select(name)}
                className={`flex min-w-0 items-center justify-center border transition hover:-translate-y-0.5 ${
                  step === 1
                    ? 'min-h-[85px] flex-col gap-1.5 rounded-2xl px-2 sm:min-h-[100px]'
                    : 'min-h-[58px] gap-2 rounded-2xl px-2 py-2.5 sm:min-h-[64px] sm:px-3'
                } ${
                  selected
                    ? 'border-transparent bg-gradient-to-r from-blue-500 via-sky-500 to-teal-500 text-white shadow-md'
                    : 'border-pink-200 bg-white/80 text-slate-500 hover:bg-pink-50'
                }`}
              >
                <span className={step === 1 ? 'text-2xl sm:text-3xl' : 'shrink-0 text-lg'}>
                  {emoji}
                </span>

                <span className="break-words text-center text-[11px] leading-4 sm:text-sm">
                  {name}
                </span>
              </button>
            );
          })}
        </div>


        <div className="my-5 h-px bg-pink-100 sm:my-7" />


        {/* BUTTONS */}
        <div className="flex flex-col-reverse gap-2 min-[430px]:flex-row min-[430px]:justify-center sm:gap-3">

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full rounded-full border border-pink-200 bg-white/80 px-6 py-3 text-sm text-slate-500 transition hover:bg-pink-50 min-[430px]:w-auto"
            >
              ← Back
            </button>
          )}

          {step < steps.length - 1 ? (
            <button
              disabled={!current.valid}
              onClick={() => setStep(step + 1)}
              className="w-full rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40 min-[430px]:w-auto"
            >
              Continue →
            </button>
          ) : (
            <button
              disabled={!current.valid || saving}
              onClick={finish}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 via-blue-500 to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40 min-[430px]:w-auto"
            >
              {saving ? 'Saving...' : 'Enter Sukoon 🪷'}
            </button>
          )}

        </div>

        <p className="mt-5 text-[10px] leading-5 text-slate-400 sm:mt-7 sm:text-xs">
          🦚 Your answers simply help Sukoon understand you better.
        </p>

      </div>
    </div>
  );
};

export default Onboarding;