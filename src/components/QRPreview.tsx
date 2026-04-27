import { useQRCode } from '../hooks/useQRCode';
import type { QROptions, QRLabels, LabelConfig } from '../types/qr.types';

interface Props {
  options: QROptions;
  labels: QRLabels;
  isDark: boolean;
}

export function QRPreview({ options, labels, isDark }: Props) {
  const { containerRef, download } = useQRCode(options);

  const hasLabels = Object.values(labels).some((l) => l.enabled && l.text.trim());

  const downloadComposed = async () => {
    const qrCanvas = containerRef.current?.querySelector('canvas');
    if (!qrCanvas || !hasLabels) {
      download('png');
      return;
    }

    const qrSize = qrCanvas.width;
    const gap = 10;
    const lineH = 1.4;

    const vH = (cfg: LabelConfig) => {
      if (!cfg.enabled || !cfg.text.trim()) return 0;
      const lines = cfg.text.split('\n').length;
      return cfg.fontSize * lines * lineH + gap;
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
      // draw each line as a separate vertical column isn't trivial; join with space
      ctx.fillText(cfg.text.replace(/\n/g, '  '), 0, 0);
      ctx.restore();
    };

    drawH(labels.top, cw / 2, 0);
    drawH(labels.bottom, cw / 2, topH + qrSize + gap / 2);
    drawV(labels.left, leftW / 2, ch / 2);
    drawV(labels.right, leftW + qrSize + rightW / 2, ch / 2);

    const link = document.createElement('a');
    link.download = 'qrgo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const cardCls = isDark ? 'bg-[#2A2A3E] border-gray-700' : 'bg-white border-gray-100';
  const verticalText: React.CSSProperties = { writingMode: 'vertical-lr', textOrientation: 'mixed' };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR + 标签预览 */}
      <div className="flex flex-col items-center gap-1">
        {/* 上方标签 */}
        {labels.top.enabled && labels.top.text.trim() && (
          <div
            style={{ fontFamily: labels.top.fontFamily, fontSize: labels.top.fontSize, color: labels.top.color, textAlign: 'center', whiteSpace: 'pre-line', maxWidth: '280px' }}
          >
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

          <div className={`rounded-2xl shadow-md p-5 border ${cardCls}`}>
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
          <div
            style={{ fontFamily: labels.bottom.fontFamily, fontSize: labels.bottom.fontSize, color: labels.bottom.color, textAlign: 'center', whiteSpace: 'pre-line', maxWidth: '280px' }}
          >
            {labels.bottom.text}
          </div>
        )}
      </div>

      {/* 下载按钮 */}
      <div className="flex gap-3">
        <button
          onClick={downloadComposed}
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
