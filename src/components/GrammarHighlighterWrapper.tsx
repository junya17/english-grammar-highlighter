'use client';

import dynamic from 'next/dynamic';

// クライアントコンポーネント内でdynamic importを使用
const GrammarHighlighter = dynamic(
  () => import('./GrammarHighlighter'),
  { ssr: false }
);

export default function GrammarHighlighterWrapper() {
  return <GrammarHighlighter />;
} 