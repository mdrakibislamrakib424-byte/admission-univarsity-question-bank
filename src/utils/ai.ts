// Calls the Anthropic API directly from the browser using the user's own
// API key (stored only in this device's localStorage, never sent anywhere
// except api.anthropic.com). This app has no backend/server of its own, so
// there is no way to hide a shared key — each user must paste their own key
// from https://console.anthropic.com to use the AI Doubt Solver.

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askClaude(
  apiKey: string,
  model: string,
  history: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  if (!apiKey) throw new Error('NO_API_KEY');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: history.map(m => ({ role: m.role, content: m.content }))
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`API_ERROR_${response.status}: ${text}`);
  }

  const data = await response.json();
  const textBlocks = (data.content || [])
    .map((block: { type: string; text?: string }) => (block.type === 'text' ? block.text : ''))
    .filter(Boolean);
  return textBlocks.join('\n').trim() || '(কোনো উত্তর পাওয়া যায়নি)';
}

export const DOUBT_SOLVER_SYSTEM_PROMPT =
  'তুমি একজন বাংলাদেশি বিশ্ববিদ্যালয় ভর্তি পরীক্ষার সহায়ক শিক্ষক। ' +
  'শিক্ষার্থী বাংলা/ইংরেজি/সাধারণ জ্ঞান/বিজ্ঞানের যেকোনো প্রশ্ন নিয়ে ধন্দে থাকলে, ' +
  'ধাপে ধাপে সহজ ভাষায় বুঝিয়ে দাও। সংক্ষিপ্ত কিন্তু সম্পূর্ণ উত্তর দাও, প্রয়োজনে উদাহরণ দাও।';

