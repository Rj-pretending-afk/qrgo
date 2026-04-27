import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QROptions } from '../types/qr.types';

export function useQRCode(options: QROptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  if (qrCode.current === null) {
    qrCode.current = new QRCodeStyling({
      width: 280,
      height: 280,
      data: 'https://example.com',
      dotsOptions: { color: '#1d1d31', type: 'square' },
      backgroundOptions: { color: '#ffffff' },
      qrOptions: { errorCorrectionLevel: 'M' },
    });
  }

  useEffect(() => {
    if (containerRef.current) {
      qrCode.current!.append(containerRef.current);
    }
  }, []);

  useEffect(() => {
    qrCode.current!.update({
      data: options.data || 'https://example.com',
      dotsOptions: {
        color: options.foregroundColor,
        type: options.dotStyle,
      },
      backgroundOptions: { color: options.backgroundColor },
      cornersSquareOptions: { type: options.cornerStyle },
      image: options.logoUrl || undefined,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 4,
        imageSize: options.logoSize,
      },
      qrOptions: { errorCorrectionLevel: options.errorCorrectionLevel },
    });
  }, [
    options.data,
    options.foregroundColor,
    options.backgroundColor,
    options.errorCorrectionLevel,
    options.dotStyle,
    options.cornerStyle,
    options.logoUrl,
    options.logoSize,
  ]);

  const download = (extension: 'png' | 'svg') => {
    qrCode.current?.download({ name: 'qrgo', extension });
  };

  return { containerRef, download };
}
