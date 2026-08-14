import React, { useEffect, useRef, useState } from 'react';
import {
  Send, Plus, Trash2, MessageCircle,
  Sparkles, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const SUGGESTIONS = [
  ['I feel overwhelmed.', '🌧️'],
  ['Help me calm down.', '🌿'],
  ['I am overthinking.', '☁️'],
  ['I had a bad day.', '🌙'],
  ['I am scared about my future.', '🪷'],
];

const TypingDots = () => (
  <div className="flex gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span key={i} className="h-2 w-2 animate-pulse rounded-full bg-pink-400" />
    ))}
  </div>
);

const TalkToSukoon = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesRef = useRef(null);

  const loadConversations = async () => {
    try {
      const { data } = await api.get('/ai/conversations', {
        params: { type: 'general' },
      });
      setConversations(data?.data || []);
    } catch (err) {
      console.error('Conversation error:', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const box = messagesRef.current;
    if (!box) return;

    box.scrollTo({
      top: box.scrollHeight,
      behavior: messages.length ? 'smooth' : 'auto',
    });
  }, [messages, sending]);

  const openConversation = async id => {
    try {
      const { data } = await api.get(`/ai/conversations/${id}`);
      setActiveId(id);
      setMessages(data?.data?.messages || []);
    } catch {
      toast.error('Could not load that conversation');
    }
  };

  const newConversation = () => {
    setActiveId(null);
    setMessages([]);
    setInput('');
  };

  const deleteConversation = async (id, e) => {
    e.stopPropagation();

    try {
      await api.delete(`/ai/conversations/${id}`);
      setConversations(prev => prev.filter(chat => chat._id !== id));

      if (activeId === id) newConversation();
      toast.success('Conversation removed 🌿');
    } catch {
      toast.error('Could not delete conversation');
    }
  };

  const send = async text => {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', content, timestamp: new Date() },
    ]);
    setSending(true);

    try {
      const { data } = await api.post('/ai/chat', {
        message: content,
        ...(activeId && { conversationId: activeId }),
      });

      setActiveId(data.data.conversationId);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.data.reply,
          timestamp: new Date(),
        },
      ]);

      loadConversations();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Sukoon could not respond right now'
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="h-[calc(100dvh-2rem)] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF0F7] via-[#F8E6F1] to-[#EEF1FF] p-2 sm:h-[calc(100dvh-4rem)] sm:p-4">

      <div className="grid h-full min-h-0 gap-3 md:grid-cols-[240px_minmax(0,1fr)]">

        {/* SIDEBAR */}
        <aside className="hidden min-h-0 flex-col rounded-3xl border border-pink-200 bg-[#FFF7FB]/85 p-4 shadow-sm md:flex">

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 text-xl">
              🪷
            </div>

            <div>
              <h2 className="font-semibold text-[#36566A]">Your Chats</h2>
              <p className="text-[10px] text-slate-400">
                A quiet place to return
              </p>
            </div>
          </div>

          <button
            onClick={newConversation}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 py-3 text-sm font-medium text-white shadow-sm"
          >
            <Plus size={15} />
            New conversation
          </button>

          <Label>Previous chats</Label>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
            {!conversations.length && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="text-4xl">🌱</span>
                <p className="mt-3 text-xs text-slate-400">
                  Your conversations will appear here.
                </p>
              </div>
            )}

            {conversations.map(chat => (
              <div
                key={chat._id}
                onClick={() => openConversation(chat._id)}
                className={`group flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${
                  activeId === chat._id
                    ? 'border-pink-200 bg-pink-50 text-slate-600'
                    : 'border-transparent text-slate-500 hover:bg-white/70'
                }`}
              >
                <MessageCircle size={14} />

                <span className="min-w-0 flex-1 truncate">
                  {chat.title || 'Conversation'}
                </span>

                <button
                  onClick={e => deleteConversation(chat._id, e)}
                  className="text-slate-300 opacity-0 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* CHAT */}
        <section className="min-h-0 min-w-0 overflow-hidden rounded-3xl border border-pink-200 bg-[#FFF8FC]/90 shadow-sm">
          <div className="flex h-full min-h-0 flex-col">

            {/* HEADER */}
            <header className="flex shrink-0 items-center justify-between border-b border-pink-100 px-3 py-3 sm:px-5">

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-violet-100 sm:h-10 sm:w-10">
                  <MessageCircle size={18} className="text-pink-500" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate font-semibold text-[#36566A] sm:text-lg">
                    Talk to Sukoon
                  </h1>
                  <p className="text-[9px] text-slate-400 sm:text-[10px]">
                    🟢 A gentle space to talk
                  </p>
                </div>
              </div>

              <span className="text-xl sm:text-2xl">🦚</span>
            </header>

            {/* MOBILE CHATS */}
            <div className="flex shrink-0 gap-2 overflow-x-auto px-3 pt-3 md:hidden">

              <button
                onClick={newConversation}
                className="flex shrink-0 items-center gap-1 rounded-full bg-pink-100 px-3 py-2 text-[11px] text-pink-600"
              >
                <Plus size={12} />
                New chat
              </button>

              {conversations.slice(0, 4).map(chat => (
                <button
                  key={chat._id}
                  onClick={() => openConversation(chat._id)}
                  className={`max-w-[120px] shrink-0 truncate rounded-full border px-3 py-2 text-[11px] ${
                    activeId === chat._id
                      ? 'border-pink-300 bg-pink-100 text-pink-600'
                      : 'border-pink-100 bg-white/70 text-slate-500'
                  }`}
                >
                  {chat.title || 'Chat'}
                </button>
              ))}
            </div>

            {/* MESSAGES */}
            <div
              ref={messagesRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 lg:px-6"
            >

              {!messages.length && !sending && (
                <div className="flex h-full flex-col items-center justify-center px-2 text-center">

                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 text-3xl sm:h-16 sm:w-16">
                    🪷
                  </div>

                  <Label>Your safe space</Label>

                  <h2 className="mt-2 text-xl font-semibold text-[#36566A] sm:text-2xl">
                    What's on your mind?
                  </h2>

                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
                    You don't need the perfect words. Start wherever you are.
                  </p>

                  <div className="mt-4 flex max-w-xl flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map(([text, emoji]) => (
                      <button
                        key={text}
                        onClick={() => send(text)}
                        className="rounded-full border border-pink-200 bg-white/80 px-3 py-2 text-[10px] text-slate-500 transition hover:bg-pink-50 sm:text-[11px]"
                      >
                        {emoji} {text}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 flex items-center gap-1 text-[10px] text-slate-400">
                    <Heart size={11} className="text-pink-400" />
                    Share only what feels comfortable.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';

                  return (
                    <div
                      key={i}
                      className={`flex items-end ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm">
                          🪷
                        </div>
                      )}

                      <div
                        className={`max-w-[88%] whitespace-pre-wrap break-words px-3 py-2.5 text-xs leading-5 sm:max-w-[75%] sm:px-4 sm:text-sm sm:leading-6 ${
                          isUser
                            ? 'rounded-2xl rounded-br-md bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white'
                            : 'rounded-2xl rounded-bl-md border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-violet-50 text-slate-600'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                {sending && (
                  <div className="flex items-end">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                      🪷
                    </div>

                    <div className="rounded-2xl rounded-bl-md border border-pink-100 bg-pink-50">
                      <TypingDots />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* INPUT */}
            <footer className="shrink-0 border-t border-pink-100 bg-[#FFF8FC]/80 px-2 py-2 sm:px-5 sm:py-3">

              <div className="flex items-center gap-2 rounded-3xl border border-pink-200 bg-white/90 p-1.5 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-100">

                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type how you're feeling..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:text-sm"
                />

                <button
                  onClick={() => send()}
                  disabled={!input.trim() || sending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white disabled:opacity-30 sm:h-10 sm:w-10"
                >
                  <Send size={15} />
                </button>
              </div>

              <p className="mt-1.5 flex items-center justify-center gap-1 text-[8px] text-slate-400 sm:text-[9px]">
                <Sparkles size={9} className="text-pink-400" />
                Sukoon offers gentle reflection and emotional support.
              </p>

            </footer>
          </div>
        </section>

      </div>
    </div>
  );
};

const Label = ({ children }) => (
  <p className="px-1 pb-2 pt-4 text-[9px] uppercase tracking-[.17em] text-pink-700/60 sm:text-[10px]">
    {children}
  </p>
);

export default TalkToSukoon;