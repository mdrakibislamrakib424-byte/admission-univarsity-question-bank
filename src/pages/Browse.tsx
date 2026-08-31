import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { FrequencyBadge } from '../components/FrequencyBadge';

function useFilterOptions(questions: any[], filters: Record<string, string>) {
  return useMemo(() => {
    let filtered = questions;
    if (filters.university) filtered = filtered.filter(q => q.university === filters.university);
    if (filters.unit) filtered = filtered.filter(q => q.unit === filters.unit);
    if (filters.year) filtered = filtered.filter(q => String(q.year) === filters.year);
    if (filters.subject) filtered = filtered.filter(q => q.subject === filters.subject);
    if (filters.chapter) filtered = filtered.filter(q => q.chapter === filters.chapter);
    return filtered;
  }, [questions, filters]);
}

export const Browse: React.FC = () => {
  const { questions } = useAppData();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const filters = {
    university: params.get('university') || '',
    unit: params.get('unit') || '',
    year: params.get('year') || '',
    subject: params.get('subject') || '',
    chapter: params.get('chapter') || ''
  };

  const filtered = useFilterOptions(questions, filters);

  const options = (key: string, source: any[]) => {
    const base = key === 'unit' ? source.filter(q => !filters.university || q.university === filters.university) : source;
    return Array.from(new Set(base.map((q: any) => q[key]).filter(Boolean))).sort();
  };

  const universities = options('university', questions);
  const units = options('unit', questions);
  const years = options('year', questions).sort((a: any, b: any) => b - a);
  const subjects = options('subject', questions);
  const chapters = options('chapter', questions.filter(q => !filters.subject || q.subject === filters.subject));

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const Select: React.FC<{ label: string; filterKey: string; opts: any[] }> = ({ label, filterKey, opts }) => (
    <select
      value={(filters as any)[filterKey]}
      onChange={e => setFilter(filterKey, e.target.value)}
      className="rounded-lg border border-ink-200 bg-white px-2 py-2 text-sm text-ink-800 dark:border-ink-700/50 dark:bg-ink-800 dark:text-ink-100"
    >
      <option value="">{label}</option>
      {opts.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );

  return (
    <div className="pb-24">
      <Header title="প্রশ্ন ব্রাউজ করো" />
      <main className="mx-auto max-w-lg px-4 py-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Select label="বিশ্ববিদ্যালয়" filterKey="university" opts={universities} />
          <Select label="ইউনিট" filterKey="unit" opts={units} />
          <Select label="সাল" filterKey="year" opts={years} />
          <Select label="বিষয়" filterKey="subject" opts={subjects} />
          <Select label="অধ্যায়" filterKey="chapter" opts={chapters} />
          {Object.values(filters).some(Boolean) && (
            <button
              onClick={() => setParams({})}
              className="rounded-lg border border-brick/40 px-2 py-2 text-sm text-brick"
            >
              ফিল্টার মুছো
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-ink-500">{filtered.length}টি প্রশ্ন পাওয়া গেছে</p>
          {filtered.length > 0 && (
            <button
              onClick={() => navigate(`/practice?ids=${filtered.map(q => q.id).join(',')}`)}
              className="rounded-full bg-amber px-4 py-1.5 text-sm font-semibold text-ink-950"
            >
              সব প্র্যাকটিস করো
            </button>
          )}
        </div>

        <ul className="mt-3 divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 dark:divide-ink-700/40 dark:border-ink-700/40">
          {filtered.slice(0, 100).map(q => (
            <li key={q.id}>
              <button
                onClick={() => navigate(`/practice?ids=${q.id}`)}
                className="flex w-full flex-col items-start gap-1 bg-white px-4 py-3 text-left dark:bg-ink-800"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-xs text-ink-400">{q.university}{q.unit ? ` ${q.unit}` : ''} · {q.year} · {q.chapter}</span>
                  <FrequencyBadge timesAsked={q.timesAsked} />
                </div>
                <span className="line-clamp-2 text-sm text-ink-800 dark:text-ink-100">{q.question}</span>
              </button>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-400">
            এই ফিল্টারে কোনো প্রশ্ন নেই। এডমিন প্যানেল থেকে questions.json-এ নতুন প্রশ্ন যোগ করো।
          </p>
        )}
      </main>
    </div>
  );
};
