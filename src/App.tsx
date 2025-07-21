import React, { useState } from 'react';
import { DiffPage } from './features/diff';
import { useTranslation, Trans } from 'react-i18next';

export type PageType = 'home' | 'diff';

function App() {
  const [page, setPage] = useState<PageType>('home');
  const [input, setInput] = useState('');
  const { t, i18n } = useTranslation();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (input.trim().toLowerCase() === '@diff') {
        setPage('diff');
        setInput('');
      }
      // 未来可扩展更多指令
    }
  };

  const handleLangSwitch = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  if (page === 'diff') {
    return <DiffPage onBack={() => setPage('home')} />;
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      }}
    >
      <button
        onClick={handleLangSwitch}
        style={{ position: 'absolute', top: 24, right: 32, fontSize: 15, border: 'none', background: 'none', color: '#666', cursor: 'pointer' }}
      >
        {i18n.language === 'zh' ? 'EN' : '中文'}
      </button>
      <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 32, letterSpacing: 2, color: '#222' }}>{t('title')}</h1>
      <input
        type="text"
        placeholder={t('input_placeholder')}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleInputKeyDown}
        style={{
          width: 340,
          fontSize: 18,
          padding: '14px 18px',
          borderRadius: 8,
          border: '1.5px solid #d1d5db',
          outline: 'none',
          background: '#f9fafb',
          transition: 'border-color 0.2s',
        }}
        autoFocus
      />
      <p style={{ color: '#888', marginTop: 14, fontSize: 15 }}>
        <Trans i18nKey="input_tip">
          输入 <b>@diff</b> 进入文本比较
        </Trans>
      </p>
    </div>
  );
}

export default App;
