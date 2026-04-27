import { useState } from 'react';
import { useQRCode } from '../hooks/useQRCode';
import type { QROptions, QRLabels, LabelConfig } from '../types/qr.types';

interface Props {
  options: QROptions;
  labels: QRLabels;
  isDark: boolean;
}

export function QRPreview({ options, labels, isDark }: Props) {
  const { containerRef, download, getCanvas, isGenerating, error } = useQRCode(options);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const isEmpty = !options.data.trim();
  const hasLabels = Object.values(labels).some((l) => l.enabled && l.text.trim());

  const composeCanvas = (): HTMLCanvasElement | null => {
    const qrCanvas = getCanvas();
    if (!qrCanvas) return null;

    if (!hasLabels) return qrCanvas;

    const qrSize = qrCanvas.width;
    const gap = 10;
    const lineH = 1.4;

    const vH = (cfg: LabelConfig) => {
      if (!cfg.enabled || !cfg.text.trim()) return 0;
      return cfg.fontSize * cfg.text.split('\n').length * lineH + gap;
    };
    const vW = (cfg: LabelConfig) => {
      if (!cfg.enabled || !cfg.text.trim()) return 0;
      return cfg.fontSize * lineH + gap;
    };

    const topH = vH(labels.top);
    const botH = vH(labels.bottom);
    const leftW = vW(labels.left);
    const rightW = vW(labels.right);

    const cw = leftW + qrSize + rightW;
    const ch = topH + qrSize + botH;

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(qrCanvas, leftW, topH);

    const drawH = (cfg: LabelConfig, cx: number, cy: number) => {
      if (!cfg.enabled || !cfg.text.trim()) return;
      ctx.save();
      ctx.font = `${cfg.fontSize}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      cfg.text.split('\n').forEach((line, i) => {
        ctx.fillText(line, cx, cy + i * cfg.fontSize * lineH);
      });
      ctx.restore();
    };

    const drawV = (cfg: LabelConfig, cx: number, cy: number) => {
      if (!cfg.enabled || !cfg.text.trim()) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 2);
      ctx.font = `${cfg.fontSize}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cfg.text.replace(/\n/g, '  '), 0, 0);
      ctx.restore();
    };

    drawH(labels.top, cw / 2, 0);
    drawH(labels.bottom, cw / 2, topH + qrSize + gap / 2);
    drawV(labels.left, leftW / 2, ch / 2);
    drawV(labels.right, leftW + qrSize + rightW / 2, ch / 2);

    return canvas;
  };

  const handleDownload = () => {
    const canvas = composeCanvas();
    if (!canvas || !hasLabels) {
      download('png');
      return;
    }
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

  const cardCls = isDark ? 'bg-[#2A2A3E] border-gray-700' : 'bg-white border-gray-100';
  const verticalText: React.CSSProperties = { writingMode: 'vertical-lr', textOrientation: 'mixed' };

  const copyLabel = copyState === 'copied' ? '已复制' : copyState === 'failed' ? '复制失败' : '复制';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR + 标签预览 */}
      <div className="flex flex-col items-center gap-1">
        {/* 上方标签 */}
        {labels.top.enabled && labels.top.text.trim() && (
          <div style={{ fontFamily: labels.top.fontFamily, fontSize: labels.top.fontSize, color: labels.top.color, textAlign: 'center', whiteSpace: 'pre-line', maxWidth: '280px' }}>
            {labels.top.text}
          </div>
        )}

        {/* 中间行：左标签 + 二维码 + 右标签 */}
        <div className="flex items-center gap-2">
          {labels.left.enabled && labels.left.text.trim() && (
            <div style={{ ...verticalText, fontFamily: labels.left.fontFamily, fontSize: labels.left.fontSize, color: labels.left.color, whiteSpace: 'pre-wrap' }}>
              {labels.left.text}
            </div>
          )}

          {/* QR 卡片 */}
          <div className={`relative rounded-2xl shadow-md p-5 border ${cardCls}`}>
            {/* 加载遮罩 */}
            {isGenerating && (
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/20 backdrop-blur-[1px] z-10">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* 空状态遮罩 */}
            {isEmpty && (
              <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10"
                style={{ background: isDark ? 'rgba(42,42,62,0.92)' : 'rgba(255,255,255,0.92)' }}>
                <div className={`text-4xl mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>⬛</div>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>在左侧输入内容</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>即可生成二维码</p>
              </div>
            )}

            <div ref={containerRef} />
          </div>

          {labels.right.enabled && labels.right.text.trim() && (
            <div style={{ ...verticalText, fontFamily: labels.right.fontFamily, fontSize: labels.right.fontSize, color: labels.right.color, whiteSpace: 'pre-wrap' }}>
              {labels.right.text}
            </div>
          )}
        </div>

        {/* 下方标签 */}
        {labels.bottom.enabled && labels.bottom.text.trim() && (
          <div style={{ fontFamily: labels.bottom.fontFamily, fontSize: labels.bottom.fontSize, color: labels.bottom.color, textAlign: 'center', whiteSpace: 'pre-line', maxWidth: '280px' }}>
            {labels.bottom.text}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className={`w-full max-w-xs text-xs px-3 py-2 rounded-lg border ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleDownload}
          disabled={isEmpty || !!error}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40 hover:opacity-90 ${isDark ? 'bg-white text-[#1A1A2E]' : 'bg-[#1A1A2E] text-white'}`}
        >
          下载 PNG
        </button>
        <button
          onClick={() => download('svg')}
          disabled={isEmpty || !!error}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border disabled:opacity-40 ${isDark ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-[#1A1A2E] text-[#1A1A2E] hover:bg-gray-50'}`}
        >
          下载 SVG
        </button>
        <button
          onClick={handleCopy}
          disabled={isEmpty || !!error || isGenerating}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border disabled:opacity-40 ${
            copyState === 'copied'
              ? isDark ? 'border-green-600 text-green-400' : 'border-green-500 text-green-600'
              : copyState === 'failed'
              ? isDark ? 'border-red-600 text-red-400' : 'border-red-400 text-red-500'
              : isDark ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-[#1A1A2E] text-[#1A1A2E] hover:bg-gray-50'
          }`}
        >
          {copyLabel}
        </button>
      </div>
    </div>
  );
}
