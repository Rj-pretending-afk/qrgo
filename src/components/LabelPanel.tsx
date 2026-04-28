import { useState } from 'react';
import type { QRLabels, LabelPosition, LabelConfig, Language } from '../types/qr.types';

interface Props {
  labels: QRLabels;
  onChange: (pos: LabelPosition, updates: Partial<LabelConfig>) => void;
  isDark: boolean;
  language: Language;
}

const POSITIONS: { value: LabelPosition; label: string; labelEn: string }[] = [
  { value: 'top', label: '上', labelEn: 'Top' },
  { value: 'bottom', label: '下', labelEn: 'Bottom' },
  { value: 'left', label: '左', labelEn: 'Left' },
  { value: 'right', label: '右', labelEn: 'Right' },
];

const FONTS = [
  { value: "'Inter', 'Noto Sans SC', system-ui, sans-serif", label: 'Inter（默认）', labelEn: 'Inter (Default)' },
  { value: "'Noto Sans SC', sans-serif", label: 'Noto Sans SC' },
  { value: 'serif', label: '衬线体', labelEn: 'Serif' },
  { value: 'monospace', label: '等宽体', labelEn: 'Monospace' },
  { value: "'Microsoft YaHei', 'PingFang SC', sans-serif", label: '微软雅黑', labelEn: 'Microsoft YaHei' },
  { value: "'SimSun', serif", label: '宋体', labelEn: 'SimSun' },
];

export function LabelPanel({ labels, onChange, isDark, language }: Props) {
  const [activePos, setActivePos] = useState<LabelPosition>('top');
  const cfg = labels[activePos];
  const isEnglish = language === 'en';
  const activePosition = POSITIONS.find(p => p.value === activePos);

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
            {isEnglish ? p.labelEn : p.label}
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
        <span className={`text-sm ${label}`}>
          {isEnglish ? `Enable ${activePosition?.labelEn} label` : `启用${activePosition?.label}方标签`}
        </span>
      </label>

      {cfg.enabled && (
        <div className="space-y-3">
          {/* 文字输入 */}
          <textarea
            value={cfg.text}
            onChange={(e) => onChange(activePos, { text: e.target.value })}
            placeholder={
              activePos === 'left' || activePos === 'right'
                ? isEnglish ? 'Vertical text (line breaks supported)' : '竖排文字（支持换行）'
                : isEnglish ? 'Enter label text (line breaks supported)' : '输入标签文字（支持换行）'
            }
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
                <option key={f.value} value={f.value}>{isEnglish ? (f.labelEn ?? f.label) : f.label}</option>
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

          {/* 文字颜色 + 格式 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{isEnglish ? 'Color' : '颜色'}</span>
            <input
              type="color"
              value={cfg.color}
              onChange={(e) => onChange(activePos, { color: e.target.value })}
              className={`w-9 h-9 rounded-md cursor-pointer border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
            />
            <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cfg.color}</span>

            {/* Format toggles */}
            {(['bold', 'italic', 'shadow'] as const).map((key) => {
              const active = !!(cfg as unknown as Record<string, unknown>)[key];
              const activeCls = isDark ? 'bg-white text-[#1A1A2E] border-white' : 'bg-[#1A1A2E] text-white border-[#1A1A2E]';
              const inactiveCls = isDark ? 'text-gray-400 border-gray-600 hover:border-gray-400' : 'text-gray-500 border-gray-300 hover:border-gray-400';
              const displayLabel = key === 'bold' ? 'B' : key === 'italic' ? 'I' : (isEnglish ? 'Shd' : '影');
              return (
                <button
                  key={key}
                  onClick={() => onChange(activePos, { [key]: !active } as Partial<typeof cfg>)}
                  className={`px-2.5 py-1 rounded-lg text-xs border transition-all font-semibold ${active ? activeCls : inactiveCls}`}
                  style={key === 'bold' ? { fontWeight: 'bold' } : key === 'italic' ? { fontStyle: 'italic' } : {}}
                  title={key}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>

          {/* 预览提示 */}
          {cfg.text.trim() && (
            <div
              className={`px-2 py-1.5 rounded border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              style={{
                fontFamily: cfg.fontFamily,
                fontSize: Math.min(cfg.fontSize, 14),
                fontWeight: cfg.bold ? 'bold' : 'normal',
                fontStyle: cfg.italic ? 'italic' : 'normal',
                color: cfg.color,
                textShadow: cfg.shadow ? '0 1px 3px rgba(0,0,0,0.25)' : 'none',
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
