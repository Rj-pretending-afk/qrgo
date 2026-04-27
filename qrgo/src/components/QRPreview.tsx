import { useQRCode } from '../hooks/useQRCode';
import type { QROptions } from '../types/qr.types';

interface Props {
  options: QROptions;
  isDark: boolean;
}

export function QRPreview({ options, isDark }: Props) {
  const { containerRef, download } = useQRCode(options);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`rounded-2xl shadow-md p-5 border ${isDark ? 'bg-[#2A2A3E] border-gray-700' : 'bg-white border-gray-100'}`}>
        <div ref={containerRef} />
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => download('png')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 ${isDark ? 'bg-white text-[#1A1A2E]' : 'bg-[#1A1A2E] text-white'}`}
        >
          下载 PNG
        </button>
        <button
          onClick={() => download('svg')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border ${isDark ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-[#1A1A2E] text-[#1A1A2E] hover:bg-gray-50'}`}
        >
          下载 SVG
        </button>
      </div>
    </div>
  );
}
