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

function App() {
  const [options, setOptions] = useState<QROptions>(defaultOptions);

  const handleChange = (updates: Partial<QROptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-bold text-[#1A1A2E]"> QRGo</h1>
      </header>

      {/* 主体两列布局 */}
      <main style={{ display: 'flex', flexDirection: 'row', gap: '24px', padding: '24px', maxWidth: '1024px', margin: '0 auto' }}>
        {/* 左侧控制面板 */}
        <div className="w-2/5 bg-white rounded-xl shadow-sm p-5">
          <InputPanel options={options} onChange={handleChange} />
        </div>

        {/* 右侧预览区 */}
        <div className="w-3/5 bg-white rounded-xl shadow-sm p-5 flex items-center justify-center">
          <QRPreview options={options} />
        </div>
      </main>
    </div>
  );
}

export default App;
