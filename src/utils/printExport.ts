import { Question } from '../types';

// We deliberately avoid adding a PDF-generation library (jsPDF etc.) since
// this app has no build step you can easily test offline. Every modern
// mobile/desktop browser can already "Print → Save as PDF", so we build a
// clean printable HTML document and trigger that dialog directly.
export function exportQuestionsAsPDF(questions: Question[], title: string) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('পপ-আপ ব্লক করা আছে। ব্রাউজার সেটিংসে পপ-আপ অনুমতি দাও, তারপর আবার চেষ্টা করো।');
    return;
  }

  const rows = questions
    .map((q, i) => {
      const optionsHtml = q.options
        .map((opt, oi) => {
          const isCorrect = oi === q.answerIndex;
          return `<div class="opt ${isCorrect ? 'correct' : ''}">${String.fromCharCode(65 + oi)}. ${escapeHtml(opt)}${
            isCorrect ? ' ✓' : ''
          }</div>`;
        })
        .join('');
      return `
        <div class="q">
          <p class="meta">${i + 1}. ${escapeHtml(q.university)}${q.unit ? ' ' + escapeHtml(q.unit) : ''} · ${q.year} · ${escapeHtml(
        q.subject
      )} / ${escapeHtml(q.chapter)}</p>
          <p class="qtext">${escapeHtml(q.question)}</p>
          <div class="opts">${optionsHtml}</div>
          <p class="expl"><b>ব্যাখ্যা:</b> ${escapeHtml(q.explanation.correct)}</p>
        </div>`;
    })
    .join('\n');

  win.document.write(`<!doctype html>
  <html lang="bn">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: 'Hind Siliguri', 'Noto Sans Bengali', Arial, sans-serif; padding: 24px; color: #1a1a1a; }
      h1 { font-size: 20px; margin-bottom: 4px; }
      .sub { color: #666; font-size: 12px; margin-bottom: 20px; }
      .q { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #ddd; break-inside: avoid; }
      .meta { font-size: 11px; color: #888; margin: 0 0 4px; }
      .qtext { font-size: 14px; font-weight: 600; margin: 0 0 8px; }
      .opts { margin-bottom: 6px; }
      .opt { font-size: 13px; margin: 2px 0; }
      .opt.correct { color: #0a7a2f; font-weight: 600; }
      .expl { font-size: 12px; color: #444; margin: 0; }
      @media print { body { padding: 8px; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p class="sub">মোট ${questions.length}টি প্রশ্ন · প্রশ্নব্যাংক অ্যাপ থেকে এক্সপোর্ট করা হয়েছে</p>
    ${rows}
    <script>
      window.onload = function () { window.print(); };
    </script>
  </body>
  </html>`);
  win.document.close();
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
