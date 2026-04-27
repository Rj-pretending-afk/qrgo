import { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { QRPreview } from './components/QRPreview';
import type { QROptions } from './types/qr.types';
import './App.css';

const defaultOptions: QROptions = {
  data: '',
  foregroundColor: '#1d1d31',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'M',
};

export interface Theme {
  page: string;
  header: string;
  card: string;
  titleText: string;
  toggleBtn: string;
}

const lightTheme: Theme = {
  page: 'bg-[#F8F7F4]',
  header: 'bg-white',
  card: 'bg-white',
  titleText: 'text-[#1A1A2E]',
  toggleBtn: 'border-gray-200 text-gray-600 hover:bg-gray-50',
};

const darkTheme: Theme = {
  page: 'bg-[#0F0F1A]',
  header: 'bg-[#1A1A2E]',
  card: 'bg-[#1E1E2E]',
  titleText: 'text-white',
  toggleBtn: 'border-gray-600 text-gray-300 hover:bg-gray-700',
};

function App() {
  const [options, setOptions] = useState<QROptions>(defaultOptions);
  const [isDark, setIsDark] = useState(false);

  const theme = isDark ? darkTheme : lightTheme;

  const handleChange = (updates: Partial<QROptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className={`min-h-screen transition-colors ${theme.page}`}>
      <header className={`${theme.header} shadow-sm px-6 py-4 flex items-center justify-between`}>
        <h1 className={`text-xl font-bold ${theme.titleText}`}>🔲 QRGo</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${theme.toggleBtn}`}
        >
          {isDark ? '☀️ 浅色' : '🌙 深色'}
        </button>
      </header>

      <main style={{ display: 'flex', flexDirection: 'row', gap: '24px', padding: '24px', maxWidth: '1024px', margin: '0 auto' }}>
        <div className={`w-2/5 rounded-xl shadow-sm p-5 ${theme.card}`}>
          <InputPanel options={options} onChange={handleChange} isDark={isDark} />
        </div>
        <div className={`w-3/5 rounded-xl shadow-sm p-5 flex items-center justify-center ${theme.card}`}>
          <QRPreview options={options} isDark={isDark} />
        </div>
      </main>
    </div>
  );
}

export default App;
