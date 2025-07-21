import React, { useState, useEffect } from 'react';
import { DiffPage } from './features/diff';
import { useTranslation } from 'react-i18next';
import TopBar from './components/TopBar';
import MainContent from './components/MainContent';
import BottomBar from './components/BottomBar';
import { lightTheme, darkTheme } from './theme';
import { getCurrentWindow as appWindow } from '@tauri-apps/api/window';

export type PageType = 'home' | 'diff';

function App() {
  const [page, setPage] = useState<PageType>('home');
  const [input, setInput] = useState('');
  const [minimal, setMinimal] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const { t, i18n } = useTranslation();
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  // 切换极简模式时只切换窗口边框，内容和主页面完全一致
  useEffect(() => {
    if (minimal) {
      appWindow().setDecorations(false);
    } else {
      appWindow().setDecorations(true);
    }
  }, [minimal]);

  const handleInputEnter = (v: string) => {
    if (v.trim().toLowerCase() === '@diff') {
      setPage('diff');
      setInput('');
    }
    // 未来可扩展更多指令
  };

  let mainContent = null;
  if (page === 'diff') {
    mainContent = <DiffPage onBack={() => setPage('home')} />;
  } else {
    mainContent = <div style={{ color: theme.text, fontSize: 20, opacity: 0.5 }}>欢迎使用 Promptify！</div>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: theme.bg,
        display: 'flex',
        flexDirection: 'column',
        // borderRadius: 16, // 移除圆角
        // overflow: 'hidden', // 移除溢出隐藏
      }}
    >
      {/* 区域1：顶部输入框区域 */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 10 }}>
        <TopBar
          value={input}
          onChange={setInput}
          onEnter={handleInputEnter}
          theme={theme}
        />
      </div>
      {/* 区域2：功能展示区 */}
      <div style={{
        marginTop: 56,
        marginBottom: 56,
        height: 'calc(100vh - 112px)',
        overflow: 'auto',
        width: '100vw',
      }}>
        <MainContent theme={theme}>
          {mainContent}
        </MainContent>
      </div>
      {/* 区域3：底部菜单栏 */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100vw', zIndex: 10 }}>
        <BottomBar theme={theme}>
          <div style={{ display: 'flex', gap: 16 }}>
            {/* 语言切换 */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
              style={{
                background: theme.btn,
                color: theme.text,
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: 15,
                transition: 'background 0.18s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = theme.btnHover)}
              onMouseOut={e => (e.currentTarget.style.background = theme.btn)}
            >
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>
            {/* 主题切换 */}
            <button
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              style={{
                background: theme.btn,
                color: theme.text,
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: 15,
                transition: 'background 0.18s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = theme.btnHover)}
              onMouseOut={e => (e.currentTarget.style.background = theme.btn)}
            >
              {themeMode === 'light' ? '🌙 暗色' : '☀️ 亮色'}
            </button>
            {/* 极简模式 */}
            <button
              onClick={() => setMinimal(m => !m)}
              style={{
                background: theme.btn,
                color: theme.text,
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: 15,
                transition: 'background 0.18s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = theme.btnHover)}
              onMouseOut={e => (e.currentTarget.style.background = theme.btn)}
            >
              {minimal ? (i18n.language === 'zh' ? '退出极简' : 'Normal') : (i18n.language === 'zh' ? '极简模式' : 'Minimal')}
            </button>
          </div>
          {/* 右侧可放设置等按钮 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              style={{
                background: theme.btn,
                color: theme.text,
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: 15,
                transition: 'background 0.18s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = theme.btnHover)}
              onMouseOut={e => (e.currentTarget.style.background = theme.btn)}
            >
              {i18n.language === 'zh' ? '设置' : 'Settings'}
            </button>
          </div>
        </BottomBar>
      </div>
    </div>
  );
}

export default App;
