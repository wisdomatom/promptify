import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentWindow as appWindow } from '@tauri-apps/api/window';

interface MinimalModeProps {
  value: string;
  onChange: (v: string) => void;
  onEnter: (v: string) => void;
  onExit: () => void;
}

const MinimalMode: React.FC<MinimalModeProps> = ({ value, onChange, onEnter, onExit }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    appWindow().setDecorations(false);
    if (inputRef.current) inputRef.current.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      appWindow().setDecorations(true);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onExit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter(value);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 输入框和返回按钮贴合，整行可拖动 */}
      <div
        style={{
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          WebkitAppRegion: 'drag',
        }}
      >
        <button
          onClick={onExit}
          style={{
            WebkitAppRegion: 'no-drag',
            border: 'none',
            background: 'none',
            outline: 'none',
            height: 60,
            width: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            borderRight: '1px solid #eee',
            cursor: 'pointer',
            transition: 'background 0.18s',
            fontSize: 22,
            color: '#888',
            marginRight: -2,
          }}
          title={t('diff_back')}
          onMouseOver={e => (e.currentTarget.style.background = '#f2f3f5')}
          onMouseOut={e => (e.currentTarget.style.background = 'none')}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 6L9.5 11L13.5 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder={t('input_placeholder')}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: 'calc(100vw - 56px)',
            height: 60,
            fontSize: 28,
            border: 'none',
            outline: 'none',
            background: '#fff',
            padding: '0 32px',
            color: '#222',
            boxSizing: 'border-box',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            WebkitAppRegion: 'no-drag',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
          }}
          autoFocus
        />
      </div>
    </div>
  );
};

export default MinimalMode; 