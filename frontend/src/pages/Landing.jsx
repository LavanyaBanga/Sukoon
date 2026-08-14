import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  ['🦚', 'Ask Krishna', 'Bhagavad Gita wisdom for modern struggles.'],
  ['💬', 'Talk to Sukoon', 'A warm AI companion whenever you need to talk.'],
  ['🌙', 'Mood Tracking', 'Track your feelings and understand emotional patterns.'],
  ['📖', 'Your Quiet Corner', 'A private space for thoughts, gratitude and reflections.'],
  ['🌻', 'Gratitude Garden', 'Grow your garden with one grateful thought at a time.'],
  ['🫁', 'Breathe With Me', 'Guided breathing exercises to help you slow down.'],
];

const Landing = () => {
  return (
    <div className="min-h-screen scroll-smooth overflow-x-hidden bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] text-[#405568]">

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          opacity: 0;
          animation: fadeUp .8s ease forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { opacity: 1; animation: none; }
          .krishna-img { animation: none !important; }
        }
      `}</style>


      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-pink-200/70 bg-[#FFF4FA]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🪷</span>

            <span className="bg-gradient-to-r from-blue-600 via-pink-500 to-violet-500 bg-clip-text text-xl font-semibold text-transparent">
              Sukoon
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">

            <Link
              to="/login"
              className="px-3 py-2 text-xs font-medium text-slate-600 transition hover:text-pink-500 sm:text-sm"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:px-5 sm:text-sm"
            >
              <span className="hidden sm:inline">Begin Your Journey</span>
              <span className="sm:hidden">Begin</span>
            </Link>

          </div>
        </div>
      </header>


      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-2 lg:px-8">

        {/* TEXT */}
        <div className="text-center lg:text-left">

          <div className="fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-[#FFF7FC]/90 px-3 py-2 text-[10px] text-pink-700 shadow-sm sm:px-4 sm:text-sm">
            🪶
            <span>A peaceful space inspired by timeless wisdom</span>

            <Sparkles
              size={13}
              className="shrink-0 text-pink-400"
            />
          </div>


          <h1
            style={{ animationDelay: '150ms' }}
            className="fade-up text-3xl font-semibold leading-tight text-[#304E63] sm:text-5xl lg:text-6xl"
          >
            Your mind deserves a{' '}

            <span className="bg-gradient-to-r from-blue-600 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              softer place
            </span>{' '}

            to land.
          </h1>


          <p
            style={{ animationDelay: '300ms' }}
            className="fade-up mx-auto mt-5 max-w-xl text-base text-slate-600 sm:text-lg lg:mx-0"
          >
            Reflect. Breathe. Journal. Find perspective.
          </p>


          <p
            style={{ animationDelay: '450ms' }}
            className="fade-up mt-2 text-xs leading-6 text-pink-700/70 sm:text-sm"
          >
            Guided by calm, reflection and Bhagavad Gita-inspired wisdom.
          </p>


          <div
            style={{ animationDelay: '600ms' }}
            className="fade-up mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >

            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              Begin Your Journey
            </Link>

            <a
              href="#features"
              className="rounded-full border border-pink-200 bg-[#FFF8FC]/90 px-7 py-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-1 hover:bg-white"
            >
              Explore Sukoon
            </a>

          </div>
        </div>


        {/* KRISHNA */}
        <div className="relative mx-auto flex w-full max-w-[430px] items-center justify-center lg:max-w-[560px]">

          <div className="absolute h-[78%] w-[78%] animate-pulse rounded-full bg-gradient-to-br from-blue-200/70 via-pink-300/50 to-violet-200/60 blur-3xl" />

          <span className="absolute left-1 top-6 animate-pulse text-3xl opacity-50 sm:text-4xl">
            🦚
          </span>

          <span className="absolute right-4 top-10 animate-pulse text-2xl opacity-70">
            ✨
          </span>

          <span className="absolute bottom-7 left-4 text-3xl opacity-40">
            🪷
          </span>

          <img
            src="/images/krishna-flute.png"
            alt="Krishna playing flute"
            style={{
              animation: 'float 5s ease-in-out infinite',
            }}
            className="krishna-img relative z-10 w-full max-w-[310px] object-contain drop-shadow-2xl transition duration-500 hover:scale-105 sm:max-w-[400px] lg:max-w-[500px]"
          />

        </div>

      </section>


      {/* DIVIDER */}
      <div className="flex items-center justify-center gap-3">

        <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-300 sm:w-24" />

        <span className="text-xl">🪷</span>

        <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-300 sm:w-24" />

      </div>


      {/* FEATURES */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >

        <div className="mb-9 text-center">

          <p className="text-[10px] uppercase tracking-[0.2em] text-pink-700/80 sm:text-xs">
            Find Your Sukoon
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#315367] sm:text-3xl">
            Why Sukoon
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            A private space blending mindfulness with reflective,
            Gita-inspired wisdom.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {features.map(([icon, title, desc]) => (

            <div
              key={title}
              className={`group relative rounded-3xl border p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${
                title === 'Ask Krishna'
                  ? 'border-pink-200 bg-gradient-to-br from-[#FFF3FA] via-[#F7DCEB] to-[#E9EFFF]'
                  : 'border-pink-200 bg-[#FFF7FB]/80'
              }`}
            >

              <span className="mb-3 block text-3xl transition duration-300 group-hover:scale-110 sm:text-4xl">
                {icon}
              </span>

              <h3 className="font-semibold text-[#36596A] sm:text-lg">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {desc}
              </p>

              {title === 'Ask Krishna' && (
                <span className="absolute right-5 top-5 text-xl opacity-40">
                  🪈
                </span>
              )}

            </div>

          ))}

        </div>
      </section>


      {/* QUOTE */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

        <div className="relative overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-r from-[#EDF1FF] via-[#F6DCEB] to-[#FFE9F4] px-5 py-10 text-center shadow-md sm:px-8 sm:py-14">

          <span className="absolute left-5 top-5 text-3xl opacity-25 sm:text-5xl">
            🦚
          </span>

          <span className="absolute bottom-5 right-5 text-3xl opacity-25 sm:text-4xl">
            🪷
          </span>

          <p className="text-[10px] uppercase tracking-[0.2em] text-pink-700/80 sm:text-xs">
            A gentle reminder
          </p>

          <h3 className="mx-auto mt-4 max-w-2xl text-xl font-semibold leading-relaxed text-[#365669] sm:text-3xl">
            You do not have to solve everything at once.
            Sometimes peace begins with one quiet thought.
          </h3>

          <p className="mt-5 text-xs text-slate-500 sm:text-sm">
            Pause · Reflect · Begin again
          </p>

        </div>

      </section>


      {/* PRIVACY */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">

        <div className="rounded-3xl border border-pink-200 bg-[#FFF7FB]/85 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:p-10">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-pink-100 to-violet-100 sm:h-14 sm:w-14">

            <ShieldCheck
              size={27}
              className="text-teal-600"
            />

          </div>

          <h3 className="text-xl font-semibold text-[#365669] sm:text-2xl">
            Your reflections are personal.
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            Your journals, moods and conversations are private
            to you and protected behind authentication.
          </p>

        </div>

      </section>


      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">

        <span className="mb-4 block text-4xl sm:text-5xl">
          🪷
        </span>

        <h2 className="text-2xl font-semibold text-[#365669] sm:text-3xl">
          Ready to find a little stillness?
        </h2>

        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Your peaceful corner is just one step away.
        </p>

        <Link
          to="/register"
          className="mt-7 inline-block rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          Begin Your Journey
        </Link>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-pink-200 bg-[#FFF4FA]/65 px-4 py-8 text-center">

        <div className="mb-3 text-xl">
          🪷 🦚 ✨
        </div>

        <p className="mx-auto max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
          Sukoon supports reflection and emotional wellbeing but
          does not replace professional mental healthcare.
        </p>

        <p className="mt-2 text-[10px] text-slate-400 sm:text-xs">
          © {new Date().getFullYear()} Sukoon
        </p>

      </footer>

    </div>
  );
};

export default Landing;