import React from 'react';

interface TopBarProps {
  value: string;
  onChange: (v: string) => void;
  onEnter: (v: string) => void;
  theme: any;
  leftButtons?: React.ReactNode;
  rightButtons?: React.ReactNode;
}

const BUTTON_WIDTH = 0; // 若有按钮可设为56

const TopBar: React.FC<TopBarProps> = ({ value, onChange, onEnter, theme, leftButtons, rightButtons }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter(value);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: 56,
        background: theme.main + '33', // 20% 透明度
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        borderBottom: `1px solid ${theme.border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* 左侧按钮 */}
      <div style={{ width: BUTTON_WIDTH, height: 56, display: 'flex', alignItems: 'center' }}>
        {leftButtons}
      </div>
      {/* 输入框本身占满顶部 */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入 @指令..."
        style={{
          width: `calc(100vw - ${2 * BUTTON_WIDTH}px)` as any,
          height: 56,
          fontSize: 22,
          border: 'none',
          outline: 'none',
          background: theme.main,
          color: theme.inputText,
          borderRadius: 0,
          paddingLeft: 14,
          paddingRight: 0,
          boxShadow: 'none',
          margin: 0,
          transition: 'box-shadow 0.18s',
        }}
        autoFocus
      />
      {/* 右侧按钮 */}
      <div style={{ width: BUTTON_WIDTH, height: 56, display: 'flex', alignItems: 'center' }}>
        {rightButtons}
      </div>
    </div>
  );
};

export default TopBar; 