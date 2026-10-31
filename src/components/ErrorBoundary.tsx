import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: String(error?.stack || error?.message || error) };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('অ্যাপে একটা এরর ধরা পড়েছে:', error, info);
  }

  handleReload = () => {
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
          <p className="max-h-64 w-full overflow-auto break-words rounded-xl bg-white p-3 text-left font-mono text-[10px] text-brick-dark">
            {this.state.message}
          </p>
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
