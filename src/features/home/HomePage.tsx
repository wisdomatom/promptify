import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { lightTheme, darkTheme } from '../../theme';

// 定义从后端接收的数据结构
interface AppInfo {
  name: string;
  path: string;
}

interface ClipboardItem {
  id: number;
  content: string;
}

interface HomePageProps {
  theme: typeof lightTheme | typeof darkTheme;
}

// 列表项通用组件
const ListItem: React.FC<{ children: React.ReactNode, theme: HomePageProps['theme'], isSelected?: boolean }> = ({ children, theme, isSelected }) => (
  <div style={{
    padding: '10px 16px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    background: isSelected ? theme.btnHover : 'transparent',
    borderRadius: 6,
    color: theme.text,
  }}>
    {children}
  </div>
);

// 列表头通用组件
const ListHeader: React.FC<{ children: React.ReactNode, theme: HomePageProps['theme'] }> = ({ children, theme }) => (
  <div style={{
    padding: '16px 16px 4px',
    fontSize: '12px',
    fontWeight: 600,
    color: theme.text,
    opacity: 0.5,
  }}>
    {children}
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ theme }) => {
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([]);
  const [installedApps, setInstalledApps] = useState<AppInfo[]>([]);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState('clipboard-0'); // 默认选中第一项

  useEffect(() => {
    // 获取剪贴板历史
    invoke<ClipboardItem[]>('get_clipboard_history')
      .then(setClipboardHistory)
      .catch(err => {
        console.error('Failed to get clipboard history:', err);
        setError('Could not load clipboard history.');
      });

    // 获取已安装应用
    invoke<AppInfo[]>('get_installed_apps')
      .then(setInstalledApps)
      .catch(err => {
        console.error('Failed to get installed apps:', err);
        setError('Could not load installed apps.');
      });
  }, []);

  if (error) {
    return <div style={{ color: 'red', padding: 20 }}>Error: {error}</div>;
  }

  return (
    <div 
    style={{ 
      paddingBottom: 16,
      // background: theme.bg,
       }}>
      {/* Suggestions Section */}
      <ListHeader theme={theme}>Suggestions</ListHeader>
      {clipboardHistory.map((item, index) => (
        <ListItem
          key={`clipboard-${index}`}
          theme={theme}
          isSelected={selectedItem === `clipboard-${index}`}
        >
          <span style={{ marginRight: 12, width: 16 }}>📋</span>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{item.content}</span>
        </ListItem>
      ))}

      {/* Commands Section */}
      <ListHeader theme={theme}>Commands</ListHeader>
      {installedApps.map((app, index) => (
        <ListItem
          key={`app-${index}`}
          theme={theme}
          isSelected={selectedItem === `app-${index}`}
        >
          <span style={{ marginRight: 12, width: 16 }}>🚀</span>
          <span>{app.name}</span>
        </ListItem>
      ))}
    </div>
  );
};

export default HomePage;