export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QROptions {
  data: string;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
}
