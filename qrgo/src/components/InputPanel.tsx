import type { QROptions, ErrorCorrectionLevel } from '../types/qr.types';

interface Props {
  options: QROptions;
  onChange: (updates: Partial<QROptions>) => void;
}

export function InputPanel({ options, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* 内容输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          内容（文字 / 链接）
        </label>
        <textarea
          value={options.data}
          onChange={(e) => onChange({ data: e.target.value })}
          placeholder="输入文字或粘贴链接..."
          className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#1A1A2E] transition"
        />
      </div>

      {/* 颜色选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          颜色
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">前景色</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.foregroundColor}
                onChange={(e) => onChange({ foregroundColor: e.target.value })}
                className="w-9 h-9 rounded-md cursor-pointer border border-gray-200"
              />
              <span className="text-xs text-gray-400 font-mono">{options.foregroundColor}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">背景色</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="w-9 h-9 rounded-md cursor-pointer border border-gray-200"
              />
              <span className="text-xs text-gray-400 font-mono">{options.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 纠错等级 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          纠错等级
        </label>
        <select
          value={options.errorCorrectionLevel}
          onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
          className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A2E] transition"
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
