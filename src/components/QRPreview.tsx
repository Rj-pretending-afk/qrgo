import { useState } from 'react';
import { useQRCode } from '../hooks/useQRCode';
import type { QROptions, QRLabels, LabelConfig, Language } from '../types/qr.types';

interface Props {
  options: QROptions;
  labels: QRLabels;
  isDark: boolean;
  language: Language;
  qrDisplaySize: number;
  onQrDisplaySizeChange: (size: number) => void;
}

const DISPLAY_SIZE = 280; // fixed canvas reference size (matches QR_PIXEL_SIZE / 2)
const SIZE_STEP    = 40;
const SIZE_MIN     = 160;
const SIZE_MAX     = 520;

function LabelEl({
  cfg,
  vertical  = false,
  isEmpty   = false,
  isDark    = false,
  maxWidth  = DISPLAY_SIZE,
}: {
  cfg: LabelConfig;
  vertical?: boolean;
  isEmpty?: boolean;
  isDark?: boolean;
  maxWidth?: number;
}) {
  const style: React.CSSProperties = {
    fontFamily:  cfg.fontFamily,
    fontSize:    cfg.fontSize,
    fontWeight:  cfg.bold   ? 'bold'   : 'normal',
    fontStyle:   cfg.italic ? 'italic' : 'normal',
    color:       cfg.color,
    textShadow:  (cfg.shadow ?? true) ? '0 1px 4px rgba(0,0,0,0.28)' : 'none',
    ...(isEmpty && {
      backgroundColor: isDark ? 'rgba(0,0,0,0.50)' : 'rgba(180,180,180,0.50)',
      padding: '3px 10px',
      borderRadius: 6,
    }),
    ...(vertical
      ? { writingMode: 'vertical-lr' as const, textOrientation: 'mixed' as const, whiteSpace: 'pre-wrap' as const }
      : { textAlign: 'center' as const, whiteSpace: 'pre-line' as const, maxWidth: `${maxWidth}px` }),
  };
  return <div style={style}>{cfg.text}</div>;
}

export function QRPreview({ options, labels, isDark, language, qrDisplaySize, onQrDisplaySizeChange }: Props) {
  const { containerRef, download, getCanvas, isGenerating, error } = useQRCode(options, language);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const isEnglish = language === 'en';

  const isEmpty = !options.data.trim();
  const show    = (cfg: LabelConfig) => cfg.enabled && !!cfg.text.trim();
  const inFrame = options.labelsInFrame;

  // ── Canvas composition ────────────────────────────────────────────────────
  const composeCanvas = (): HTMLCanvasElement | null => {
    const qrCanvas = getCanvas();
    if (!qrCanvas) return null;

    const qrSize   = qrCanvas.width;            // 560 (2x pixel canvas)
    const scale    = qrSize / DISPLAY_SIZE;     // 2 — always based on fixed reference
    const gap      = 8 * scale;
    const lineH    = 1.4;
    const framePad = options.framePadding * scale;
    const frameRad = options.frameRadius  * scale;

    const topVis   = show(labels.top);
    const botVis   = show(labels.bottom);
    const leftVis  = show(labels.left);
    const rightVis = show(labels.right);
    const anyLabels = topVis || botVis || leftVis || rightVis;

    const vH = (cfg: LabelConfig, vis: boolean) =>
      vis ? cfg.fontSize * scale * cfg.text.split('\n').length * lineH + gap : 0;
    const vW = (cfg: LabelConfig, vis: boolean) =>
      vis ? cfg.fontSize * scale * lineH + gap : 0;

    const topH   = vH(labels.top,    topVis);
    const botH   = vH(labels.bottom, botVis);
    const leftW  = vW(labels.left,   leftVis);
    const rightW = vW(labels.right,  rightVis);

    if (framePad === 0 && frameRad === 0 && !anyLabels) return qrCanvas;

    const clip = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
      ctx.closePath();
      ctx.clip();
    };

    // Opaque outer background so rounded corners are visible on any paste target
    const hex = options.backgroundColor.replace('#', '');
    const lum = parseInt(hex.slice(0, 2), 16) * 0.299
              + parseInt(hex.slice(2, 4), 16) * 0.587
              + parseInt(hex.slice(4, 6), 16) * 0.114;
    const outerBg = lum > 128 ? '#d0d0d0' : '#ffffff';

    const applyTextStyle = (ctx: CanvasRenderingContext2D, cfg: LabelConfig) => {
      const bold   = cfg.bold   ? 'bold '   : '';
      const italic = cfg.italic ? 'italic ' : '';
      ctx.font      = `${italic}${bold}${cfg.fontSize * scale}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      if (cfg.shadow ?? true) {
        ctx.shadowColor   = 'rgba(0,0,0,0.28)';
        ctx.shadowBlur    = 4 * scale;
        ctx.shadowOffsetY = 1 * scale;
      } else {
        ctx.shadowColor   = 'transparent';
        ctx.shadowBlur    = 0;
        ctx.shadowOffsetY = 0;
      }
    };

    const drawH = (ctx: CanvasRenderingContext2D, cfg: LabelConfig, cx: number, cy: number) => {
      ctx.save();
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      applyTextStyle(ctx, cfg);
      cfg.text.split('\n').forEach((line, i) =>
        ctx.fillText(line, cx, cy + i * cfg.fontSize * scale * lineH));
      ctx.restore();
    };

    const drawV = (ctx: CanvasRenderingContext2D, cfg: LabelConfig, cx: number, cy: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 2);
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      applyTextStyle(ctx, cfg);
      ctx.fillText(cfg.text.replace(/\n/g, '  '), 0, 0);
      ctx.restore();
    };

    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d')!;

    if (inFrame && anyLabels) {
      const cw = framePad + leftW + qrSize + rightW + framePad;
      const ch = framePad + topH  + qrSize + botH  + framePad;
      canvas.width = cw; canvas.height = ch;
      ctx.fillStyle = outerBg; ctx.fillRect(0, 0, cw, ch);
      ctx.save();
      clip(ctx, 0, 0, cw, ch, frameRad);
      ctx.fillStyle = options.backgroundColor; ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(qrCanvas, framePad + leftW, framePad + topH);
      if (topVis)   drawH(ctx, labels.top,    cw / 2,                                 framePad);
      if (botVis)   drawH(ctx, labels.bottom, cw / 2,                                 framePad + topH + qrSize + gap / 2);
      if (leftVis)  drawV(ctx, labels.left,   framePad + leftW / 2,                   framePad + topH + qrSize / 2);
      if (rightVis) drawV(ctx, labels.right,  framePad + leftW + qrSize + rightW / 2, framePad + topH + qrSize / 2);
      ctx.restore();
    } else {
      const qrFrameW = framePad * 2 + qrSize;
      const qrFrameH = framePad * 2 + qrSize;
      const cw = leftW + qrFrameW + rightW;
      const ch = topH  + qrFrameH + botH;
      canvas.width = cw; canvas.height = ch;
      ctx.fillStyle = outerBg; ctx.fillRect(0, 0, cw, ch);
      ctx.save();
      clip(ctx, leftW, topH, qrFrameW, qrFrameH, frameRad);
      ctx.fillStyle = options.backgroundColor; ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(qrCanvas, leftW + framePad, topH + framePad);
      ctx.restore();
      if (topVis)   drawH(ctx, labels.top,    cw / 2,                        0);
      if (botVis)   drawH(ctx, labels.bottom, cw / 2,                        topH + qrFrameH + gap / 2);
      if (leftVis)  drawV(ctx, labels.left,   leftW / 2,                     ch / 2);
      if (rightVis) drawV(ctx, labels.right,  leftW + qrFrameW + rightW / 2, ch / 2);
    }
    return canvas;
  };

  const handleDownload = () => {
    const canvas = composeCanvas();
    if (!canvas) { download('png'); return; }
    const link = document.createElement('a');
    link.download = 'qrgo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    const canvas = composeCanvas();
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) { setCopyState('failed'); return; }
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopyState('copied');
        setTimeout(() => setCopyState('idle'), 2000);
      } catch {
        setCopyState('failed');
        setTimeout(() => setCopyState('idle'), 2000);
      }
    }, 'image/png');
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    position: 'relative',
    padding: options.framePadding,
    borderRadius: options.frameRadius,
    backgroundColor: options.backgroundColor,
    border: '1px solid rgba(0,0,0,0.10)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    transition: 'padding 0.25s ease, border-radius 0.25s ease',
  };

  const Overlay = ({ children }: { children: React.ReactNode }) => (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5"
      style={{ borderRadius: options.frameRadius, backgroundColor: options.backgroundColor, opacity: 0.96 }}
    >
      {children}
    </div>
  );

  const labelProps = { isEmpty, isDark, maxWidth: qrDisplaySize };

  const copyLabel = copyState === 'copied'
    ? (isEnglish ? 'Copied' : '已复制')
    : copyState === 'failed'
      ? (isEnglish ? 'Copy Failed' : '复制失败')
      : (isEnglish ? 'Copy' : '复制');

  let copyBtnCls: string;
  if (copyState === 'copied')      copyBtnCls = isDark ? 'border-green-500 text-green-400' : 'border-green-500 text-green-600';
  else if (copyState === 'failed') copyBtnCls = isDark ? 'border-red-500 text-red-400'    : 'border-red-400 text-red-500';
  else                             copyBtnCls = isDark ? 'border-gray-500 text-gray-200 hover:bg-white/10' : 'border-gray-400 text-gray-700 hover:bg-gray-100';

  const zoomBtnCls = `w-8 h-8 rounded-lg text-base font-bold border transition-colors disabled:opacity-30 ${
    isDark ? 'border-gray-600 text-gray-300 hover:bg-white/10' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
  }`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        {!inFrame && show(labels.top) && <LabelEl cfg={labels.top} {...labelProps} />}

        <div className="flex items-center gap-2">
          {!inFrame && show(labels.left) && <LabelEl cfg={labels.left} vertical {...labelProps} />}

          <div style={cardStyle}>
            {isGenerating && (
              <Overlay>
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin opacity-80" />
              </Overlay>
            )}
            {isEmpty && (
              <Overlay>
                <p className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#6b7280', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  {isEnglish ? 'Enter content on the left' : '在左侧输入内容'}
                </p>
                <p className="text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                  {isEnglish ? 'to generate a QR code' : '即可生成二维码'}
                </p>
              </Overlay>
            )}

            {/*
              containerRef div is always at this exact tree position so React never
              unmounts/remounts it when labelsInFrame toggles — prevents the QR canvas
              from being detached by qr-code-styling.
            */}
            <div className="flex flex-col items-center gap-1">
              {inFrame && show(labels.top) && <LabelEl cfg={labels.top} {...labelProps} />}
              <div className="flex items-center gap-2">
                {inFrame && show(labels.left) && <LabelEl cfg={labels.left} vertical {...labelProps} />}
                {/* CSS var controls the canvas display size without breaking internal pixel resolution */}
                <div
                  ref={containerRef}
                  className="qr-canvas-wrap"
                  style={{ '--qr-display-size': `${qrDisplaySize}px` } as React.CSSProperties}
                />
                {inFrame && show(labels.right) && <LabelEl cfg={labels.right} vertical {...labelProps} />}
              </div>
              {inFrame && show(labels.bottom) && <LabelEl cfg={labels.bottom} {...labelProps} />}
            </div>
          </div>

          {!inFrame && show(labels.right) && <LabelEl cfg={labels.right} vertical {...labelProps} />}
        </div>

        {!inFrame && show(labels.bottom) && <LabelEl cfg={labels.bottom} {...labelProps} />}
      </div>

      {error && (
        <div className={`w-full max-w-xs text-xs px-3 py-2 rounded-lg border ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {error}
        </div>
      )}

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQrDisplaySizeChange(Math.max(SIZE_MIN, qrDisplaySize - SIZE_STEP))}
          disabled={qrDisplaySize <= SIZE_MIN}
          className={zoomBtnCls}
        >−</button>
        <span className={`text-xs font-mono w-16 text-center select-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {qrDisplaySize}px
        </span>
        <button
          onClick={() => onQrDisplaySizeChange(Math.min(SIZE_MAX, qrDisplaySize + SIZE_STEP))}
          disabled={qrDisplaySize >= SIZE_MAX}
          className={zoomBtnCls}
        >+</button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleDownload}
          disabled={isEmpty || !!error}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-40 hover:opacity-85 ${isDark ? 'bg-white text-[#1A1A2E]' : 'bg-[#1A1A2E] text-white'}`}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        >
          {isEnglish ? 'Download PNG' : '下载 PNG'}
        </button>
        <button
          onClick={() => download('svg')}
          disabled={isEmpty || !!error}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border disabled:opacity-40 ${isDark ? 'border-gray-500 text-gray-200 hover:bg-white/10' : 'border-gray-400 text-gray-700 hover:bg-gray-100'}`}
        >
          {isEnglish ? 'Download SVG' : '下载 SVG'}
        </button>
        <button
          onClick={handleCopy}
          disabled={isEmpty || !!error || isGenerating}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border disabled:opacity-40 ${copyBtnCls}`}
        >
          {copyLabel}
        </button>
      </div>
    </div>
  );
}
