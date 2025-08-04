import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { useTranslation } from 'react-i18next';
import { lightTheme, darkTheme } from '../../theme';

interface ClipboardItem {
  id: number;
  content: string;
}

interface ClipboardHistoryPageProps {
  onBack?: () => void;
  theme: typeof lightTheme | typeof darkTheme;
}

const ListItem: React.FC<{ children: React.ReactNode; onClick: () => void; theme: ClipboardHistoryPageProps['theme'] }> = ({ children, onClick, theme }) => (
  <div
    onClick={onClick}
    style={{
      padding: '10px 16px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      borderRadius: 6,
      color: theme.text,
    }}
  >
    {children}
  </div>
);

const ClipboardHistoryPage: React.FC<ClipboardHistoryPageProps> = ({ onBack, theme }) => {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    invoke<ClipboardItem[]>('get_clipboard_history').then(setHistory)
      .catch((err) => {
        console.error('Failed to get clipboard history:', err);
        setError('Could not load clipboard history.');
      });
  }, []);

  const handleItemClick = (content: string) => {
    writeText(content).catch(console.error);
    // TODO: Add a "Copied!" notification
  };

  if (error) {
    return <div style={{ color: 'red', padding: 20 }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 8px' }}>
      <