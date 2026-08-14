import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartHandshake, X } from 'lucide-react';

const GROUNDING_STEPS = [
  { count: 5, sense: 'see', prompt: '5 things you can see around you' },
  { count: 4, sense: 'touch', prompt: '4 things you can touch' },
  { count: 3, sense: 'hear', prompt: '3 things you can hear' },
  { count: 2, sense: 'smell', prompt: '2 things you can smell' },
  { count: 1, sense: 'taste', prompt: '1 thing you can taste' },
];

const SOSButton = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('in');

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setPhase((p) => (p === 'in' ? 'out' : 'in'));
    }, 4000);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <>
      <button
        onClick={() => { setOpen(true); setStep(0); }}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-red-500/90 hover:bg-red-500 text-white text-sm font-medium shadow-lg shadow-red-500/30 transition-all"
      >
        <HeartHandshake size={18} />
        <span className="hidden sm:inline">I Need To Calm Down</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-indigo-950/98 backdrop-blur-xl flex flex-col items-center justify-center px-6 text-center"
          >
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-cream/60 hover:text-cream">
              <X size={28} />
            </button>

            <p className="text-cream/60 mb-6 text-sm">You only need to focus on the next few moments.</p>

            <motion.div
              animate={{ scale: phase === 'in' ? 1.3 : 1 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-gold/40 to-peacock/40 border border-gold/30 flex items-center justify-center mb-8"
            >
              <span className="text-cream font-display text-lg">{phase === 'in' ? 'Breathe In' : 'Breathe Out'}</span>
            </motion.div>

            <h2 className="font-display text-2xl sm:text-3xl text-cream mb-3">{GROUNDING_STEPS[step].count} things you can {GROUNDING_STEPS[step].sense}</h2>
            <p className="text-cream/50 mb-8 max-w-md">Take your time. Name each one slowly, in your mind or out loud.</p>

            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep((s) => s - 1)} className="px-5 py-2.5 rounded-full glass text-cream/70 text-sm">
                  Back
                </button>
              )}
              {step < GROUNDING_STEPS.length - 1 ? (
                <button onClick={() => setStep((s) => s + 1)} className="px-6 py-2.5 rounded-full bg-gold text-indigo-950 font-medium text-sm">
                  Next
                </button>
              ) : (
                <button onClick={() => setOpen(false)} className="px-6 py-2.5 rounded-full bg-gold text-indigo-950 font-medium text-sm">
                  I feel a little steadier
                </button>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 w-full max-w-md">
              <p className="text-cream/40 text-xs mb-2">This is grounding support, not emergency treatment.</p>
              <p className="text-cream/70 text-sm">If you're in danger or thinking of harming yourself, please contact your local emergency number or a crisis helpline right now.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
