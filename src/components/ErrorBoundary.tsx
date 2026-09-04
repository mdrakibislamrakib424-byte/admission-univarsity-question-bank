// src/components/ErrorBoundary.tsx
//
// অ্যাপের কোনো অংশে অপ্রত্যাশিত এরর (crash) হলে পুরো সাদা স্ক্রিন না
// দেখিয়ে একটা বন্ধুত্বপূর্ণ মেসেজ দেখানোর জন্য।

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('অ্যাপে একটা এরর ধরা পড়েছে:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center dark:bg-ink-900">
          <span className="text-5xl">😵</span>
          <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">
            দুঃখিত, একটা সমস্যা হয়েছে
          </p>
          <p className="text-sm text-ink-500">অ্যাপটা রিলোড করলেই ঠিক হয়ে যাওয়ার কথা।</p>
          <button
            onClick={this.handleReload}
            className="rounded-full bg-amber px-6 py-2.5 text-sm font-semibold text-ink-950"
          >
            🔄 রিলোড করো
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
