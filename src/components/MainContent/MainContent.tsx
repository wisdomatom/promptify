import React from 'react';

interface MainContentProps {
  children?: React.ReactNode;
  theme: any;
}

const MainContent: React.FC<MainContentProps> = ({ children, theme }) => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        background: theme.main + '33', // 20% 透明度
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 200,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* 顶部分割线 */}
      <div style={{ width: '100%', height: 1, background: theme.border }} />
      {children}
    </div>
  );
};

export default MainContent; 