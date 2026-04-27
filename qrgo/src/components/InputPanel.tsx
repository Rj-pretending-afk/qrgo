import { useRef } from 'react';
import type { QROptions, ErrorCorrectionLevel, DotStyle, CornerStyle } from '../types/qr.types';

interface Props {
  options: QROptions;
  onChange: (updates: Partial<QROptions>) => void;
  isDark: boolean;
}

const TEMPLATES: { name: string; color: string; options: Partial<QROptions> }[] = [
  {
    name: '极简',
    color: '#000000',
    options: { foregroundColor: '#000000', backgroundColor: '#FFFFFF', dotStyle: 'square', cornerStyle: 'square' },
  },
  {
    name: '复古蓝',
    color: '#1A3A5C',
    options: { foregroundColor: '#1A3A5C', backgroundColor: '#F0EBE3', dotStyle: 'rounded', cornerStyle: 'extra-rounded' },
  },
  {
    name: '霓虹',
    color: '#E63946',
    options: { foregroundColor: '#E63946', backgroundColor: '#1A1A2E', dotStyle: 'dots', cornerStyle: 'dot' },
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

  const label = isDark ? 'text-gray-300' : 'text-gray-700';
  const subLabel = isDark ? 'text-gray-400' : 'text-gray-500';
  const hexText = isDark ? 'text-gray-500' : 'text-gray-400';
  const inputCls = isDark
    ? 'bg-[#2A2A3E] border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-gray-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#1A1A2E]';
  const styleBtnBase = 'flex-1 py-2 rounded-lg text-xs font-medium border transition-colors';
  const styleBtnActive = isDark
    ? 'bg-white text-[#1A1A2E] border-white'
    : 'bg-[#1A1A2E] text-white border-[#1A1A2E]';
  const styleBtnInactive = isDark
    ? 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
    : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400';

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (options.logoUrl) URL.revokeObjectURL(options.logoUrl);
    const url = URL.createObjectURL(file);
    onChange({ logoUrl: url, errorCorrectionLevel: 'H' });
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
        <label className={`block text-sm font-medium mb-2 ${label}`}>预设模板</label>
        <div className="flex gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              onClick={() => onChange(t.options)}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                isDark ? 'border-gray-600 text-gray-300 hover:border-gray-400' : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
              style={{ borderLeftWidth: '3px', borderLeftColor: t.color }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* 内容输入 */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>内容（文字 / 链接）</label>
        <textarea
          value={options.data}
          onChange={(e) => onChange({ data: e.target.value })}
          placeholder="输入文字或粘贴链接..."
          className={`w-full border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 transition-colors ${inputCls}`}
        />
      </div>

      {/* 颜色 */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>颜色</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className={`text-xs mb-1 ${subLabel}`}>前景色</p>
            <div className="flex items-center gap-2">
              <input type="color" value={options.foregroundColor}
                onChange={(e) => onChange({ foregroundColor: e.target.value })}
                className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-200'}`} />
              <span className={`text-xs font-mono ${hexText}`}>{options.foregroundColor}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className={`text-xs mb-1 ${subLabel}`}>背景色</p>
            <div className="flex items-center gap-2">
              <input type="color" value={options.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-200'}`} />
              <span className={`text-xs font-mono ${hexText}`}>{options.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 点阵样式 */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>点阵样式</label>
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
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>定位符样式</label>
        <div className="flex gap-2">
          {CORNER_STYLES.map((s) => (
            <button key={s.value} onClick={() => onChange({ cornerStyle: s.value })}
              className={`${styleBtnBase} ${options.cornerStyle === s.value ? styleBtnActive : styleBtnInactive}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo 上传 */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>中心 Logo</label>
        {options.logoUrl ? (
          <div className="flex items-center gap-3">
            <img src={options.logoUrl} className="w-10 h-10 rounded object-contain border border-gray-200" />
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
              isDark ? 'border-gray-600 text-gray-400 hover:border-gray-400' : 'border-gray-200 text-gray-400 hover:border-gray-400'
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
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>纠错等级</label>
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
