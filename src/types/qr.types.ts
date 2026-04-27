export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type DotStyle = 'square' | 'rounded' | 'dots';
export type CornerStyle = 'square' | 'extra-rounded' | 'dot';
export type LabelPosition = 'top' | 'bottom' | 'left' | 'right';

export interface QROptions {
  data: string;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logoUrl: string;
  logoSize: number;
}

export interface LabelConfig {
  enabled: boolean;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export type QRLabels = Record<LabelPosition, LabelConfig>;
