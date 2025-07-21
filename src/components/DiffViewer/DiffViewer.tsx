import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

interface DiffViewerProps {
  oldValue: string;
  newValue: string;
  splitView?: boolean;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ oldValue, newValue, splitView = true }) => {
  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      splitView={splitView}
      compareMethod={DiffMethod.WORDS}
      showDiffOnly={false}
      leftTitle="原文本"
      rightTitle="新文本"
      styles={{
        variables: {
          light: {
            diffViewerBackground: '#fff',
          },
          dark: {
            diffViewerBackground: '#222',
          },
        },
      }}
    />
  );
};

export default DiffViewer; 