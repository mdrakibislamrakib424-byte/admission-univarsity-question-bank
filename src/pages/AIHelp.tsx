import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { askClaude, ChatMessage, DOUBT_SOLVER_SYSTEM_PROMPT } from '../utils/ai';

export const AIHelp: React.FC = () => {
  const { userData, setAiSettings } = useAppData();
  const [apiKeyInput, setApiKeyInput] = useState(userData.aiApiKey);
  const [modelInput, setModelInput] = useState(userData.aiModel);
  const [showSettings, setShowSettings] = useState(!userData.aiApiKey);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveSettings = () => {
    setAiSettings(apiKeyInput.trim(), modelInput.trim());
    setShowSettings(false);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!userData.aiApiKey) {
      setShowSettings(true);
      return;
    }
    const next = [...messages, { role: 'user', content: text } as ChatMessage];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const reply = await askClaude(userData.aiApiKey, userData.aiModel, next, DOUBT_SOLVER_SYSTEM_PROMPT);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError('উত্তর আনতে সমস্যা হয়েছে। API key ও ইন্টারনেট চেক করো। (' + (e as Error).message + ')');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper pb-24 dark:bg-ink-900">
      <Header title="🤖 AI ডাউট সলভার" showBack />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-5">
        <div className="flex items-start gap-2.5 rounded-2xl bg-gradient-to-r from-amber/10 to-transparent p-3.5">
          <span className="text-lg">🔒</span>
          <p className="text-xs leading-relaxed text-ink-500 dark:text-ink-300">
            এই ফিচারটা তোমার নিজের Anthropic API key দিয়ে সরাসরি ব্রাউজার থেকে কাজ করে — key শুধু তোমার ফোনেই থাকে, অন্য
            কোথাও যায় না।
          </p>
        </div>

        {showSettings ? (
          <section className="space-y-3.5 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-800 dark:text-ink-100">
              <span>⚙️</span> AI সেটিংস
            </p>
            <label className="block text-xs font-medium text-ink-500">
              Anthropic API Key
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
              />
            </label>
            <label className="block text-xs font-medium text-ink-500">
              Model
              <input
                type="text"
                value={modelInput}
                onChange={e => setModelInput(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
              />
            </label>
            <p className="text-xs text-ink-400">
              console.anthropic.com থেকে নিজের key বানিয়ে এখানে বসাও। key ছাড়া এই ফিচার কাজ করবে না।
            </p>
            <button
              onClick={saveSettings}
              disabled={!apiKeyInput.trim()}
              className="w-full rounded-full bg-gradient-to-r from-amber to-amber-dark py-2.5 text-sm font-semibold text-ink-950 shadow-md shadow-amber/30 transition-transform active:scale-[0.98] disabled:opacity-40"
            >
              সেভ করো
            </button>
          </section>
        ) : (
          <button
            onClick={() => setShowSettings(true)}
            className="self-end rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-500 dark:bg-ink-800 dark:text-ink-300"
          >
            ⚙️ API key / model বদলাও
          </button>
        )}

        <div className="flex-1 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-ink-800">
              <span className="text-3xl">💬</span>
              <p className="text-sm text-ink-400">
                যেকোনো প্রশ্নে আটকে গেলে এখানে জিজ্ঞেস করো — যেমন "সন্ধি বিচ্ছেদ কীভাবে করব?"
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'ml-auto bg-gradient-to-br from-amber/25 to-amber/10 text-ink-900 dark:text-ink-100'
                  : 'mr-auto bg-white text-ink-800 dark:bg-ink-800 dark:text-ink-100'
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="mr-auto flex items-center gap-1.5 rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-ink-800">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300" />
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-2xl bg-brick/10 p-3 text-sm text-brick-dark dark:text-brick">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-20 flex gap-2 rounded-full border border-ink-200 bg-white p-1.5 shadow-lg dark:border-ink-700/50 dark:bg-ink-800">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="তোমার প্রশ্ন লেখো..."
            className="flex-1 bg-transparent px-3 text-sm outline-none dark:text-ink-100"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-full bg-gradient-to-r from-amber to-amber-dark px-5 py-1.5 text-sm font-semibold text-ink-950 shadow-sm transition-transform active:scale-95 disabled:opacity-40"
          >
            পাঠাও ➤
          </button>
        </div>
      </main>
    </div>
  );
};
