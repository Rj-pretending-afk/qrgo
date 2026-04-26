import { useQRCode } from '../hooks/useQRCode';
import { QROptions } from '../types/qr.types';

interface Props {
  options: QROptions;
}

export function QRPreview({ options }: Props) {
  const { containerRef, download } = useQRCode(options);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div ref={containerRef} />
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => download('png')}
          className="px-5 py-2.5 bg-[#1A1A2E] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          下载 PNG
        </button>
        <button
          onClick={() => download('svg')}
          className="px-5 py-2.5 border border-[#1A1A2E] text-[#1A1A2E] rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          下载 SVG
        </button>
      </div>
    </div>
  );
}
