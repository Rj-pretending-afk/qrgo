import { useState } from 'react';
import type { QRLabels, LabelPosition, LabelConfig } from '../types/qr.types';

interface Props {
  labels: QRLabels;
  onChange: (pos: LabelPosition, updates: Partial<LabelConfig>) => void;
  isDark: boolean;
}

const POSITIONS: { value: LabelPosition; label: string }[] = [
  { value: 'top', label: '上' },
  { value: 'bottom', label: '下' },
  { value: 'left', label: '左' },
  { value: 'right', label: '右' },
];

const FONTS = [
  { value: "'Inter', 'Noto Sans SC', system-ui, sans-serif", label: 'Inter（默认）' },
  { value: "'Noto Sans SC', sans-serif", label: 'Noto Sans SC' },
  { value: 'serif', label: '衬线体' },
  { value: 'monospace', label: '等宽体' },
  { value: "'Microsoft YaHei', 'PingFang SC', sans-serif", label: '微软雅黑' },
  { value: "'SimSun', serif", label: '宋体' },
];

export function LabelPanel({ labels, onChange, isDark }: Props) {
  const [activePos, setActivePos] = useState<LabelPosition>('top');
  const cfg = labels[activePos];

  const label = isDark ? 'text-gray-300' : 'text-gray-700';
  const inputCls = isDark
    ? 'bg-[#2A2A3E] border-gray-600 text-gray-200 placeholder-gray-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';
  const tabActive = isDark
    ? 'bg-white text-[#1A1A2E]'
    : 'bg-[#1A1A2E] text-white';
  const tabInactive = isDark
    ? 'text-gray-400 border border-gray-600 hover:border-gray-400'
    : 'text-gray-500 border border-gray-200 hover:border-gray-400';

  return (
    <div className="space-y-3">
      {/* 位置选择 */}
      <div className="flex gap-1.5">
        {POSITIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => setActivePos(p.value)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activePos === p.value ? tabActive : tabInactive
            }`}
          >
            {p.label}
            {labels[p.value].enabled && labels[p.value].text.trim() && (
              <span className="ml-1 text-xs opacity-60">●</span>
            )}
          </button>
        ))}
      </div>

      {/* 启用开关 */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={cfg.enabled}
          onChange={(e) => onChange(activePos, { enabled: e.target.checked })}
          className="w-4 h-4 rounded"
        />
        <span className={`text-sm ${label}`}>启用{POSITIONS.find(p => p.value === activePos)?.label}方标签</span>
      </label>

      {cfg.enabled && (
        <div className="space-y-3">
          {/* 文字输入 */}
          <textarea
            value={cfg.text}
            onChange={(e) => onChange(activePos, { text: e.target.value })}
            placeholder={activePos === 'left' || activePos === 'right' ? '竖排文字（支持换行）' : '输入标签文字（支持换行）'}
            rows={3}
            className={`w-full border rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A2E] transition-colors ${inputCls}`}
          />

          {/* 字体 + 字号 */}
          <div className="flex gap-2">
            <select
              value={cfg.fontFamily}
              onChange={(e) => onChange(activePos, { fontFamily: e.target.value })}
              className={`flex-1 border rounded-lg p-2 text-sm focus:outline-none transition-colors ${inputCls}`}
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={8}
                max={48}
                value={cfg.fontSize}
                onChange={(e) => onChange(activePos, { fontSize: Number(e.target.value) })}
                className={`w-16 border rounded-lg p-2 text-sm text-center focus:outline-none transition-colors ${inputCls}`}
              />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>px</span>
            </div>
          </div>

          {/* 文字颜色 */}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>颜色</span>
            <input
              type="color"
              value={cfg.color}
              onChange={(e) => onChange(activePos, { color: e.target.value })}
              className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
            />
            <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cfg.color}</span>
          </div>

          {/* 预览提示 */}
          {cfg.text.trim() && (
            <div
              className={`text-xs px-2 py-1.5 rounded border ${isDark ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'}`}
              style={{
                fontFamily: cfg.fontFamily,
                fontSize: Math.min(cfg.fontSize, 13),
                color: cfg.color,
                writingMode: (activePos === 'left' || activePos === 'right') ? 'vertical-lr' : undefined,
                maxHeight: '60px',
                overflow: 'hidden',
              }}
            >
              {cfg.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
