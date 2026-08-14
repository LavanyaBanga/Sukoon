import React, { useState } from 'react';
import {
  Moon, Music2, Sparkles, Bell, ShieldCheck,
  Trash2, Settings2, Palette, Heart, X, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onChange}
    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
      checked ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-slate-200'
    } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
  >
    <span className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-all ${
      checked ? 'left-[25px]' : 'left-[3px]'
    }`} />
  </button>
);

const SettingRow = ({ icon: Icon, title, text, color, children, disabled }) => (
  <div className={`flex items-center justify-between gap-3 rounded-2xl border p-3 sm:p-4 ${
    disabled
      ? 'border-slate-100 bg-white/50 opacity-60'
      : 'border-pink-100 bg-white/70 hover:border-pink-200'
  }`}>
    <div className="flex min-w-0 items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${color}`}>
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-700 sm:text-sm">{title}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-400 sm:text-xs sm:leading-5">
          {text}
        </p>
      </div>
    </div>

    {children}
  </div>
);

const Settings = () => {
  const { logout } = useAuth();
  const {
    theme, toggleTheme,
    reduceAnimations, setReduceAnimations,
    musicOn, setMusicOn,
  } = useSettings();

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);

    try {
      await api.delete('/auth/account');
      toast.success('Account deleted');
      logout();
      window.location.href = '/';
    } catch {
      toast.error('Could not delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <Card>
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-pink-100 to-violet-100 sm:h-14 sm:w-14">
              <Settings2 size={24} className="text-blue-500" />
            </div>

            <div>
              <Label>Make Sukoon yours</Label>

              <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                Settings
              </h1>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Adjust your space to make it peaceful and personal.
              </p>
            </div>
          </div>
        </Card>


        {/* EXPERIENCE */}
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100">
              <Palette size={18} className="text-pink-500" />
            </div>

            <div>
              <Label>Your experience</Label>
              <h2 className="text-base font-semibold text-[#36566A] sm:text-lg">
                Appearance & Comfort
              </h2>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            <SettingRow
              icon={Moon}
              title="Dark mode"
              text="Switch between light and dark appearance."
              color="bg-indigo-100 text-indigo-500"
            >
              <Toggle
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            </SettingRow>

            <SettingRow
              icon={Music2}
              title="Background music"
              text="Allow calming music where available."
              color="bg-blue-100 text-blue-500"
            >
              <Toggle
                checked={musicOn}
                onChange={() => setMusicOn(!musicOn)}
              />
            </SettingRow>

            <SettingRow
              icon={Sparkles}
              title="Reduce animations"
              text="Use fewer moving elements across Sukoon."
              color="bg-violet-100 text-violet-500"
            >
              <Toggle
                checked={reduceAnimations}
                onChange={() => setReduceAnimations(!reduceAnimations)}
              />
            </SettingRow>

            <SettingRow
              icon={Bell}
              title="Notifications"
              text="Gentle reminders and wellbeing check-ins."
              color="bg-emerald-100 text-emerald-500"
              disabled
            >
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[8px] text-slate-400 sm:px-3 sm:text-[10px]">
                Coming soon
              </span>
            </SettingRow>
          </div>
        </Card>


        {/* PRIVACY */}
        <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-[#FFF7FB] via-emerald-50 to-blue-50 p-4 shadow-sm sm:p-5">

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/80 sm:h-12 sm:w-12">
              <ShieldCheck size={20} className="text-emerald-500" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[.16em] text-emerald-600/70 sm:text-xs">
                Your personal space
              </p>

              <h2 className="mt-1 text-base font-semibold text-[#36566A] sm:text-lg">
                Privacy
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7">
                Your reflections, moods, gratitude entries and conversations
                stay inside your private Sukoon space.
              </p>

              <p className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 sm:text-xs">
                <Heart size={12} className="text-pink-500" />
                Your quiet corner remains yours.
              </p>
            </div>
          </div>

        </section>


        {/* DANGER ZONE */}
        <section className="rounded-3xl border border-red-100 bg-gradient-to-br from-white/80 via-red-50 to-pink-50 p-4 shadow-sm sm:p-5">

          <div className="flex items-start gap-3 sm:gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 sm:h-12 sm:w-12">
              <Trash2 size={19} className="text-red-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-[.16em] text-red-400 sm:text-xs">
                Danger zone
              </p>

              <h2 className="mt-1 text-base font-semibold text-[#36566A] sm:text-lg">
                Delete Account
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-sm">
                Permanently delete your account and saved wellbeing data.
              </p>

              {!confirming && (
                <button
                  onClick={() => setConfirming(true)}
                  className="mt-4 flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-500 transition hover:bg-red-100 sm:px-5 sm:text-sm"
                >
                  <Trash2 size={14} />
                  Delete my account
                </button>
              )}
            </div>

          </div>


          {/* CONFIRM */}
          {confirming && (
            <div className="mt-4 rounded-2xl border border-red-100 bg-white/80 p-4 sm:p-5">

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle size={17} className="text-red-500" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Are you absolutely sure?
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">

                <button
                  onClick={deleteAccount}
                  disabled={deleting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto sm:text-sm"
                >
                  <Trash2 size={14} />
                  {deleting ? 'Deleting...' : 'Yes, delete everything'}
                </button>

                <button
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs text-slate-500 hover:bg-slate-50 sm:w-auto sm:text-sm"
                >
                  <X size={14} />
                  Cancel
                </button>

              </div>
            </div>
          )}

        </section>


        <div className="px-3 py-3 text-center">
          <p className="mb-2">🦚 🪷 ✨</p>

          <p className="mx-auto max-w-xl text-[10px] leading-5 text-slate-400 sm:text-xs sm:leading-6">
            Sukoon supports reflection and emotional wellbeing,
            but does not replace professional mental healthcare.
          </p>
        </div>

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

export default Settings;