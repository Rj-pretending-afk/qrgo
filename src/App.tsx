import { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { QRPreview } from './components/QRPreview';
import { LabelPanel } from './components/LabelPanel';
import type { QROptions, QRLabels, LabelPosition, LabelConfig } from './types/qr.types';
import './App.css';

const defaultOptions: QROptions = {
  data: '',
  foregroundColor: '#1d1d31',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'M',
  dotStyle: 'square',
  cornerStyle: 'square',
  logoUrl: '',
  logoSize: 0.3,
};

const defaultLabel: LabelConfig = {
  enabled: false,
  text: '',
  fontSize: 14,
  fontFamily: 'sans-serif',
  color: '#333333',
};

const defaultLabels: QRLabels = {
  top: { ...defaultLabel },
  bottom: { ...defaultLabel },
  left: { ...defaultLabel },
  right: { ...defaultLabel },
};

const lightTheme = {
  page: 'bg-[#F8F7F4]',
  header: 'bg-white',
  card: 'bg-white',
  titleText: 'text-[#1A1A2E]',
  toggleBtn: 'border-gray-200 text-gray-600 hover:bg-gray-50',
  sectionTitle: 'text-gray-400 border-gray-100',
};

const darkTheme = {
  page: 'bg-[#0F0F1A]',
  header: 'bg-[#1A1A2E]',
  card: 'bg-[#1E1E2E]',
  titleText: 'text-white',
  toggleBtn: 'border-gray-600 text-gray-300 hover:bg-gray-700',
  sectionTitle: 'text-gray-500 border-gray-700',
};

function App() {
  const [options, setOptions] = useState<QROptions>(defaultOptions);
  const [labels, setLabels] = useState<QRLabels>(defaultLabels);
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? darkTheme : lightTheme;

  const handleChange = (updates: Partial<QROptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  };

  const handleLabelChange = (pos: LabelPosition, updates: Partial<LabelConfig>) => {
    setLabels((prev) => ({ ...prev, [pos]: { ...prev[pos], ...updates } }));
  };

  return (
    <div className={`min-h-screen transition-colors ${theme.page}`}>
      <header className={`${theme.header} shadow-sm px-6 py-4 flex items-center justify-between`}>
        <h1 className={`text-xl font-bold ${theme.titleText}`}>QRGo - by Rj</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${theme.toggleBtn}`}
        >
          {isDark ? '☀️ 浅色' : '🌙 深色'}
        </button>
      </header>

      <main style={{ display: 'flex', flexDirection: 'row', gap: '24px', padding: '24px', maxWidth: '1080px', margin: '0 auto' }}>
        {/* 左侧控制面板（可滚动） */}
        <div
          className={`rounded-xl shadow-sm p-5 ${theme.card}`}
          style={{ width: '380px', flexShrink: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 88px)' }}
        >
          <InputPanel options={options} onChange={handleChange} isDark={isDark} />

          {/* 分隔线 */}
          <div className={`my-5 border-t ${theme.sectionTitle}`} />

          {/* 文字标签区 */}
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme.sectionTitle}`}>
            文字标签
          </p>
          <LabelPanel labels={labels} onChange={handleLabelChange} isDark={isDark} />
        </div>

        {/* 右侧预览区 */}
        <div className={`flex-1 rounded-xl shadow-sm p-5 flex items-center justify-center ${theme.card}`}
          style={{ minHeight: '400px' }}>
          <QRPreview options={options} labels={labels} isDark={isDark} />
        </div>
      </main>
    </div>
  );
}

export default App;
