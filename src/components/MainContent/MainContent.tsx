// /Users/ctw/Desktop/goproject/project/promptify/src/components/MainContent.tsx
import React, { CSSProperties } from 'react';

interface MainContentProps {
  children: React.ReactNode;
  theme: any;
  center?: boolean;
}

/**
 * MainContent 组件是主内容区域的容器。
 * 它可以通过 `center` prop 来决定是否要将其内容垂直和水平居中。
 * - 当 `center` 为 true (例如在主页) 时, 它会使用 flexbox 和 height: 100% 来居中内容。
 * - 当 `center` 为 false (例如在 DiffPage) 时, 它不应用任何特殊布局样式，
 *   允许其高度由内容（如很长的 diff 结果）决定，从而触发父容器的滚动条。
 */
const MainContent: React.FC<MainContentProps> = ({ children, theme, center }) => {
  const style: CSSProperties = {
    color: theme.text,
  };

  if (center) {
    style.display = 'flex';
    style.alignItems = 'center';
    style.justifyContent = 'center';
    style.height = '100%';
  }

  return (
    <main style={style}>{children}</main>
  );
};

export default MainContent;
