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
    <div className="pb-24">
      <Header title="🤖 AI ডাউট সলভার" showBack />
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-5">
        <p className="text-xs text-ink-400">
          এই ফিচারটা তোমার নিজের Anthropic API key দিয়ে সরাসরি ব্রাউজার থেকে কাজ করে — এই অ্যাপের কোনো নিজস্ব সার্ভার নেই, তাই
          key শুধু তোমার ফোনেই থাকে, অন্য কোথাও যায় না।
        </p>

        {showSettings ? (
          <section className="space-y-3 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
            <label className="block text-xs text-ink-500">
              Anthropic API Key
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900"
              />
            </label>
            <label className="block text-xs text-ink-500">
              Model
              <input
                type="text"
                value={modelInput}
                onChange={e => setModelInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900"
              />
            </label>
            <p className="text-xs text-ink-400">
              console.anthropic.com থেকে নিজের key বানিয়ে এখানে বসাও। key ছাড়া এই ফিচার কাজ করবে না।
            </p>
            <button
              onClick={saveSettings}
              disabled={!apiKeyInput.trim()}
              className="w-full rounded-full bg-amber py-2 text-sm font-semibold text-ink-950 disabled:opacity-50"
            >
              সেভ করো
            </button>
          </section>
        ) : (
          <button onClick={() => setShowSettings(true)} className="self-end text-xs text-ink-400 underline">
            ⚙️ API key / model বদলাও
          </button>
        )}

        <div className="flex-1 space-y-3">
          {messages.length === 0 && (
            <p className="rounded-xl bg-paper p-4 text-sm text-ink-400 dark:bg-ink-900/40">
              যেকোনো প্রশ্নে আটকে গেলে এখানে জিজ্ঞেস করো — যেমন "সন্ধি বিচ্ছেদ কীভাবে করব?" বা কোনো অঙ্কের ধাপ বুঝিয়ে দাও।
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto bg-amber/20 text-ink-900 dark:text-ink-100'
                  : 'mr-auto bg-white text-ink-800 dark:bg-ink-800 dark:text-ink-100'
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="mr-auto rounded-2xl bg-white px-4 py-2.5 text-sm text-ink-400 dark:bg-ink-800">লিখছে…</div>}
          {error && <p className="text-sm text-brick-dark dark:text-brick">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-20 flex gap-2 rounded-full border border-ink-200 bg-white p-1.5 dark:border-ink-700/50 dark:bg-ink-800">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="তোমার প্রশ্ন লেখো..."
            className="flex-1 bg-transparent px-3 text-sm outline-none"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-full bg-amber px-4 py-1.5 text-sm font-semibold text-ink-950 disabled:opacity-50"
          >
            পাঠাও
          </button>
        </div>
      </main>
    </div>
  );
};
