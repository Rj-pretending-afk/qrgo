import type { QROptions, ErrorCorrectionLevel } from '../types/qr.types';

interface Props {
  options: QROptions;
  onChange: (updates: Partial<QROptions>) => void;
  isDark: boolean;
}

export function InputPanel({ options, onChange, isDark }: Props) {
  const label = isDark ? 'text-gray-300' : 'text-gray-700';
  const subLabel = isDark ? 'text-gray-400' : 'text-gray-500';
  const hexText = isDark ? 'text-gray-500' : 'text-gray-400';
  const input = isDark
    ? 'bg-[#2A2A3E] border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-gray-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#1A1A2E]';

  return (
    <div className="space-y-6">
      {/* 内容输入 */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>
          内容（文字 / 链接）
        </label>
        <textarea
          value={options.data}
          onChange={(e) => onChange({ data: e.target.value })}
          placeholder="输入文字或粘贴链接..."
          className={`w-full border rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 transition-colors ${input}`}
        />
      </div>

      {/* 颜色选择 */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>
          颜色
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className={`text-xs mb-1 ${subLabel}`}>前景色</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.foregroundColor}
                onChange={(e) => onChange({ foregroundColor: e.target.value })}
                className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              />
              <span className={`text-xs font-mono ${hexText}`}>{options.foregroundColor}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className={`text-xs mb-1 ${subLabel}`}>背景色</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              />
              <span className={`text-xs font-mono ${hexText}`}>{options.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 纠错等级 */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${label}`}>
          纠错等级
        </label>
        <select
          value={options.errorCorrectionLevel}
          onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
          className={`w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${input}`}
        >
          <option value="L">L · 低（7% 纠错）</option>
          <option value="M">M · 中（15% 纠错）</option>
          <option value="Q">Q · 较高（25% 纠错）</option>
          <option value="H">H · 高（30% 纠错，推荐加 Logo 时使用）</option>
        </select>
      </div>
    </div>
  );
}
