import { useRef } from 'react';
import type { QROptions, ErrorCorrectionLevel, DotStyle, CornerStyle } from '../types/qr.types';

interface Props {
  options: QROptions;
  onChange: (updates: Partial<QROptions>) => void;
  isDark: boolean;
}

const TEMPLATES: {
  name: string;
  foregroundColor: string;
  backgroundColor: string;
  options: Partial<QROptions>;
}[] = [
  {
    name: '极简黑',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    options: { foregroundColor: '#000000', backgroundColor: '#FFFFFF', dotStyle: 'square', cornerStyle: 'square' },
  },
  {
    name: '复古蓝',
    foregroundColor: '#1A3A5C',
    backgroundColor: '#F0EBE3',
    options: { foregroundColor: '#1A3A5C', backgroundColor: '#F0EBE3', dotStyle: 'rounded', cornerStyle: 'extra-rounded' },
  },
  {
    name: '赛博粉',
    foregroundColor: '#e761aa',
    backgroundColor: '#111122',
    options: { foregroundColor: '#e761aa', backgroundColor: '#111122', dotStyle: 'dots', cornerStyle: 'dot' },
  },
];

const DOT_STYLES: { value: DotStyle; label: string; icon: string }[] = [
  { value: 'square', label: '方形', icon: '■' },
  { value: 'rounded', label: '圆角', icon: '▣' },
  { value: 'dots', label: '圆点', icon: '●' },
];

const CORNER_STYLES: { value: CornerStyle; label: string; icon: string }[] = [
  { value: 'square', label: '方角', icon: '□' },
  { value: 'extra-rounded', label: '圆角', icon: '⬜' },
  { value: 'dot', label: '圆点', icon: '○' },
];

export function InputPanel({ options, onChange, isDark }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const label    = isDark ? 'text-gray-200' : 'text-gray-800';
  const subLabel = isDark ? 'text-gray-400' : 'text-gray-500';
  const hexText  = isDark ? 'text-gray-500' : 'text-gray-400';
  const inputCls = isDark
    ? 'bg-[#2A2A3E] border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-gray-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#1A1A2E]';
  const styleBtnBase   = 'flex-1 py-2 rounded-lg text-xs font-semibold border transition-all';
  const styleBtnActive = isDark
    ? 'bg-white text-[#1A1A2E] border-white shadow-md'
    : 'bg-[#1A1A2E] text-white border-[#1A1A2E] shadow-md';
  const styleBtnInactive = isDark
    ? 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400 hover:shadow-sm'
    : 'bg-transparent text-gray-500 border-gray-300 hover:border-gray-400 hover:shadow-sm';

  // Detect active template by comparing key color/style fields
  const activeTemplateIdx = TEMPLATES.findIndex(t =>
    t.options.foregroundColor === options.foregroundColor &&
    t.options.backgroundColor === options.backgroundColor &&
    t.options.dotStyle        === options.dotStyle &&
    t.options.cornerStyle     === options.cornerStyle
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (options.logoUrl) URL.revokeObjectURL(options.logoUrl);
    onChange({ logoUrl: URL.createObjectURL(file), errorCorrectionLevel: 'H' });
  };

  const handleRemoveLogo = () => {
    if (options.logoUrl) URL.revokeObjectURL(options.logoUrl);
    onChange({ logoUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5">

      {/* 预设模板 */}
      <div>
        <label className={`block text-base font-semibold mb-2 ${label}`}>预设模板</label>
        <div className="flex gap-2">
          {TEMPLATES.map((t, idx) => {
            const isActive = idx === activeTemplateIdx;
            return (
              <button
                key={t.name}
                onClick={() => onChange(t.options)}
                className={`flex-1 overflow-hidden rounded-lg border text-xs font-semibold transition-all flex items-stretch ${
                  isActive
                    ? isDark
                      ? 'border-white shadow-[0_0_0_2px_white,0_4px_16px_rgba(0,0,0,0.5)]'
                      : 'border-[#1A1A2E] shadow-[0_0_0_2px_#1A1A2E,0_4px_16px_rgba(0,0,0,0.18)]'
                    : isDark
                      ? 'border-gray-600 shadow-md hover:border-gray-400 hover:shadow-lg'
                      : 'border-gray-300 shadow-md hover:border-gray-500 hover:shadow-lg'
                }`}
              >
                <span className="w-[28px] shrink-0" style={{ backgroundColor: t.foregroundColor }} />
                <span
                  className="flex flex-1 items-center justify-end py-2 pl-2 pr-3 text-right"
                  style={{ backgroundColor: t.backgroundColor, color: t.foregroundColor }}
                >
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容输入 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={`block text-base font-semibold ${label}`}>内容（文字 / 链接）</label>
          <span className={`text-xs font-mono ${options.data.length > 2500 ? 'text-red-500' : options.data.length > 2000 ? (isDark ? 'text-yellow-400' : 'text-amber-500') : hexText}`}>
            {options.data.length} / 2500
          </span>
        </div>
        <textarea
          value={options.data}
          onChange={(e) => onChange({ data: e.target.value })}
          placeholder="输入文字或粘贴链接..."
          className={`w-full border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 transition-colors ${
            options.data.length > 2500
              ? isDark ? 'border-red-700 focus:ring-red-700' : 'border-red-400 focus:ring-red-400'
              : inputCls
          }`}
        />
      </div>

      {/* 颜色 */}
      <div>
        <label className={`block text-base font-semibold mb-1.5 ${label}`}>颜色</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className={`text-xs mb-1 ${subLabel}`}>前景色</p>
            <div className="flex items-center gap-2">
              <input type="color" value={options.foregroundColor}
                onChange={(e) => onChange({ foregroundColor: e.target.value })}
                className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              <span className={`text-xs font-mono ${hexText}`}>{options.foregroundColor}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className={`text-xs mb-1 ${subLabel}`}>背景色</p>
            <div className="flex items-center gap-2">
              <input type="color" value={options.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              <span className={`text-xs font-mono ${hexText}`}>{options.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 点阵样式 */}
      <div>
        <label className={`block text-base font-semibold mb-1.5 ${label}`}>点阵样式</label>
        <div className="flex gap-2">
          {DOT_STYLES.map((s) => (
            <button key={s.value} onClick={() => onChange({ dotStyle: s.value })}
              className={`${styleBtnBase} ${options.dotStyle === s.value ? styleBtnActive : styleBtnInactive}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 定位符样式 */}
      <div>
        <label className={`block text-base font-semibold mb-1.5 ${label}`}>定位符样式</label>
        <div className="flex gap-2">
          {CORNER_STYLES.map((s) => (
            <button key={s.value} onClick={() => onChange({ cornerStyle: s.value })}
              className={`${styleBtnBase} ${options.cornerStyle === s.value ? styleBtnActive : styleBtnInactive}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 边框设置 */}
      <div>
        <label className={`block text-base font-semibold mb-3 ${label}`}>边框设置</label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${subLabel}`}>内边距</span>
              <span className={`text-sm font-mono ${hexText}`}>{options.framePadding}px</span>
            </div>
            <input type="range" min={0} max={60} step={4}
              value={options.framePadding}
              onChange={(e) => onChange({ framePadding: Number(e.target.value) })}
              className="w-full accent-current" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${subLabel}`}>圆角</span>
              <span className={`text-sm font-mono ${hexText}`}>{options.frameRadius}px</span>
            </div>
            <input type="range" min={0} max={60} step={4}
              value={options.frameRadius}
              onChange={(e) => onChange({ frameRadius: Number(e.target.value) })}
              className="w-full" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.labelsInFrame}
              onChange={(e) => onChange({ labelsInFrame: e.target.checked })}
              className="w-4 h-4 rounded accent-current"
            />
            <span className={`text-sm ${subLabel}`}>文字标签包含在边框内</span>
          </label>
        </div>
      </div>

      {/* Logo 上传 */}
      <div>
        <label className={`block text-base font-semibold mb-1.5 ${label}`}>中心 Logo</label>
        {options.logoUrl ? (
          <div className="flex items-center gap-3">
            <img src={options.logoUrl} className={`w-14 h-14 rounded-lg object-contain border ${isDark ? 'border-gray-600 bg-white/10' : 'border-gray-200 bg-gray-50'}`} />
            <div className="flex-1">
              <input type="range" min="0.2" max="0.4" step="0.05"
                value={options.logoSize}
                onChange={(e) => onChange({ logoSize: parseFloat(e.target.value) })}
                className="w-full" />
              <p className={`text-xs mt-0.5 ${subLabel}`}>大小 {Math.round(options.logoSize * 100)}%</p>
            </div>
            <button onClick={handleRemoveLogo}
              className={`text-xs px-2 py-1 rounded border ${isDark ? 'border-gray-600 text-gray-400 hover:text-red-400' : 'border-gray-200 text-gray-400 hover:text-red-500'}`}>
              移除
            </button>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()}
            className={`w-full py-2.5 border-2 border-dashed rounded-lg text-sm transition-colors ${
              isDark ? 'border-gray-600 text-gray-400 hover:border-gray-400' : 'border-gray-300 text-gray-400 hover:border-gray-400'
            }`}>
            + 上传图片
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        {options.logoUrl && (
          <p className={`text-xs mt-1 ${isDark ? 'text-yellow-500' : 'text-amber-600'}`}>
            ⚠ 已自动切换为 H 级纠错
          </p>
        )}
      </div>

      {/* 纠错等级 */}
      <div>
        <label className={`block text-base font-semibold mb-1.5 ${label}`}>纠错等级</label>
        <select value={options.errorCorrectionLevel}
          onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
          className={`w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${inputCls}`}>
          <option value="L">L · 低（7%）</option>
          <option value="M">M · 中（15%）</option>
          <option value="Q">Q · 较高（25%）</option>
          <option value="H">H · 高（30%，推荐加 Logo）</option>
        </select>
      </div>

    </div>
  );
}
