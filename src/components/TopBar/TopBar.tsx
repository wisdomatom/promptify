import React from 'react';

interface TopBarProps {
  value: string;
  onChange: (v: string) => void;
  onEnter: (v: string) => void;
  theme: any;
  leftButtons?: React.ReactNode;
  rightButtons?: React.ReactNode;
}

// const BUTTON_WIDTH = 0; // 不再需要这个变量

const TopBar: React.FC<TopBarProps> = ({ value, onChange, onEnter, theme, leftButtons, rightButtons }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter(value);
    }
  };

  return (
    <div
      data-tauri-drag-region
      style={{
        width: '100%',
        height: 56,
        background: theme.bg, // 20% 透明度
        display: 'flex',
        alignItems: 'center',
        // 修改 padding 来为拖动区域留出空间
        justifyContent: 'space-between',
        padding: '0 12px',
        boxSizing: 'border-box',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      {/* 左侧按钮 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {leftButtons}
      </div>
      {/* 输入框 */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入 @指令..."
        style={{
          flex: 1, // 占据可用空间
          height: '70%',
          fontSize: 17,
          border: 'none',
          outline: 'none',
          background: 'none', // 背景设为透明，以显示父元素的毛玻璃效果
          color: theme.inputText,
          padding: '0 14px', // 输入框内部也需要一些 padding
          boxShadow: 'none',
          margin: '0 12px', // 与左右按钮/边缘保持间距
          transition: 'box-shadow 0.18s',
        }}
        autoFocus
      />
      {/* 右侧按钮 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {rightButtons}
      </div>
    </div>
  );
};

export default TopBar; 