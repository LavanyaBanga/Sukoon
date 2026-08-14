import React, { useEffect, useState } from 'react';
import { Heart, Search, Trash2, Sparkles, X, Plus, Feather } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const TYPES = [
  'Brain Dump',
  'Gratitude',
  'Reflection',
  'Something Hurting',
  'Something Beautiful',
  'Daily Journal',
];

const EMOJI = {
  'Brain Dump': '☁️',
  Gratitude: '🌻',
  Reflection: '🪷',
  'Something Hurting': '💗',
  'Something Beautiful': '✨',
  'Daily Journal': '📖',
};

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [type, setType] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wantsReflection, setWantsReflection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/journals', { params: { search } });
      setEntries(data.data || []);
    } catch (err) {
      console.error('Journal load error:', err);
    }
  };

  useEffect(() => {
    load();
  }, [search]);

  const startNew = () => {
    setType(null);
    setTitle('');
    setContent('');
    setWantsReflection(false);
    setShowEditor(true);
  };

  const save = async () => {
    if (!content.trim()) return toast.error('Write something first');

    setSaving(true);
    try {
      const { data } = await api.post('/journals', {
        title,
        content,
        type: type || 'Daily Journal',
        wantsReflection,
      });

      toast.success('Entry saved 🪷');
      setShowEditor(false);
      load();

      if (data.data?.aiReflection) setActive(data.data);
    } catch {
      toast.error('Could not save entry');
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = async (entry) => {
    try {
      const { data } = await api.put(`/journals/${entry._id}`, {
        favorite: !entry.favorite,
      });

      setEntries(prev =>
        prev.map(item => item._id === entry._id ? data.data : item)
      );
    } catch {
      toast.error('Could not update favorite');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/journals/${id}`);
      setEntries(prev => prev.filter(entry => entry._id !== id));
      toast.success('Entry deleted');
    } catch {
      toast.error('Could not delete entry');
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">

        {/* HEADER */}
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                📖
              </div>

              <div>
                <Label>Your private space</Label>
                <h1 className="mt-1 text-xl font-semibold text-[#36566A] sm:text-3xl">
                  Your Quiet Corner
                </h1>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  A gentle place for thoughts, memories and gratitude.
                </p>
              </div>
            </div>

            <button
              onClick={startNew}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
            >
              <Plus size={17} />
              New Entry
            </button>
          </div>
        </Card>

        {/* SEARCH */}
        <div className="relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400"
          />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your entries..."
            className="w-full rounded-full border border-pink-200 bg-[#FFF8FC]/90 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          />
        </div>

        {/* ENTRIES */}
        {entries.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
            {entries.map(entry => (
              <article
                key={entry._id}
                className="flex min-w-0 flex-col rounded-3xl border border-pink-200 bg-[#FFF8FC]/85 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-2">

                  <span className="min-w-0 truncate rounded-full bg-gradient-to-r from-pink-100 via-fuchsia-50 to-violet-100 px-3 py-1.5 text-[10px] text-pink-700 sm:text-[11px]">
                    {EMOJI[entry.type] || '📖'} {entry.type}
                  </span>

                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => toggleFavorite(entry)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-pink-100"
                    >
                      <Heart
                        size={15}
                        className={
                          entry.favorite
                            ? 'fill-pink-500 text-pink-500'
                            : 'text-slate-400'
                        }
                      />
                    </button>

                    <button
                      onClick={() => remove(entry._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {entry.title && (
                  <h3 className="mb-2 break-words text-base font-semibold text-[#36566A] sm:text-lg">
                    {entry.title}
                  </h3>
                )}

                <p className="line-clamp-4 whitespace-pre-wrap break-words text-xs leading-6 text-slate-500 sm:text-sm">
                  {entry.content}
                </p>

                <div className="mt-auto pt-5">
                  <div className="flex justify-between border-t border-pink-100 pt-3 text-[9px] text-slate-400 sm:text-[10px]">
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    <span>{entry.content?.length || 0} chars</span>
                  </div>

                  {entry.aiReflection && (
                    <button
                      onClick={() => setActive(entry)}
                      className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-pink-500 hover:text-pink-600 sm:text-xs"
                    >
                      <Sparkles size={13} />
                      View Sukoon's reflection
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-pink-200 bg-[#FFF8FC]/70 px-5 text-center shadow-sm sm:min-h-[380px]">
            <span className="mb-3 text-5xl sm:text-6xl">🪷</span>

            <h3 className="text-lg font-semibold text-[#36566A] sm:text-xl">
              Your quiet corner is waiting
            </h3>

            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Write your first thought whenever you're ready.
            </p>

            <button
              onClick={startNew}
              className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-2.5 text-xs font-medium text-white sm:text-sm"
            >
              <Plus size={15} />
              Write first entry
            </button>
          </div>
        )}

        <p className="px-3 py-3 text-center text-[10px] text-slate-400 sm:text-xs">
          🦚 Every thought deserves a soft place to land. 🪷
        </p>
      </div>

      {/* NEW ENTRY MODAL */}
      {showEditor && (
        <Modal>
          <div className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF8FC] via-[#FCE5F1] to-[#F1EDFF] p-4 shadow-2xl sm:p-6">

            <ModalHeader
              label="Your quiet corner"
              title={type ? 'Write freely' : 'What kind of entry is this?'}
              close={() => setShowEditor(false)}
            />

            {!type ? (
              <div className="grid grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:gap-3">
                {TYPES.map(item => (
                  <button
                    key={item}
                    onClick={() => setType(item)}
                    className="flex items-center gap-3 rounded-2xl border border-pink-200 bg-white/75 p-3 text-left transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 sm:p-4"
                  >
                    <span className="text-xl sm:text-2xl">{EMOJI[item]}</span>
                    <span className="text-xs font-medium text-slate-600 sm:text-sm">
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="truncate rounded-full bg-pink-100 px-3 py-1.5 text-[10px] text-pink-700 sm:text-xs">
                    {EMOJI[type]} {type}
                  </span>

                  <button
                    onClick={() => setType(null)}
                    className="shrink-0 text-[10px] text-pink-500 hover:underline sm:text-xs"
                  >
                    Change type
                  </button>
                </div>

                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="mb-3 w-full rounded-2xl border border-pink-200 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />

                <textarea
                  rows={7}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write freely... this space is yours."
                  className="w-full resize-none rounded-2xl border border-pink-200 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-700 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />

                <label className="mt-3 flex cursor-pointer gap-3 rounded-2xl border border-fuchsia-100 bg-pink-50/70 p-3 sm:p-4">
                  <input
                    type="checkbox"
                    checked={wantsReflection}
                    onChange={e => setWantsReflection(e.target.checked)}
                    className="mt-1 shrink-0 accent-pink-500"
                  />

                  <div>
                    <p className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Sparkles size={13} className="text-pink-500" />
                      Reflect with Sukoon
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400 sm:text-[11px]">
                      Let Sukoon gently reflect on what you wrote.
                    </p>
                  </div>
                </label>

                <button
                  onClick={save}
                  disabled={saving}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Entry 🪷'}
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* AI REFLECTION */}
      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-3 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-pink-200 bg-gradient-to-br from-[#FFF4FA] via-[#F8DDEA] to-[#EEE9FF] p-4 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
                <Sparkles size={18} className="text-pink-500" />
              </div>

              <div>
                <Label>A gentle reflection</Label>
                <h3 className="text-lg font-semibold text-[#36566A] sm:text-xl">
                  Sukoon's Reflection
                </h3>
              </div>
            </div>

            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
              {active.aiReflection}
            </p>

            <div className="mt-5 flex items-start gap-2 border-t border-pink-200 pt-4 text-[10px] leading-5 text-slate-400 sm:text-xs">
              <Feather size={13} className="mt-1 shrink-0 text-pink-500" />
              Take what resonates and leave yourself room to reflect.
            </div>

            <button
              onClick={() => setActive(null)}
              className="mt-5 w-full rounded-full border border-pink-200 bg-white/80 px-6 py-2.5 text-sm text-slate-600 hover:bg-pink-50 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
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

const Modal = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-3 backdrop-blur-sm sm:p-4">
    {children}
  </div>
);

const ModalHeader = ({ label, title, close }) => (
  <div className="mb-5 flex items-start justify-between gap-3">
    <div>
      <Label>{label}</Label>
      <h2 className="mt-1 text-lg font-semibold text-[#36566A] sm:text-xl">
        {title}
      </h2>
    </div>

    <button
      onClick={close}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-slate-400 hover:bg-pink-100 hover:text-pink-500"
    >
      <X size={18} />
    </button>
  </div>
);

export default Journal;