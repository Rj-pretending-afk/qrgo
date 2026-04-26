import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QROptions } from '../types/qr.types';

export function useQRCode(options: QROptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // 只初始化一次
  if (qrCode.current === null) {
    qrCode.current = new QRCodeStyling({
      width: 280,
      height: 280,
      data: 'https://example.com',
      dotsOptions: { color: '#1A1A2E', type: 'square' },
      backgroundOptions: { color: '#FFFFFF' },
      qrOptions: { errorCorrectionLevel: 'M' },
    });
  }

  // 挂载到 DOM
  useEffect(() => {
    if (containerRef.current) {
      qrCode.current!.append(containerRef.current);
    }
  }, []);

  // 选项变化时更新二维码
  useEffect(() => {
    qrCode.current!.update({
      data: options.data || 'https://example.com',
      dotsOptions: { color: options.foregroundColor, type: 'square' },
      backgroundOptions: { color: options.backgroundColor },
      qrOptions: { errorCorrectionLevel: options.errorCorrectionLevel },
    });
  }, [options.data, options.foregroundColor, options.backgroundColor, options.errorCorrectionLevel]);

  const download = (extension: 'png' | 'svg') => {
    qrCode.current?.download({ name: 'qrcraft', extension });
  };

  return { containerRef, download };
}
