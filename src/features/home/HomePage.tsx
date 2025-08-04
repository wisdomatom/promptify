import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { lightTheme, darkTheme } from '../../theme';

// 定义从后端接收的数据结构
interface AppInfo {
  name: string;
  path: string;
}

// 从内置命令中提取 CommandID 类型
export type CommandID = 'diff' | 'clipboard';

// 定义内置命令的数据结构
interface Command {
  id: CommandID;
  name: string;
  icon: string;
}

// 定义一个统一的列表项类型，方便管理
type UnifiedListItem = {
  id: string;
  type: 'command' | 'application';
  data: Command | AppInfo;
  node: React.ReactNode;
};

interface HomePageProps {
  theme: typeof lightTheme | typeof darkTheme;
  onNavigate: (page: CommandID) => void;
}

// 列表项通用组件
// 使用 forwardRef 以便父组件可以获取到 DOM 节点的引用，用于滚动
const ListItem = forwardRef<HTMLDivElement, { children: React.ReactNode, theme: HomePageProps['theme'], isSelected?: boolean }>(
  ({ children, theme, isSelected }, ref) => (
    <div
      ref={ref}
      style={{
        padding: '10px 16px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        background: isSelected ? theme.btnHover : 'transparent',
        borderRadius: 6,
        color: theme.text,
      }}
    >
      {children}
    </div>
  )
);
ListItem.displayName = 'ListItem'; // 为组件添加 display name，方便在 React DevTools 中调试

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

const HomePage: React.FC<HomePageProps> = ({ theme, onNavigate }) => {
  const [installedApps, setInstalledApps] = useState<AppInfo[]>([]);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // 使用 Ref 来存储每个列表项的 DOM 节点，以便后续滚动到视图内
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 定义静态的内置命令
  const builtInCommands: Command[] = useMemo(() => [
    { id: 'diff', name: 'Compare Text', icon: '↔️' },
    { id: 'clipboard', name: 'Clipboard History', icon: '📋' },
  ], []);

  // 使用 useMemo 将两个数据源合并为一个统一的列表，当数据源变化时自动重新计算
  const allItems = useMemo<UnifiedListItem[]>(() => {
    const commandItems: UnifiedListItem[] = builtInCommands.map((command) => ({
      id: `command-${command.id}`,
      type: 'command',
      data: command,
      node: (
        <>
          <span style={{ marginRight: 12, width: 16 }}>{command.icon}</span>
          <span>{command.name}</span>
        </>
      ),
    }));

    const applicationItems: UnifiedListItem[] = installedApps.map((app) => ({
      id: `app-${app.path}`,
      type: 'application',
      data: app,
      node: (
        <>
          <span style={{ marginRight: 12, width: 16 }}>🚀</span>
          <span>{app.name}</span>
        </>
      ),
    }));

    return [...commandItems, ...applicationItems];
  }, [installedApps, builtInCommands]);

  useEffect(() => {
    // 获取已安装应用
    invoke<AppInfo[]>('get_installed_apps')
      .then(setInstalledApps)
      .catch(err => {
        console.error('Failed to get installed apps:', err);
        setError('Could not load installed apps.');
      });
  }, []); // 空依赖数组，确保只在组件挂载时运行一次

  // 当数据加载完毕后，设置默认选中的第一项
  // 或者当列表变化（如未来增加过滤功能）导致当前选中项失效时，重新选择第一项
  useEffect(() => {
    // 检查当前 selection 是否在新的 allItems 列表中仍然有效
    const isSelectionValid = allItems.some(item => item.id === selectedItem);

    // 如果当前选择无效（例如，列表首次加载，或过滤后当前项消失），
    // 并且新列表不为空，则默认选中第一项。
    if (!isSelectionValid && allItems.length > 0) {
      setSelectedItem(allItems[0].id);
    }
  }, [allItems]); // 注意：此 effect 只应依赖 allItems

  // 处理键盘事件的核心 Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allItems.length === 0 || selectedItem === null) return;

      const currentIndex = allItems.findIndex(item => item.id === selectedItem);

      if (e.key === 'ArrowDown') {
        e.preventDefault(); // 防止页面默认滚动行为
        const nextIndex = Math.min(currentIndex + 1, allItems.length - 1);
        setSelectedItem(allItems[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); // 防止页面默认滚动行为
        const prevIndex = Math.max(currentIndex - 1, 0);
        setSelectedItem(allItems[prevIndex].id);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currentItem = allItems[currentIndex];
        if (!currentItem) return;

        if (currentItem.type === 'application') {
          // 如果是应用，调用后端命令打开它
          const appData = currentItem.data as AppInfo;
          invoke('open_app', { path: appData.path }).catch(console.error);
        } else if (currentItem.type === 'command') {
          const commandData = currentItem.data as Command;
          onNavigate(commandData.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, allItems, onNavigate]); // 依赖项改变时，重新创建事件处理器

  // 当选中项改变时，自动滚动到该项的位置
  useEffect(() => {
    if (selectedItem) {
      const node = itemRefs.current.get(selectedItem);
      node?.scrollIntoView({
        block: 'nearest', // 滚动到最近的边缘
        behavior: 'smooth', // 平滑滚动
      });
    }
  }, [selectedItem]);

  if (error) {
    return <div style={{ color: 'red', padding: 20 }}>Error: {error}</div>;
  }

  // 将统一列表按类型分组，以便渲染
  const suggestionItems = allItems.filter(item => item.type === 'command'); // These are the built-in commands
  const applicationItems = allItems.filter(item => item.type === 'application'); // These are the installed apps

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Suggestions Section */}
      {suggestionItems.length > 0 && (
        <>
          <ListHeader theme={theme}>Suggestions</ListHeader>
          {suggestionItems.map(item => (
            <ListItem
              key={item.id}
              ref={node => { // 动态设置 ref
                if (node) itemRefs.current.set(item.id, node);
                else itemRefs.current.delete(item.id);
              }}
              theme={theme}
              isSelected={selectedItem === item.id}
            >
              {item.node}
            </ListItem>
          ))}
        </>
      )}

      {/* Commands Section */}
      {applicationItems.length > 0 && (
        <>
          <ListHeader theme={theme}>Commands</ListHeader>
          {applicationItems.map(item => (
            <ListItem
              key={item.id}
              ref={node => {
                if (node) itemRefs.current.set(item.id, node);
                else itemRefs.current.delete(item.id);
              }}
              theme={theme}
              isSelected={selectedItem === item.id}
            >
              {item.node}
            </ListItem>
          ))}
        </>
      )}
    </div>
  );
};

export default HomePage;