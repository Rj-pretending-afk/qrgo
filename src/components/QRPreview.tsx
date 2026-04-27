import { useState } from 'react';
import { useQRCode } from '../hooks/useQRCode';
import type { QROptions, QRLabels, LabelConfig } from '../types/qr.types';

interface Props {
  options: QROptions;
  labels: QRLabels;
  isDark: boolean;
}

const DISPLAY_SIZE = 280;

// Label renderer — adds semi-transparent bg pill when QR not yet generated
function LabelEl({
  cfg,
  vertical = false,
  isEmpty = false,
  isDark = false,
}: {
  cfg: LabelConfig;
  vertical?: boolean;
  isEmpty?: boolean;
  isDark?: boolean;
}) {
  const style: React.CSSProperties = {
    fontFamily: cfg.fontFamily,
    fontSize: cfg.fontSize,
    color: cfg.color,
    textShadow: '0 1px 4px rgba(0,0,0,0.28)',
    ...(isEmpty && {
      backgroundColor: isDark ? 'rgba(0,0,0,0.50)' : 'rgba(180,180,180,0.50)',
      padding: '3px 10px',
      borderRadius: 6,
    }),
    ...(vertical
      ? { writingMode: 'vertical-lr' as const, textOrientation: 'mixed' as const, whiteSpace: 'pre-wrap' as const }
      : { textAlign: 'center' as const, whiteSpace: 'pre-line' as const, maxWidth: `${DISPLAY_SIZE}px` }),
  };
  return <div style={style}>{cfg.text}</div>;
}

export function QRPreview({ options, labels, isDark }: Props) {
  const { containerRef, download, getCanvas, isGenerating, error } = useQRCode(options);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const isEmpty   = !options.data.trim();
  const show      = (cfg: LabelConfig) => cfg.enabled && !!cfg.text.trim();
  const inFrame   = options.labelsInFrame;

  // ── Canvas composition for PNG download / clipboard ──────────────────────
  const composeCanvas = (): HTMLCanvasElement | null => {
    const qrCanvas = getCanvas();
    if (!qrCanvas) return null;

    const qrSize   = qrCanvas.width;           // 560 (2x)
    const scale    = qrSize / DISPLAY_SIZE;    // 2
    const gap      = 8 * scale;
    const lineH    = 1.4;
    const framePad = options.framePadding * scale;
    const frameRad = options.frameRadius  * scale;

    const vH = (cfg: LabelConfig) =>
      !show(cfg) ? 0 : cfg.fontSize * scale * cfg.text.split('\n').length * lineH + gap;
    const vW = (cfg: LabelConfig) =>
      !show(cfg) ? 0 : cfg.fontSize * scale * lineH + gap;

    const topH   = vH(labels.top);
    const botH   = vH(labels.bottom);
    const leftW  = vW(labels.left);
    const rightW = vW(labels.right);
    const anyLabels = topH > 0 || botH > 0 || leftW > 0 || rightW > 0;

    if (framePad === 0 && frameRad === 0 && !anyLabels) return qrCanvas;

    const roundedPath = (
      ctx: CanvasRenderingContext2D,
      x: number, y: number, w: number, h: number, r: number,
    ) => {
      const cr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + cr, y);
      ctx.lineTo(x + w - cr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
      ctx.lineTo(x + w, y + h - cr);
      ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);
      ctx.lineTo(x + cr, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
      ctx.lineTo(x, y + cr);
      ctx.quadraticCurveTo(x, y, x + cr, y);
      ctx.closePath();
    };

    const drawH = (ctx: CanvasRenderingContext2D, cfg: LabelConfig, cx: number, cy: number) => {
      if (!show(cfg)) return;
      ctx.save();
      ctx.font = `${cfg.fontSize * scale}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur  = 4 * scale;
      ctx.shadowOffsetY = 1 * scale;
      cfg.text.split('\n').forEach((line, i) =>
        ctx.fillText(line, cx, cy + i * cfg.fontSize * scale * lineH));
      ctx.restore();
    };

    const drawV = (ctx: CanvasRenderingContext2D, cfg: LabelConfig, cx: number, cy: number) => {
      if (!show(cfg)) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 2);
      ctx.font = `${cfg.fontSize * scale}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur  = 4 * scale;
      ctx.shadowOffsetY = 1 * scale;
      ctx.fillText(cfg.text.replace(/\n/g, '  '), 0, 0);
      ctx.restore();
    };

    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d')!;

    if (inFrame && anyLabels) {
      // Labels INSIDE frame → rounded-rect canvas (transparent corners)
      const cw = framePad + leftW + qrSize + rightW + framePad;
      const ch = framePad + topH  + qrSize + botH  + framePad;
      canvas.width  = cw;
      canvas.height = ch;
      ctx.save();
      roundedPath(ctx, 0, 0, cw, ch, frameRad);
      ctx.clip();
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(qrCanvas, framePad + leftW, framePad + topH);
      drawH(ctx, labels.top,    cw / 2,                                framePad);
      drawH(ctx, labels.bottom, cw / 2,                                framePad + topH + qrSize + gap / 2);
      drawV(ctx, labels.left,   framePad + leftW / 2,                  framePad + topH + qrSize / 2);
      drawV(ctx, labels.right,  framePad + leftW + qrSize + rightW / 2, framePad + topH + qrSize / 2);
      ctx.restore();
    } else {
      // Labels OUTSIDE frame (or no labels):
      // QR frame gets rounded clip → transparent corners; labels drawn on transparent outer area
      const qrFrameW = framePad * 2 + qrSize;
      const qrFrameH = framePad * 2 + qrSize;
      const cw = leftW + qrFrameW + rightW;
      const ch = topH  + qrFrameH + botH;
      canvas.width  = cw;
      canvas.height = ch;

      // Clip QR frame area to rounded rect, fill + draw QR inside it
      ctx.save();
      roundedPath(ctx, leftW, topH, qrFrameW, qrFrameH, frameRad);
      ctx.clip();
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, cw, ch); // fillRect is clipped to rounded path
      ctx.drawImage(qrCanvas, leftW + framePad, topH + framePad);
      ctx.restore();

      // Labels float on the transparent outer area
      if (anyLabels) {
        drawH(ctx, labels.top,    cw / 2,                           0);
        drawH(ctx, labels.bottom, cw / 2,                           topH + qrFrameH + gap / 2);
        drawV(ctx, labels.left,   leftW / 2,                        ch / 2);
        drawV(ctx, labels.right,  leftW + qrFrameW + rightW / 2,    ch / 2);
      }
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

  // ── Card style (mirrors download frame) ──────────────────────────────────
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

  // Semi-transparent overlay helper (loading spinner / empty state)
  const Overlay = ({ children }: { children: React.ReactNode }) => (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5"
      style={{ borderRadius: options.frameRadius, backgroundColor: options.backgroundColor, opacity: 0.96 }}
    >
      {children}
    </div>
  );

  const labelProps = { isEmpty, isDark };
  const copyLabel  = copyState === 'copied' ? '已复制' : copyState === 'failed' ? '复制失败' : '复制';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">

        {/* Outside-frame top label */}
        {!inFrame && show(labels.top) && <LabelEl cfg={labels.top} {...labelProps} />}

        <div className="flex items-center gap-2">
          {/* Outside-frame left label */}
          {!inFrame && show(labels.left) && <LabelEl cfg={labels.left} vertical {...labelProps} />}

          {/* ── THE CARD ── containerRef div is always at the same tree position ── */}
          <div style={cardStyle}>
            {isGenerating && (
              <Overlay>
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin opacity-80" />
              </Overlay>
            )}
            {isEmpty && (
              <Overlay>
                <p className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#6b7280', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  在左侧输入内容
                </p>
                <p className="text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                  即可生成二维码
                </p>
              </Overlay>
            )}

            {/*
              Inner layout is FIXED — containerRef div never moves in the React tree.
              Labels inside the frame appear/disappear around it conditionally.
            */}
            <div className="flex flex-col items-center gap-1">
              {inFrame && show(labels.top) && <LabelEl cfg={labels.top} {...labelProps} />}

              <div className="flex items-center gap-2">
                {inFrame && show(labels.left) && <LabelEl cfg={labels.left} vertical {...labelProps} />}

                {/* ← This div is ALWAYS here, never conditionally rendered or moved */}
                <div ref={containerRef} className="qr-canvas-wrap" />

                {inFrame && show(labels.right) && <LabelEl cfg={labels.right} vertical {...labelProps} />}
              </div>

              {inFrame && show(labels.bottom) && <LabelEl cfg={labels.bottom} {...labelProps} />}
            </div>
          </div>

          {/* Outside-frame right label */}
          {!inFrame && show(labels.right) && <LabelEl cfg={labels.right} vertical {...labelProps} />}
        </div>

        {/* Outside-frame bottom label */}
        {!inFrame && show(labels.bottom) && <LabelEl cfg={labels.bottom} {...labelProps} />}
      </div>

      {error && (
        <div className={`w-full max-w-xs text-xs px-3 py-2 rounded-lg border ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {error}
        </div>
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleDownload}
          disabled={isEmpty || !!error}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-40 hover:opacity-85 ${isDark ? 'bg-white text-[#1A1A2E]' : 'bg-[#1A1A2E] text-white'}`}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        >
          下载 PNG
        </button>
        <button
          onClick={() => download('svg')}
          disabled={isEmpty || !!error}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border disabled:opacity-40 ${isDark ? 'border-gray-500 text-gray-200 hover:bg-white/10' : 'border-gray-400 text-gray-700 hover:bg-gray-100'}`}
        >
          下载 SVG
        </button>
        <button
          onClick={handleCopy}
          disabled={isEmpty || !!error || isGenerating}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border disabled:opacity-40 ${
            copyState === 'copied'  ? (isDark ? 'border-green-500 text-green-400' : 'border-green-500 text-green-600') :
            copyState === 'failed'  ? (isDark ? 'border-red-500  text-red-400'   : 'border-red-400  text-red-500')   :
            isDark ? 'border-gray-500 text-gray-200 hover:bg-white/10' : 'border-gray-400 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {copyLabel}
        </button>
      </div>
    </div>
  );
}
