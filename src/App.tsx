import { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { QRPreview } from './components/QRPreview';
import { LabelPanel } from './components/LabelPanel';
import type { QROptions, QRLabels, LabelPosition, LabelConfig, Language, AppMode } from './types/qr.types';
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
  framePadding: 20,
  frameRadius: 20,
  labelsInFrame: false,
};

const defaultLabel: LabelConfig = {
  enabled: false,
  text: '',
  fontSize: 35,
  fontFamily: "'Inter', 'Microsoft YaHei UI', 'PingFang SC', system-ui, sans-serif",
  color: '#333333',
  bold: false,
  italic: false,
  shadow: true,
};

const defaultLabels: QRLabels = {
  top: { ...defaultLabel },
  bottom: { ...defaultLabel },
  left: { ...defaultLabel },
  right: { ...defaultLabel },
};

const lightTheme = {
  page: 'bg-[#E8E8E8]',
  header: 'bg-[#F0F0F0]',
  card: 'bg-[#F5F5F5]',
  titleText: 'text-[#1A1A2E]',
  toggleBtn: 'border-gray-300 text-gray-600 hover:bg-gray-200',
  sectionTitle: 'text-gray-500 border-gray-200',
};

const darkTheme = {
  page: 'bg-[#0F0F1A]',
  header: 'bg-[#1A1A2E]',
  card: 'bg-[#1E1E2E]',
  titleText: 'text-white',
  toggleBtn: 'border-gray-600 text-gray-300 hover:bg-gray-700',
  sectionTitle: 'text-gray-400 border-gray-700',
};

function App() {
  const [options, setOptions] = useState<QROptions>(defaultOptions);
  const [labels, setLabels] = useState<QRLabels>(defaultLabels);
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState<Language>('zh');
  const [mode, setMode] = useState<AppMode>('simple');
  const [qrDisplaySize, setQrDisplaySize] = useState(280);

  const theme = isDark ? darkTheme : lightTheme;
  const isEnglish = language === 'en';
  const isSimple = mode === 'simple';
  const displayOptions: QROptions = isSimple
    ? {
        ...options,
        errorCorrectionLevel: 'H',
        framePadding: 28,
        frameRadius: 36,
        labelsInFrame: false,
      }
    : options;
  const displayLabels = isSimple ? defaultLabels : labels;

  const handleChange = (updates: Partial<QROptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  };

  const handleLabelChange = (pos: LabelPosition, updates: Partial<LabelConfig>) => {
    setLabels((prev) => ({ ...prev, [pos]: { ...prev[pos], ...updates } }));
  };

  return (
    <div className={`min-h-screen transition-colors ${theme.page}`}>
      <header className={`${theme.header} shadow-sm px-6 py-4 relative flex items-center justify-between`}>
        <h1 className={`text-xl font-bold ${theme.titleText}`}>QRGo - by Rj</h1>
        <button
          onClick={() => setMode(isSimple ? 'custom' : 'simple')}
          className={`absolute left-1/2 -translate-x-1/2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${theme.toggleBtn}`}
        >
          {isSimple
            ? (isEnglish ? 'Custom Mode' : '自定义模式')
            : (isEnglish ? 'Simple Mode' : '简单模式')}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(isEnglish ? 'zh' : 'en')}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${theme.toggleBtn}`}
          >
            {isEnglish ? '🇨🇳 中文' : '🇺🇸 English'}
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${theme.toggleBtn}`}
          >
            {isDark ? (isEnglish ? '☀️ Light' : '☀️ 浅色') : (isEnglish ? '🌙 Dark' : '🌙 深色')}
          </button>
        </div>
      </header>

      <main className="flex flex-row gap-6 p-6 max-w-[1080px] mx-auto">
        {/* 左侧控制面板（可滚动） */}
        <div
          className={`rounded-xl shadow-sm p-5 ${theme.card}`}
          style={{ width: '380px', flexShrink: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 88px)' }}
        >
          <InputPanel options={displayOptions} onChange={handleChange} isDark={isDark} language={language} mode={mode} />

          {!isSimple && (
            <>
              {/* 分隔线 */}
              <div className={`my-5 border-t ${theme.sectionTitle}`} />

              {/* 文字标签区 */}
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme.sectionTitle}`}>
                {isEnglish ? 'Text Labels' : '文字标签'}
              </p>
              <LabelPanel labels={labels} onChange={handleLabelChange} isDark={isDark} language={language} />
            </>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className={`flex-1 rounded-xl shadow-sm p-5 flex items-center justify-center ${theme.card}`}
          style={{ minHeight: '400px' }}>
          <QRPreview
            options={displayOptions}
            labels={displayLabels}
            isDark={isDark}
            language={language}
            qrDisplaySize={qrDisplaySize}
            onQrDisplaySizeChange={setQrDisplaySize}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
