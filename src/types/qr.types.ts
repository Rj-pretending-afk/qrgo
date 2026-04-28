export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type DotStyle = 'square' | 'rounded' | 'dots';
export type CornerStyle = 'square' | 'extra-rounded' | 'dot';
export type LabelPosition = 'top' | 'bottom' | 'left' | 'right';
export type Language = 'zh' | 'en';
export type AppMode = 'simple' | 'custom';

export interface QROptions {
  data: string;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logoUrl: string;
  logoSize: number;
  framePadding: number;
  frameRadius: number;
  labelsInFrame: boolean;
}

export interface LabelConfig {
  enabled: boolean;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  shadow: boolean;
}

export type QRLabels = Record<LabelPosition, LabelConfig>;
