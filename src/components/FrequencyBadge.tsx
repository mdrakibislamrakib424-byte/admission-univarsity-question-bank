import React from 'react';
import { frequencyTag } from '../types';

export const FrequencyBadge: React.FC<{ timesAsked?: number }> = ({ timesAsked }) => {
  const tag = frequencyTag(timesAsked);
  if (tag === 'none') return null;

  const config = {
    hot: { emoji: '🔥', label: `${timesAsked} বার এসেছে`, cls: 'bg-brick/15 text-brick dark:text-brick' },
    important: { emoji: '⭐', label: `${timesAsked} বার এসেছে`, cls: 'bg-amber/15 text-amber-dark dark:text-amber' },
    seen: { emoji: '🔵', label: `${timesAsked} বার এসেছে`, cls: 'bg-ink-500/15 text-ink-500 dark:text-ink-400' }
  }[tag];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.cls}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};
