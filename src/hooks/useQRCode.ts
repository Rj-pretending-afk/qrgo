import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QROptions } from '../types/qr.types';

const QR_PIXEL_SIZE = 560;

// qrcode-generator (used internally by qr-code-styling) only stores the low 8 bits
// of each character's codepoint in Byte mode. For non-ASCII data (Chinese, etc.)
// this drops the high byte and produces garbage when scanned.
// Fix: manually convert the string to UTF-8 bytes represented as Latin-1 characters.
// Each resulting "character" has charCode ≤ 255, so the library stores the correct byte.
// Scanners that decode Byte mode as UTF-8 (all modern ones) will then show correct text.
const toQRSafeData = (str: string): string => {
  if (!/[^\x00-\x7F]/.test(str)) return str; // pure ASCII — no conversion needed
  const bytes = new TextEncoder().encode(str);
  return Array.from(bytes, b => String.fromCharCode(b)).join('');
};

// Byte length limit: QR version 40 at M level holds 2331 bytes.
// Chinese chars = 3 bytes each; use a safe margin.
const MAX_BYTES = 1800;

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

    const byteLen = new TextEncoder().encode(options.data).length;
    if (byteLen > MAX_BYTES) {
      setError(`内容过长（${byteLen} 字节），请减少内容`);
      return;
    }

    setError(null);
    setIsGenerating(true);

    qrCode.current!.update({
      data: toQRSafeData(options.data),
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

  // Use last canvas in container — robust against any library-internal canvas recreation
  const getCanvas = (): HTMLCanvasElement | null => {
    const all = containerRef.current?.querySelectorAll('canvas');
    return all && all.length > 0 ? (all[all.length - 1] as HTMLCanvasElement) : null;
  };

  return { containerRef, download, getCanvas, isGenerating, error };
}
