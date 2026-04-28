import { useRef, useState, useEffect } from 'react';
import type { Language } from '../types/qr.types';

interface Crop { x: number; y: number; size: number; }
interface DragState {
  type: 'move' | 'tl' | 'tr' | 'bl' | 'br';
  startMouseX: number;
  startMouseY: number;
  startCrop: Crop;
}

const MAX_DISPLAY = 480;
const MIN_CROP    = 40;
const OUTPUT_SIZE = 400;
const HANDLE      = 10;

interface Props {
  src: string;
  isDark: boolean;
  language: Language;
  onConfirm: (croppedUrl: string) => void;
  onCancel: () => void;
}

export function CropModal({ src, isDark, language, onConfirm, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, size: 0 });
  const [drag, setDrag] = useState<DragState | null>(null);
  const isEn = language === 'en';

  const onLoad = () => {
    const img = imgRef.current!;
    const scale = Math.min(MAX_DISPLAY / img.naturalWidth, MAX_DISPLAY / img.naturalHeight, 4);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const size = Math.round(Math.min(w, h) * 0.8);
    setImgSize({ w, h });
    setCrop({ x: Math.round((w - size) / 2), y: Math.round((h - size) / 2), size });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.startMouseX;
      const dy = e.clientY - drag.startMouseY;
      const { x: ox, y: oy, size: os } = drag.startCrop;
      const { w, h } = imgSize;

      setCrop(() => {
        if (drag.type === 'move') {
          return {
            x: Math.max(0, Math.min(w - os, ox + dx)),
            y: Math.max(0, Math.min(h - os, oy + dy)),
            size: os,
          };
        }

        // Resize: keep the opposite corner fixed
        let ns: number, nx: number, ny: number;
        if (drag.type === 'tl') {
          const fx = ox + os, fy = oy + os;
          ns = Math.max(MIN_CROP, Math.max(fx - (ox + dx), fy - (oy + dy)));
          nx = fx - ns; ny = fy - ns;
        } else if (drag.type === 'tr') {
          const fx = ox, fy = oy + os;
          ns = Math.max(MIN_CROP, Math.max((ox + os + dx) - fx, fy - (oy + dy)));
          nx = fx; ny = fy - ns;
        } else if (drag.type === 'bl') {
          const fx = ox + os, fy = oy;
          ns = Math.max(MIN_CROP, Math.max(fx - (ox + dx), (oy + os + dy) - fy));
          nx = fx - ns; ny = fy;
        } else {
          ns = Math.max(MIN_CROP, Math.max(os + dx, os + dy));
          nx = ox; ny = oy;
        }

        nx = Math.max(0, nx);
        ny = Math.max(0, ny);
        if (nx + ns > w) ns = w - nx;
        if (ny + ns > h) ns = h - ny;
        return { x: nx, y: ny, size: Math.max(MIN_CROP, ns) };
      });
    };

    const onUp = () => setDrag(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, imgSize]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const startDrag = (e: React.MouseEvent, type: DragState['type']) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag({ type, startMouseX: e.clientX, startMouseY: e.clientY, startCrop: { ...crop } });
  };

  const handleConfirm = () => {
    const img = imgRef.current!;
    const scaleX = img.naturalWidth  / imgSize.w;
    const scaleY = img.naturalHeight / imgSize.h;
    const canvas = document.createElement('canvas');
    canvas.width  = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img,
      crop.x * scaleX, crop.y * scaleY, crop.size * scaleX, crop.size * scaleY,
      0, 0, OUTPUT_SIZE, OUTPUT_SIZE,
    );
    canvas.toBlob(blob => { if (blob) onConfirm(URL.createObjectURL(blob)); }, 'image/png');
  };

  const corners: { pos: DragState['type']; style: React.CSSProperties }[] = [
    { pos: 'tl', style: { top: -HANDLE/2, left:  -HANDLE/2, cursor: 'nwse-resize' } },
    { pos: 'tr', style: { top: -HANDLE/2, right: -HANDLE/2, cursor: 'nesw-resize' } },
    { pos: 'bl', style: { bottom: -HANDLE/2, left:  -HANDLE/2, cursor: 'nesw-resize' } },
    { pos: 'br', style: { bottom: -HANDLE/2, right: -HANDLE/2, cursor: 'nwse-resize' } },
  ];

  const cardCls = isDark ? 'bg-[#1E1E2E] text-white' : 'bg-white text-gray-800';
  const btnSecondary = isDark
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-600 hover:bg-gray-100';
  const btnPrimary = isDark ? 'bg-white text-[#1A1A2E]' : 'bg-[#1A1A2E] text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={`rounded-2xl shadow-2xl p-6 flex flex-col gap-4 ${cardCls}`}>
        <h3 className="font-semibold text-base">{isEn ? 'Crop Logo' : '裁剪 Logo'}</h3>

        {/* Image + crop overlay */}
        <div
          className="relative overflow-hidden rounded-lg select-none"
          style={{ width: imgSize.w || MAX_DISPLAY, height: imgSize.h || MAX_DISPLAY, background: '#0a0a14', minWidth: 200, minHeight: 200 }}
        >
          <img
            ref={imgRef}
            src={src}
            onLoad={onLoad}
            draggable={false}
            className="block"
            style={{ width: imgSize.w, height: imgSize.h }}
          />

          {imgSize.w > 0 && (
            <div
              className="absolute border-2 border-white"
              style={{
                left: crop.x, top: crop.y,
                width: crop.size, height: crop.size,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                cursor: drag?.type === 'move' ? 'grabbing' : 'grab',
              }}
              onMouseDown={(e) => startDrag(e, 'move')}
            >
              {/* Rule-of-thirds guides */}
              <div className="absolute inset-0 pointer-events-none">
                {[33.3, 66.6].map(p => (
                  <div key={`h${p}`} className="absolute w-full border-t border-white/25" style={{ top: `${p}%` }} />
                ))}
                {[33.3, 66.6].map(p => (
                  <div key={`v${p}`} className="absolute h-full border-l border-white/25" style={{ left: `${p}%` }} />
                ))}
              </div>

              {corners.map(({ pos, style }) => (
                <div
                  key={pos}
                  className="absolute bg-white rounded-sm z-10"
                  style={{ width: HANDLE, height: HANDLE, ...style }}
                  onMouseDown={(e) => startDrag(e, pos)}
                />
              ))}
            </div>
          )}
        </div>

        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {isEn ? 'Drag to move · Drag corners to resize' : '拖动选框移动，拖动四角调整大小'}
        </p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className={`px-4 py-2 text-sm rounded-lg border transition-colors ${btnSecondary}`}>
            {isEn ? 'Cancel' : '取消'}
          </button>
          <button onClick={handleConfirm} className={`px-4 py-2 text-sm rounded-lg font-semibold transition-opacity hover:opacity-85 ${btnPrimary}`}>
            {isEn ? 'Crop' : '确认裁剪'}
          </button>
        </div>
      </div>
    </div>
  );
}
