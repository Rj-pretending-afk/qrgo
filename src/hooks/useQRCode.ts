import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QROptions } from '../types/qr.types';

const MAX_DATA_LENGTH = 2500;
// Render at 2x for crisp display on retina screens; CSS scales it to 280px
const QR_PIXEL_SIZE = 560;

export function useQRCode(options: QROptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (qrCode.current === null) {
    qrCode.current = new QRCodeStyling({
      width: QR_PIXEL_SIZE,
      height: QR_PIXEL_SIZE,
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
    if (!options.data.trim()) {
      setError(null);
      return;
    }

    if (options.data.length > MAX_DATA_LENGTH) {
      setError(`内容过长（${options.data.length} 字符），二维码最多支持约 ${MAX_DATA_LENGTH} 字符`);
      return;
    }

    setError(null);
    setIsGenerating(true);

    qrCode.current!.update({
      data: options.data,
      dotsOptions: { color: options.foregroundColor, type: options.dotStyle },
      backgroundOptions: { color: options.backgroundColor },
      cornersSquareOptions: { type: options.cornerStyle },
      image: options.logoUrl || undefined,
      imageOptions: { margin: 4, imageSize: options.logoSize },
      qrOptions: { errorCorrectionLevel: options.errorCorrectionLevel },
    });

    const timer = setTimeout(() => setIsGenerating(false), 400);
    return () => clearTimeout(timer);
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

  const getCanvas = () => containerRef.current?.querySelector('canvas') ?? null;

  return { containerRef, download, getCanvas, isGenerating, error };
}
