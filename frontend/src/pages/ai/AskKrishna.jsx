import React, { useEffect, useRef, useState } from 'react';
import {
  Play, Pause, Volume2, VolumeX,
  Sparkles, Feather
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const LOADING_MESSAGES = [
  'Finding a thought for you...',
  'Reflecting on timeless wisdom...',
  'A little stillness...',
  'Turning inward...',
];

const MusicPrompt = ({ onChoice }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF1F8]/90 p-3 backdrop-blur-xl sm:p-4">
    <span className="absolute left-[10%] top-[12%] hidden text-5xl opacity-30 md:block">🦚</span>
    <span className="absolute bottom-[12%] right-[10%] hidden text-4xl opacity-30 md:block">🪷</span>

    <div className="w-full max-w-sm rounded-3xl border border-pink-200 bg-[#FFF8FC]/95 p-5 text-center shadow-xl sm:p-7">
      <div className="mb-3 text-4xl sm:text-5xl">🪈</div>

      <Label>Before you begin</Label>

      <h2 className="mt-2 text-xl font-semibold text-[#36566A] sm:text-2xl">
        Enter with Krishna flute?
      </h2>

      <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-sm">
        Let a soft flute melody create a peaceful space while you reflect.
      </p>

      <div className="mt-5 space-y-2.5">
        <button
          onClick={() => onChoice(true)}
          className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 py-3 text-sm font-semibold text-white shadow-md"
        >
          ♫ Play Krishna Flute
        </button>

        <button
          onClick={() => onChoice(false)}
          className="w-full rounded-full border border-pink-200 bg-white/80 py-3 text-sm text-slate-500 hover:bg-pink-50"
        >
          Continue Quietly
        </button>
      </div>
    </div>
  </div>
);

const MusicController = ({
  playing, toggleMusic, volume,
  setVolume, muted, setMuted
}) => (
  <div className="fixed bottom-20 left-3 z-40 flex items-center gap-2 rounded-full border border-pink-200 bg-[#FFF8FC]/95 px-3 py-2 shadow-lg backdrop-blur-xl sm:gap-3 sm:px-4 md:bottom-5 md:left-[260px]">

    <span className="hidden sm:block">🪈</span>

    <button
      onClick={toggleMusic}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-500"
    >
      {playing ? <Pause size={15} /> : <Play size={15} />}
    </button>

    <button
      onClick={() => setMuted(!muted)}
      className="text-slate-400 hover:text-pink-500"
    >
      {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
    </button>

    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={volume}
      onChange={e => setVolume(Number(e.target.value))}
      className="w-14 accent-pink-500 sm:w-20"
    />
  </div>
);

const AskKrishna = () => {
  const audioRef = useRef(null);

  const [showPrompt, setShowPrompt] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(false);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [crisis, setCrisis] = useState(false);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setLoadingIndex(i => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  const handleMusicChoice = async wantsMusic => {
    const audio = audioRef.current;

    if (!wantsMusic) {
      audio?.pause();
      setPlaying(false);
      setShowPrompt(false);
      return;
    }

    try {
      if (!audio) throw new Error('Audio not found');

      audio.volume = volume;
      audio.muted = false;

      await audio.play();

      setPlaying(true);
      setMuted(false);
      setShowPrompt(false);
      toast.success('Krishna flute is playing 🪈');
    } catch (err) {
      console.error('Flute error:', err);
      setPlaying(false);
      setShowPrompt(false);
      toast.error('Could not play Krishna flute');
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return toast.error('Audio could not be found');

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.volume = volume;
        audio.muted = muted;
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
      toast.error('Could not play Krishna flute');
    }
  };

  const handleSubmit = async () => {
    if (!message.trim())
      return toast.error('Write a little about what is on your mind first');

    setLoading(true);
    setResponse('');
    setCrisis(false);
    setLoadingIndex(0);

    try {
      const { data } = await api.post('/ai/gita', {
        message: message.trim(),
      });

      setResponse(data?.data?.reply || '');
      setCrisis(Boolean(data?.data?.crisis));
    } catch (err) {
      console.error('ASK KRISHNA ERROR:', err.response?.data || err.message);

      toast.error(
        err.response?.data?.message ||
        'Sukoon could not reach the wisdom source. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">

      <audio
        ref={audioRef}
        src="/audio/krishna-flute.mp3"
        loop
        preload="auto"
        playsInline
      />

      {showPrompt && <MusicPrompt onChoice={handleMusicChoice} />}

      {!showPrompt && (
        <MusicController
          playing={playing}
          toggleMusic={toggleMusic}
          volume={volume}
          setVolume={setVolume}
          muted={muted}
          setMuted={setMuted}
        />
      )}

      <span className="absolute left-[5%] top-[8%] hidden text-5xl opacity-15 xl:block">
        🦚
      </span>

      <span className="absolute right-[6%] top-[12%] hidden text-3xl opacity-20 lg:block">
        ✨
      </span>

      <div className="relative z-10 mx-auto w-full max-w-3xl space-y-4 sm:space-y-5">

        {/* HERO */}
        <section className="px-1 py-2 text-center">
          <div className="mb-2 text-4xl sm:text-5xl">🦚</div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-[#FFF8FC]/80 px-3 py-2 sm:px-4">
            <Feather size={13} className="text-pink-500" />
            <Label>Ask Krishna</Label>
          </div>

          <h1 className="text-2xl font-semibold leading-tight text-[#36566A] sm:text-3xl lg:text-4xl">
            What is weighing on your{' '}
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
              heart today?
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-slate-500 sm:text-sm">
            Share what is on your mind. Sukoon will offer a gentle perspective
            inspired by Bhagavad Gita wisdom.
          </p>
        </section>

        {/* INPUT */}
        <Card>
          <p className="mb-3 text-[10px] text-slate-400 sm:text-xs">
            🪷 Your quiet space
          </p>

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            placeholder="Write freely. Tell Krishna what has been on your mind..."
            className="w-full resize-none rounded-2xl border border-pink-200 bg-white/80 p-3 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 sm:p-4 sm:leading-7"
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[10px] text-slate-400 sm:text-xs">
              Take your time. There is no perfect way to say it.
            </p>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 sm:w-auto"
            >
              {loading ? 'Reflecting...' : 'Seek Gita Wisdom 🪷'}
            </button>

          </div>
        </Card>

        {/* LOADING */}
        {loading && (
          <div className="py-4 text-center">
            <p className="mb-2 text-xl sm:text-2xl">🪷 🦚 ✨</p>
            <p className="text-xs text-pink-600/70 sm:text-sm">
              {LOADING_MESSAGES[loadingIndex]}
            </p>
          </div>
        )}

        {/* RESPONSE */}
        {response && !loading && (
          <section
            className={`relative rounded-3xl border p-4 shadow-sm sm:p-6 ${
              crisis
                ? 'border-red-200 bg-red-50/80'
                : 'border-pink-200 bg-gradient-to-br from-[#FFF8FC] via-[#F8DFEC] to-[#EEE9FF]'
            }`}
          >
            <span className="absolute right-5 top-5 hidden text-3xl opacity-15 sm:block">
              🦚
            </span>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80">
                🪶
              </div>

              <div>
                <Label>A reflection for you</Label>
                <h2 className="text-lg font-semibold text-[#36566A] sm:text-xl">
                  Krishna's Perspective
                </h2>
              </div>
            </div>

            <div className="mb-4 h-px bg-gradient-to-r from-pink-300 via-fuchsia-200 to-transparent" />

            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 sm:text-[15px]">
              {response}
            </p>

            {!crisis && (
              <p className="mt-4 border-t border-pink-200 pt-3 text-[10px] leading-5 text-slate-400 sm:text-xs">
                🪷 Take what resonates, and leave yourself space to reflect.
              </p>
            )}
          </section>
        )}

        {/* DISCLAIMER */}
        <div className="mx-auto flex max-w-xl items-start justify-center gap-2 px-2 pb-3 text-center text-[9px] leading-5 text-slate-400 sm:text-xs">
          <Sparkles
            size={12}
            className="mt-1 shrink-0 text-pink-400"
          />

          <p>
            Reflections are inspired by Bhagavad Gita philosophy and are offered
            as perspective, not as a substitute for professional mental healthcare.
          </p>
        </div>

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
  <span className="text-[9px] uppercase tracking-[.16em] text-pink-700/70 sm:text-xs">
    {children}
  </span>
);

export default AskKrishna;