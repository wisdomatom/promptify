import React, { useState } from 'react';
import DiffViewer from '../../components/DiffViewer';
import { useTranslation } from 'react-i18next';

interface DiffPageProps {
  onBack?: () => void;
}

const DiffPage: React.FC<DiffPageProps> = ({ onBack }) => {
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { t } = useTranslation();

  const handleCompare = () => {
    setShowDiff(true);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        {onBack && (
          <button onClick={onBack} style={{ marginRight: 16 }}>{t('diff_back')}</button>
        )}
        <h2 style={{ margin: 0 }}>{t('diff_title')}</h2>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <textarea
          style={{ flex: 1, minHeight: 120 }}
          placeholder={t('diff_old')}
          value={oldValue}
          onChange={e => setOldValue(e.target.value)}
        />
        <textarea
          style={{ flex: 1, minHeight: 120 }}
          placeholder={t('diff_new')}
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
        />
      </div>
      <button onClick={handleCompare} style={{ marginBottom: 24 }}>{t('diff_btn')}</button>
      {showDiff && (
        // 添加一个包裹容器来处理水平滚动
        <div style={{ overflowX: 'auto' }}>
          <DiffViewer oldValue={oldValue} newValue={newValue} />
        </div>
      )}
    </div>
  );
};

export default DiffPage; 