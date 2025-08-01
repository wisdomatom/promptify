// /Users/ctw/Desktop/goproject/project/promptify/src/components/MainContent.tsx
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  theme: any;
}

/**
 * MainContent 组件是一个纯粹的内容容器。
 * 它允许其高度由内容决定，从而让父容器的滚动条能够正确触发。
 */
const MainContent: React.FC<MainContentProps> = ({ children, theme }) => {
  return (
    <main style={{ color: theme.text }}>{children}</main>
  );
};

export default MainContent;
