import React from 'react';

interface BottomBarProps {
  theme: any;
  children?: React.ReactNode;
}

const BottomBar: React.FC<BottomBarProps> = ({ theme, children }) => {
  return (
    <div
      style={{
        width: '100%',
        height: 56,
        background: theme.bottom + '33', // 20% 透明度
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxSizing: 'border-box',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      }}
    >
      {children}
    </div>
  );
};

export default BottomBar; 