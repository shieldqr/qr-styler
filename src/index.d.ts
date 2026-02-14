/**
 * Shield QR Styler - TypeScript Declarations
 */

export interface ShapeVariation {
  label: string;
  description: string;
  viewBox: string;
  width: number;
  height: number;
  path: string;
  qrArea: { x: number; y: number; size: number };
  bare?: boolean;
}

export interface ShapeCategory {
  label: string;
  icon: string;
  description: string;
  variations: Record<string, ShapeVariation>;
}

export interface ColorPreset {
  label: string;
  description: string;
  icon: string;
  background: string;
  foreground: string;
  outline: string;
  finderOuter: string;
  finderInner: string;
  outlineWidth: number;
  category: 'dark' | 'light';
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;
  stops?: number[];
}

export interface GradientPreset {
  label: string;
  value: GradientConfig | null;
}

export interface StyleInfo {
  label: string;
  icon: string;
  description: string;
}

export interface FinderPatternInfo {
  label: string;
  description: string;
}

export interface GenerateOptions {
  shapeCategory?: string;
  shapeVariation?: string;
  shape?: string | null;
  moduleStyle?: 'circle' | 'roundedSquare' | 'diamond' | 'dot' | 'square' | 'barH' | 'barV' | 'pond';
  moduleScale?: number;
  finderScale?: number;
  finderPattern?: 'pattern' | 'solid';
  finderOuterStyle?: 'rounded' | 'square' | 'circle' | 'diamond';
  finderInnerStyle?: 'rounded' | 'square' | 'circle' | 'diamond';
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  colors?: {
    background?: string;
    foreground?: string;
    outline?: string;
    finderOuter?: string | null;
    finderInner?: string | null;
    outlineWidth?: number;
  };
  gradient?: GradientConfig | null;
  glowEffect?: boolean;
  glowColor?: string | null;
  glowIntensity?: number;
  innerBorder?: boolean;
  innerBorderWidth?: number;
  innerBorderColor?: string | null;
  innerBorderOffset?: number;
  centerClear?: boolean;
  centerSize?: number;
  decorativeFill?: boolean;
  decorativeDensity?: number;
  decorativeOpacity?: number;
  decorativeSafeMargin?: number;
  decorativeShieldInset?: number;
  decorativeScale?: number;
  preset?: string | null;
}

export interface DesignConfig extends GenerateOptions {
  customColors?: {
    background: string;
    foreground: string;
    outline: string;
    finderOuter: string;
    finderInner: string;
    outlineWidth?: number;
  } | null;
}

export interface ResolvedShape {
  category: string;
  variation: string;
  shape: ShapeVariation;
}

// Constants
export const SHAPE_LIBRARY: Record<string, ShapeCategory>;
export const SHIELD_PATHS: Record<string, ShapeVariation>;
export const COLOR_PRESETS: Record<string, ColorPreset>;
export const MODULE_STYLES: Record<string, StyleInfo>;
export const FINDER_PATTERNS: Record<string, FinderPatternInfo>;
export const FINDER_STYLES: Record<string, StyleInfo>;
export const GRADIENT_PRESETS: Record<string, GradientPreset>;
export const DEFAULT_OPTIONS: GenerateOptions;
export const DEFAULT_DESIGN: DesignConfig;

// Generation
export function generateShapeQR(data: string, options?: GenerateOptions): Promise<string>;
export function generateShapeQRBuffer(data: string, options?: GenerateOptions): Promise<Buffer | Uint8Array>;
export function generateShapeQRDataURI(data: string, options?: GenerateOptions): Promise<string>;

// Legacy aliases
export const generateShieldQR: typeof generateShapeQR;
export const generateShieldQRBuffer: typeof generateShapeQRBuffer;
export const generateShieldQRDataURI: typeof generateShapeQRDataURI;

// Library access
export function getShapeLibrary(): Record<string, ShapeCategory>;
export function getShapeCategories(): string[];
export function getShapeVariations(category: string): string[];
export function getShieldShapes(): string[];
export function getColorPresets(): string[];
export function getPresetColors(name: string): ColorPreset | null;
export function getShieldPath(name: string): ShapeVariation | null;
export function registerShape(categoryKey: string, categoryDef: Partial<ShapeCategory>, merge?: boolean): void;

// Helpers
export function resolveShape(design: Partial<DesignConfig>): ResolvedShape;
export function resolveColors(design: Partial<DesignConfig>): {
  background: string;
  foreground: string;
  outline: string;
  finderOuter: string;
  finderInner: string;
  outlineWidth: number;
};
export function serializeDesign(design: DesignConfig): Record<string, any>;
