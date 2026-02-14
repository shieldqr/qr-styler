/**
 * Shield QR Styler - Custom Shaped QR Code Generator
 * ===================================================
 *
 * A framework-agnostic library for generating beautifully shaped
 * QR codes as SVG strings. Works in Node.js, browsers, and edge runtimes.
 *
 * Shape Categories:
 *   none, square, rectangle, circle, oval, diamond, heart, hexagon, shield
 *   Each category has 2-4 variations (e.g. shield → classic, badge, modern, emblem).
 *
 * Features:
 *   - 9 shape categories with 22+ variations
 *   - 7 module styles: circle, roundedSquare, diamond, dot, square, barH, barV, pond
 *   - 7 color presets (or fully custom colours)
 *   - 6 gradient presets
 *   - Linear & radial gradient support
 *   - Glow effects, inner borders
 *   - Finder pattern accent colors with solid/pattern modes
 *   - Center-clear area for logo overlay
 *   - Decorative fill with controllable density, opacity, margins
 *   - High error correction (H) for reliable scanning
 *   - Extensible: register custom shapes at runtime
 *
 * Usage:
 *   import { generateShapeQR } from 'shield-qr-styler';
 *   const svg = await generateShapeQR('https://example.com', {
 *     shapeCategory: 'circle',
 *     shapeVariation: 'squircle',
 *     preset: 'cyber',
 *   });
 *
 * @module shield-qr-styler
 */

import QRCode from 'qrcode';

// ═════════════════════════════════════════════════
// Shape Library
// ═════════════════════════════════════════════════

export const SHAPE_LIBRARY = {

  // ────────────────── NONE (bare QR) ──────────────────
  none: {
    label: 'None',
    icon: '⊞',
    description: 'Plain QR code with no shape or border',
    variations: {
      default: {
        label: 'Default',
        description: 'Raw QR code, no framing',
        viewBox: '0 0 300 300',
        width: 300, height: 300,
        path: 'M 0 0 H 300 V 300 H 0 Z',
        qrArea: { x: 8, y: 8, size: 284 },
        bare: true,
      },
    },
  },

  // ────────────────── SQUARE ──────────────────
  square: {
    label: 'Square',
    icon: '⬜',
    description: 'Square shapes with corner variations',
    variations: {
      sharp: {
        label: 'Sharp',
        description: 'Clean sharp edges',
        viewBox: '0 0 300 300',
        width: 300, height: 300,
        path: 'M 8 8 H 292 V 292 H 8 Z',
        qrArea: { x: 18, y: 18, size: 264 },
      },
      rounded: {
        label: 'Rounded',
        description: 'Softly rounded corners',
        viewBox: '0 0 300 300',
        width: 300, height: 300,
        path: 'M 30 8 H 270 Q 292 8 292 30 V 270 Q 292 292 270 292 H 30 Q 8 292 8 270 V 30 Q 8 8 30 8 Z',
        qrArea: { x: 18, y: 18, size: 264 },
      },
      pill: {
        label: 'Pill',
        description: 'Very rounded corners',
        viewBox: '0 0 300 300',
        width: 300, height: 300,
        path: 'M 60 8 H 240 Q 292 8 292 60 V 240 Q 292 292 240 292 H 60 Q 8 292 8 240 V 60 Q 8 8 60 8 Z',
        qrArea: { x: 24, y: 24, size: 252 },
      },
    },
  },

  // ────────────────── RECTANGLE ──────────────────
  rectangle: {
    label: 'Rectangle',
    icon: '▬',
    description: 'Rectangular portrait and landscape shapes',
    variations: {
      portrait: {
        label: 'Portrait',
        description: 'Tall rounded rectangle',
        viewBox: '0 0 260 360',
        width: 260, height: 360,
        path: 'M 26 8 H 234 Q 252 8 252 26 V 334 Q 252 352 234 352 H 26 Q 8 352 8 334 V 26 Q 8 8 26 8 Z',
        qrArea: { x: 14, y: 64, size: 232 },
      },
      landscape: {
        label: 'Landscape',
        description: 'Wide rounded rectangle',
        viewBox: '0 0 360 260',
        width: 360, height: 260,
        path: 'M 26 8 H 334 Q 352 8 352 26 V 234 Q 352 252 334 252 H 26 Q 8 252 8 234 V 26 Q 8 8 26 8 Z',
        qrArea: { x: 64, y: 14, size: 232 },
      },
      ticket: {
        label: 'Ticket',
        description: 'Rounded rectangle with decorative notches',
        viewBox: '0 0 260 360',
        width: 260, height: 360,
        path: [
          'M 26 8 H 234 Q 252 8 252 26 V 148',
          'Q 242 158 242 170 Q 242 182 252 192',
          'V 334 Q 252 352 234 352 H 26 Q 8 352 8 334',
          'V 192 Q 18 182 18 170 Q 18 158 8 148',
          'V 26 Q 8 8 26 8 Z',
        ].join(' '),
        qrArea: { x: 22, y: 64, size: 216 },
      },
    },
  },

  // ────────────────── CIRCLE ──────────────────
  circle: {
    label: 'Circle',
    icon: '⭕',
    description: 'Circular and squircle shapes',
    variations: {
      perfect: {
        label: 'Perfect',
        description: 'True circle',
        viewBox: '0 0 300 300',
        width: 300, height: 300,
        path: 'M 150 8 A 142 142 0 0 1 292 150 A 142 142 0 0 1 150 292 A 142 142 0 0 1 8 150 A 142 142 0 0 1 150 8 Z',
        qrArea: { x: 52, y: 52, size: 196 },
      },
      squircle: {
        label: 'Squircle',
        description: 'Superellipse / iOS icon shape',
        viewBox: '0 0 300 300',
        width: 300, height: 300,
        path: 'M 150 8 C 260 8 292 40 292 150 C 292 260 260 292 150 292 C 40 292 8 260 8 150 C 8 40 40 8 150 8 Z',
        qrArea: { x: 40, y: 40, size: 220 },
      },
    },
  },

  // ────────────────── OVAL ──────────────────
  oval: {
    label: 'Oval',
    icon: '⬮',
    description: 'Elliptical shapes',
    variations: {
      vertical: {
        label: 'Vertical',
        description: 'Tall oval',
        viewBox: '0 0 280 360',
        width: 280, height: 360,
        path: 'M 140 8 A 132 172 0 0 1 272 180 A 132 172 0 0 1 140 352 A 132 172 0 0 1 8 180 A 132 172 0 0 1 140 8 Z',
        qrArea: { x: 38, y: 78, size: 204 },
      },
      horizontal: {
        label: 'Horizontal',
        description: 'Wide oval',
        viewBox: '0 0 360 280',
        width: 360, height: 280,
        path: 'M 180 8 A 172 132 0 0 1 352 140 A 172 132 0 0 1 180 272 A 172 132 0 0 1 8 140 A 172 132 0 0 1 180 8 Z',
        qrArea: { x: 78, y: 38, size: 204 },
      },
    },
  },

  // ────────────────── DIAMOND ──────────────────
  diamond: {
    label: 'Diamond',
    icon: '◆',
    description: 'Diamond / rhombus shapes',
    variations: {
      classic: {
        label: 'Classic',
        description: 'Sharp diamond',
        viewBox: '0 0 300 340',
        width: 300, height: 340,
        path: 'M 150 8 L 292 170 L 150 332 L 8 170 Z',
        qrArea: { x: 76, y: 96, size: 148 },
      },
      soft: {
        label: 'Soft',
        description: 'Rounded diamond corners',
        viewBox: '0 0 300 340',
        width: 300, height: 340,
        path: 'M 150 18 Q 224 90 282 170 Q 224 250 150 322 Q 76 250 18 170 Q 76 90 150 18 Z',
        qrArea: { x: 78, y: 98, size: 144 },
      },
    },
  },

  // ────────────────── HEART ──────────────────
  heart: {
    label: 'Heart',
    icon: '❤️',
    description: 'Heart shapes',
    variations: {
      classic: {
        label: 'Classic',
        description: 'Traditional heart',
        viewBox: '0 0 300 280',
        width: 300, height: 280,
        path: [
          'M 150 268',
          'C 75 218 8 165 8 112',
          'C 8 55 50 18 100 18',
          'C 130 18 150 48 150 48',
          'C 150 48 170 18 200 18',
          'C 250 18 292 55 292 112',
          'C 292 165 225 218 150 268 Z',
        ].join(' '),
        qrArea: { x: 62, y: 42, size: 176 },
      },
      rounded: {
        label: 'Rounded',
        description: 'Softer, fuller heart',
        viewBox: '0 0 300 280',
        width: 300, height: 280,
        path: [
          'M 150 258',
          'C 68 204 14 158 14 108',
          'C 14 52 55 18 105 18',
          'C 135 18 150 45 150 45',
          'C 150 45 165 18 195 18',
          'C 245 18 286 52 286 108',
          'C 286 158 232 204 150 258 Z',
        ].join(' '),
        qrArea: { x: 58, y: 38, size: 184 },
      },
    },
  },

  // ────────────────── HEXAGON ──────────────────
  hexagon: {
    label: 'Hexagon',
    icon: '⬡',
    description: 'Six-sided shapes',
    variations: {
      sharp: {
        label: 'Sharp',
        description: 'Clean hex edges',
        viewBox: '0 0 300 340',
        width: 300, height: 340,
        path: 'M 150 8 L 290 88 L 290 252 L 150 332 L 10 252 L 10 88 Z',
        qrArea: { x: 56, y: 72, size: 188 },
      },
      rounded: {
        label: 'Rounded',
        description: 'Softly rounded hex corners',
        viewBox: '0 0 300 340',
        width: 300, height: 340,
        path: [
          'M 150 14',
          'Q 220 14 284 90',
          'L 284 250',
          'Q 220 326 150 326',
          'Q 80 326 16 250',
          'L 16 90',
          'Q 80 14 150 14 Z',
        ].join(' '),
        qrArea: { x: 58, y: 74, size: 184 },
      },
    },
  },

  // ────────────────── SHIELD ──────────────────
  shield: {
    label: 'Shield',
    icon: '🛡️',
    description: 'Protective shield shapes',
    variations: {
      classic: {
        label: 'Classic',
        description: 'Heraldic shield with pointed base',
        viewBox: '0 0 300 340',
        width: 300, height: 340,
        path: [
          'M 150 8',
          'C 100 8, 18 18, 8 24',
          'L 8 170',
          'C 8 240, 65 295, 150 332',
          'C 235 295, 292 240, 292 170',
          'L 292 24',
          'C 282 18, 200 8, 150 8',
          'Z',
        ].join(' '),
        qrArea: { x: 46, y: 36, size: 208 },
      },
      badge: {
        label: 'Badge',
        description: 'Rounded badge with soft curves',
        viewBox: '0 0 300 330',
        width: 300, height: 330,
        path: [
          'M 150 10',
          'C 90 10, 28 18, 18 24',
          'Q 10 30, 10 40',
          'L 10 185',
          'C 10 245, 60 290, 150 322',
          'C 240 290, 290 245, 290 185',
          'L 290 40',
          'Q 290 30, 282 24',
          'C 272 18, 210 10, 150 10',
          'Z',
        ].join(' '),
        qrArea: { x: 44, y: 42, size: 212 },
      },
      modern: {
        label: 'Modern',
        description: 'Clean with rounded bottom',
        viewBox: '0 0 300 310',
        width: 300, height: 310,
        path: [
          'M 150 10',
          'C 100 10, 25 18, 15 24',
          'L 15 205',
          'Q 15 248, 42 268',
          'Q 80 292, 150 300',
          'Q 220 292, 258 268',
          'Q 285 248, 285 205',
          'L 285 24',
          'C 275 18, 200 10, 150 10',
          'Z',
        ].join(' '),
        qrArea: { x: 36, y: 30, size: 228 },
      },
      emblem: {
        label: 'Emblem',
        description: 'Angular military chevron',
        viewBox: '0 0 300 350',
        width: 300, height: 350,
        path: [
          'M 150 5',
          'L 292 22',
          'L 292 195',
          'C 292 258, 234 310, 150 342',
          'C 66 310, 8 258, 8 195',
          'L 8 22',
          'Z',
        ].join(' '),
        qrArea: { x: 42, y: 34, size: 216 },
      },
    },
  },
};

// ─────────────────────────────────────────────
// Backward-compatible alias
// ─────────────────────────────────────────────
export const SHIELD_PATHS = SHAPE_LIBRARY.shield.variations;

// ═════════════════════════════════════════════════
// Color Presets
// ═════════════════════════════════════════════════

export const COLOR_PRESETS = {
  cyber: {
    label: 'Cyber', description: 'Neon cyan on navy', icon: '💠',
    background: '#0a0e27', foreground: '#00d4ff', outline: '#00d4ff',
    finderOuter: '#00ff88', finderInner: '#00d4ff', outlineWidth: 3,
    category: 'dark',
  },
  stealth: {
    label: 'Stealth', description: 'Grey on black, minimal', icon: '🌑',
    background: '#1a1a1a', foreground: '#c8c8c8', outline: '#555555',
    finderOuter: '#ffffff', finderInner: '#999999', outlineWidth: 2,
    category: 'dark',
  },
  royal: {
    label: 'Royal', description: 'Purple & gold, luxurious', icon: '👑',
    background: '#1a0a3e', foreground: '#c9a0ff', outline: '#ffd700',
    finderOuter: '#ffd700', finderInner: '#c9a0ff', outlineWidth: 3,
    category: 'dark',
  },
  military: {
    label: 'Military', description: 'Green on olive, tactical', icon: '🎖️',
    background: '#1a2e1a', foreground: '#4caf50', outline: '#66bb6a',
    finderOuter: '#a5d6a7', finderInner: '#4caf50', outlineWidth: 2.5,
    category: 'dark',
  },
  fire: {
    label: 'Fire', description: 'Red & orange, bold', icon: '🔥',
    background: '#1a0000', foreground: '#ff4444', outline: '#ff6600',
    finderOuter: '#ffaa00', finderInner: '#ff4444', outlineWidth: 3,
    category: 'dark',
  },
  ocean: {
    label: 'Ocean', description: 'Blue tones, professional', icon: '🌊',
    background: '#001a33', foreground: '#0088cc', outline: '#00aaff',
    finderOuter: '#00ddff', finderInner: '#0088cc', outlineWidth: 2.5,
    category: 'dark',
  },
  monochrome: {
    label: 'Monochrome', description: 'Classic black on white', icon: '⬛',
    background: '#ffffff', foreground: '#000000', outline: '#222222',
    finderOuter: '#000000', finderInner: '#000000', outlineWidth: 2.5,
    category: 'light',
  },
};

// ═════════════════════════════════════════════════
// Module Styles
// ═════════════════════════════════════════════════

export const MODULE_STYLES = {
  circle:        { label: 'Circle',  icon: '●', description: 'Circular dots' },
  roundedSquare: { label: 'Rounded', icon: '▢', description: 'Rounded squares' },
  diamond:       { label: 'Diamond', icon: '◆', description: 'Diamond shapes' },
  square:        { label: 'Square',  icon: '■', description: 'Sharp squares' },
  barH:          { label: 'H-Bars',  icon: '≡', description: 'Horizontal flowing bars' },
  barV:          { label: 'V-Bars',  icon: '⫿', description: 'Vertical flowing bars' },
  pond:          { label: 'Pond',    icon: '⬬', description: 'Connected organic blobs' },
};

// ═════════════════════════════════════════════════
// Finder Pattern Styles
// ═════════════════════════════════════════════════

export const FINDER_PATTERNS = {
  pattern: { label: 'Pattern', description: 'Individual modules' },
  solid:   { label: 'Solid',   description: 'Solid concentric shapes' },
};

export const FINDER_STYLES = {
  rounded:  { label: 'Rounded',  icon: '▢', description: 'Rounded square' },
  square:   { label: 'Square',   icon: '■', description: 'Sharp square' },
  circle:   { label: 'Circle',   icon: '●', description: 'Circle' },
  diamond:  { label: 'Diamond',  icon: '◆', description: 'Diamond' },
};

// ═════════════════════════════════════════════════
// Gradient Presets
// ═════════════════════════════════════════════════

export const GRADIENT_PRESETS = {
  none: { label: 'None', value: null },
  neonPulse: {
    label: 'Neon Pulse',
    value: { type: 'linear', colors: ['#00d4ff', '#7b2ff7'], angle: 135, stops: [0, 100] },
  },
  sunset: {
    label: 'Sunset',
    value: { type: 'linear', colors: ['#ff6b6b', '#ffd93d'], angle: 180, stops: [0, 100] },
  },
  aurora: {
    label: 'Aurora',
    value: { type: 'linear', colors: ['#00ff88', '#00d4ff', '#7b2ff7'], angle: 135, stops: [0, 50, 100] },
  },
  golden: {
    label: 'Golden',
    value: { type: 'radial', colors: ['#ffd700', '#ff8c00'], stops: [0, 100] },
  },
  ice: {
    label: 'Ice',
    value: { type: 'linear', colors: ['#e0f7ff', '#00aaff'], angle: 180, stops: [0, 100] },
  },
};

// ═════════════════════════════════════════════════
// Default Options
// ═════════════════════════════════════════════════

export const DEFAULT_OPTIONS = {
  // --- Shape & Layout ---
  shapeCategory: 'shield',
  shapeVariation: 'classic',
  shape: null,                 // DEPRECATED – old single-key format
  moduleStyle: 'circle',
  moduleScale: 0.82,
  finderScale: 1.0,
  finderPattern: 'pattern',
  finderOuterStyle: 'rounded',
  finderInnerStyle: 'rounded',

  // --- QR Settings ---
  errorCorrection: 'H',

  // --- Colors ---
  colors: {
    background: '#0a0e27',
    foreground: '#00d4ff',
    outline: '#00d4ff',
    finderOuter: null,
    finderInner: null,
    outlineWidth: 3,
  },

  // --- Gradient ---
  gradient: null,

  // --- Effects ---
  glowEffect: false,
  glowColor: null,
  glowIntensity: 8,

  innerBorder: false,
  innerBorderWidth: 1,
  innerBorderColor: null,
  innerBorderOffset: 8,

  // --- Center Clear ---
  centerClear: false,
  centerSize: 0.22,

  // --- Decorative Fill ---
  decorativeFill: true,
  decorativeDensity: 0.35,
  decorativeOpacity: 0.25,
  decorativeSafeMargin: 6,
  decorativeShieldInset: 8,
  decorativeScale: 0.65,

  // --- Preset ---
  preset: null,
};

/** Default design config for UI components */
export const DEFAULT_DESIGN = {
  shapeCategory: 'shield',
  shapeVariation: 'classic',
  shape: null,
  preset: 'cyber',
  moduleStyle: 'circle',
  moduleScale: 0.82,
  finderScale: 1.0,
  finderPattern: 'pattern',
  finderOuterStyle: 'rounded',
  finderInnerStyle: 'rounded',
  glowEffect: true,
  innerBorder: false,
  centerClear: false,
  centerSize: 0.22,
  decorativeFill: true,
  decorativeDensity: 0.35,
  decorativeOpacity: 0.25,
  decorativeSafeMargin: 6,
  decorativeShieldInset: 8,
  decorativeScale: 0.65,
  gradient: null,
  customColors: null,
};

// ═════════════════════════════════════════════════
// Shape Resolution
// ═════════════════════════════════════════════════

/**
 * Resolve a design config into a concrete shape definition.
 * Handles both the new (shapeCategory + shapeVariation) and old (shape) formats.
 *
 * @param {object} design
 * @returns {{ category: string, variation: string, shape: object }}
 */
export function resolveShape(design) {
  if (design?.shapeCategory && SHAPE_LIBRARY[design.shapeCategory]) {
    const cat = SHAPE_LIBRARY[design.shapeCategory];
    const varKey = design.shapeVariation || Object.keys(cat.variations)[0];
    const shape = cat.variations[varKey] || Object.values(cat.variations)[0];
    return { category: design.shapeCategory, variation: varKey, shape };
  }

  if (design?.shape) {
    if (SHIELD_PATHS[design.shape]) {
      return { category: 'shield', variation: design.shape, shape: SHIELD_PATHS[design.shape] };
    }
    if (SHAPE_LIBRARY[design.shape]) {
      const cat = SHAPE_LIBRARY[design.shape];
      const firstKey = Object.keys(cat.variations)[0];
      return { category: design.shape, variation: firstKey, shape: cat.variations[firstKey] };
    }
  }

  return { category: 'shield', variation: 'classic', shape: SHIELD_PATHS.classic };
}

// ═════════════════════════════════════════════════
// Color Resolution
// ═════════════════════════════════════════════════

/**
 * Resolve a design object into full colors.
 * @param {object} design
 * @returns {object} Color object with background, foreground, outline, etc.
 */
export function resolveColors(design) {
  if (design?.customColors) {
    return { ...design.customColors };
  }
  const preset = COLOR_PRESETS[design?.preset || 'cyber'];
  return preset
    ? {
        background: preset.background,
        foreground: preset.foreground,
        outline: preset.outline,
        finderOuter: preset.finderOuter,
        finderInner: preset.finderInner,
        outlineWidth: preset.outlineWidth,
      }
    : { ...COLOR_PRESETS.cyber };
}

/**
 * Build a serializable design config (for saving/sharing).
 * @param {object} design
 * @returns {object}
 */
export function serializeDesign(design) {
  const out = {
    shapeCategory: design.shapeCategory || 'shield',
    shapeVariation: design.shapeVariation || 'classic',
    moduleStyle: design.moduleStyle || 'circle',
    finderScale: design.finderScale ?? 1.0,
    finderPattern: design.finderPattern || 'pattern',
    finderOuterStyle: design.finderOuterStyle || 'rounded',
    finderInnerStyle: design.finderInnerStyle || 'rounded',
    glowEffect: !!design.glowEffect,
    innerBorder: !!design.innerBorder,
    centerClear: !!design.centerClear,
    decorativeFill: design.decorativeFill ?? true,
    decorativeDensity: design.decorativeDensity || 0.35,
    decorativeOpacity: design.decorativeOpacity ?? 0.25,
    decorativeSafeMargin: design.decorativeSafeMargin ?? 6,
    decorativeShieldInset: design.decorativeShieldInset ?? 8,
    decorativeScale: design.decorativeScale ?? 0.65,
  };

  if (design.preset && !design.customColors) {
    out.preset = design.preset;
  } else if (design.customColors) {
    out.colors = { ...design.customColors };
  }

  if (design.gradient) {
    out.gradient = { ...design.gradient };
  }

  return out;
}

// ═════════════════════════════════════════════════
// Public API - QR Generation
// ═════════════════════════════════════════════════

/**
 * Generate a shaped QR code as an SVG string.
 *
 * @param {string} data       - The data to encode (URL, text, etc.)
 * @param {object} [options]  - Customization options (see DEFAULT_OPTIONS)
 * @returns {Promise<string>} Complete SVG markup
 *
 * @example
 * const svg = await generateShapeQR('https://example.com', {
 *   shapeCategory: 'circle',
 *   shapeVariation: 'squircle',
 *   preset: 'cyber',
 * });
 *
 * @example
 * const svg = await generateShapeQR('https://example.com', {
 *   shapeCategory: 'heart',
 *   shapeVariation: 'classic',
 *   preset: 'fire',
 *   moduleStyle: 'diamond',
 *   glowEffect: true,
 * });
 */
export async function generateShapeQR(data, options = {}) {
  const opts = mergeOptions(DEFAULT_OPTIONS, options);

  // Apply color preset
  if (opts.preset && COLOR_PRESETS[opts.preset]) {
    const p = COLOR_PRESETS[opts.preset];
    opts.colors = {
      ...opts.colors,
      background: p.background,
      foreground: p.foreground,
      outline: p.outline,
      finderOuter: p.finderOuter,
      finderInner: p.finderInner,
      outlineWidth: p.outlineWidth,
    };
  }

  // Resolve shape from the library
  const { shape: shapeDefinition } = resolveShape(opts);

  // Generate QR matrix
  const qrData = QRCode.create(data, { errorCorrectionLevel: opts.errorCorrection });
  const modules = qrData.modules;
  const moduleCount = modules.size;
  const moduleSize = shapeDefinition.qrArea.size / moduleCount;

  return buildSVG(modules, moduleCount, moduleSize, shapeDefinition, opts);
}

/** Legacy alias */
export const generateShieldQR = generateShapeQR;

/**
 * Generate shaped QR as a UTF-8 Buffer (Node.js) or Uint8Array (browser).
 */
export async function generateShapeQRBuffer(data, options = {}) {
  const svg = await generateShapeQR(data, options);
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(svg, 'utf-8');
  }
  return new TextEncoder().encode(svg);
}

export const generateShieldQRBuffer = generateShapeQRBuffer;

/**
 * Generate shaped QR as a base64 data URI.
 */
export async function generateShapeQRDataURI(data, options = {}) {
  const svg = await generateShapeQR(data, options);
  let base64;
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(svg, 'utf-8').toString('base64');
  } else if (typeof btoa !== 'undefined') {
    base64 = btoa(unescape(encodeURIComponent(svg)));
  } else {
    throw new Error('No base64 encoder available');
  }
  return `data:image/svg+xml;base64,${base64}`;
}

export const generateShieldQRDataURI = generateShapeQRDataURI;

// ═════════════════════════════════════════════════
// Library Access API
// ═════════════════════════════════════════════════

/** @returns {object} The full SHAPE_LIBRARY */
export function getShapeLibrary() {
  return SHAPE_LIBRARY;
}

/** @returns {string[]} Available shape category keys */
export function getShapeCategories() {
  return Object.keys(SHAPE_LIBRARY);
}

/** @returns {string[]} Variation keys for a given category */
export function getShapeVariations(category) {
  return SHAPE_LIBRARY[category] ? Object.keys(SHAPE_LIBRARY[category].variations) : [];
}

/** Legacy: returns shield variation names */
export function getShieldShapes() {
  return Object.keys(SHIELD_PATHS);
}

/** @returns {string[]} Color preset names */
export function getColorPresets() {
  return Object.keys(COLOR_PRESETS);
}

/** Get colors for a named preset */
export function getPresetColors(name) {
  return COLOR_PRESETS[name] ? { ...COLOR_PRESETS[name] } : null;
}

/** Legacy: get a shield variation by name */
export function getShieldPath(name) {
  return SHIELD_PATHS[name] ? { ...SHIELD_PATHS[name] } : null;
}

/**
 * Register a custom shape category or add variations to an existing one.
 *
 * @param {string} categoryKey
 * @param {object} categoryDef  - { label, icon, description, variations: { ... } }
 * @param {boolean} [merge=true] - If true, merges variations into existing category
 *
 * @example
 * registerShape('star', {
 *   label: 'Star',
 *   icon: '⭐',
 *   description: 'Star shapes',
 *   variations: {
 *     fivePoint: {
 *       label: '5 Point',
 *       viewBox: '0 0 300 300',
 *       width: 300, height: 300,
 *       path: '...',
 *       qrArea: { x: 60, y: 60, size: 180 },
 *     }
 *   }
 * });
 */
export function registerShape(categoryKey, categoryDef, merge = true) {
  if (merge && SHAPE_LIBRARY[categoryKey]) {
    SHAPE_LIBRARY[categoryKey] = {
      ...SHAPE_LIBRARY[categoryKey],
      ...categoryDef,
      variations: {
        ...SHAPE_LIBRARY[categoryKey].variations,
        ...(categoryDef.variations || {}),
      },
    };
  } else {
    SHAPE_LIBRARY[categoryKey] = categoryDef;
  }
}

// ═════════════════════════════════════════════════
// SVG Builder (internal)
// ═════════════════════════════════════════════════

function buildSVG(modules, moduleCount, moduleSize, shapeDefinition, opts) {
  const { width, height, viewBox, path, qrArea, bare } = shapeDefinition;
  const colors = opts.colors;
  const finderOuter = colors.finderOuter || colors.foreground;
  const finderInner = colors.finderInner || colors.foreground;

  const quietModules = 1.5;
  const quietPx = quietModules * moduleSize;
  const dataOriginX = qrArea.x + quietPx;
  const dataOriginY = qrArea.y + quietPx;
  const dataSize = qrArea.size - quietPx * 2;
  const cellSize = dataSize / moduleCount;

  const svg = [];

  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-label="QR Code">`);

  svg.push('  <defs>');
  svg.push(`    <clipPath id="shapeClip"><path d="${path}"/></clipPath>`);

  if (opts.gradient) {
    svg.push(buildGradientDef(opts.gradient, '    '));
  }

  if (!bare && opts.glowEffect) {
    const gc = opts.glowColor || colors.outline;
    svg.push('    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">');
    svg.push(`      <feGaussianBlur stdDeviation="${opts.glowIntensity}" result="blur"/>`);
    svg.push(`      <feFlood flood-color="${gc}" flood-opacity="0.5" result="color"/>`);
    svg.push('      <feComposite in="color" in2="blur" operator="in" result="shadow"/>');
    svg.push('      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>');
    svg.push('    </filter>');
  }

  svg.push('  </defs>');

  if (bare) {
    svg.push(`  <rect x="0" y="0" width="${width}" height="${height}" fill="${colors.background}"/>`);
  } else {
    const filterAttr = opts.glowEffect ? ' filter="url(#glow)"' : '';
    svg.push(`  <path d="${path}" fill="${colors.background}"${filterAttr}/>`);
  }

  const qzRx = fmt(cellSize * 1.5);
  svg.push(`  <rect x="${fmt(qrArea.x)}" y="${fmt(qrArea.y)}" width="${fmt(qrArea.size)}" height="${fmt(qrArea.size)}" rx="${qzRx}" ry="${qzRx}" fill="${colors.background}" clip-path="url(#shapeClip)"/>`);

  svg.push(bare ? '  <g>' : '  <g clip-path="url(#shapeClip)">');

  const finderPositions = getFinderPatternPositions(moduleCount);
  const fillColor = opts.gradient ? 'url(#qrGradient)' : colors.foreground;

  const qrCenterX = dataOriginX + dataSize / 2;
  const qrCenterY = dataOriginY + dataSize / 2;
  const clearRadius = opts.centerClear ? (dataSize * opts.centerSize) : 0;

  const isBarStyle = opts.moduleStyle === 'barH' || opts.moduleStyle === 'barV';
  const isPondStyle = opts.moduleStyle === 'pond';

  const isCleared = (row, col) => {
    if (!opts.centerClear) return false;
    const x = dataOriginX + col * cellSize;
    const y = dataOriginY + row * cellSize;
    const dx = (x + cellSize / 2) - qrCenterX;
    const dy = (y + cellSize / 2) - qrCenterY;
    return Math.sqrt(dx * dx + dy * dy) < clearRadius;
  };

  // ── Finder patterns ──
  const fScale = opts.finderScale ?? 1.0;
  const fOuterStyle = opts.finderOuterStyle || 'rounded';
  const fInnerStyle = opts.finderInnerStyle || 'rounded';

  if (opts.finderPattern === 'solid') {
    for (const pos of finderPositions) {
      const fpX = dataOriginX + pos.col * cellSize;
      const fpY = dataOriginY + pos.row * cellSize;
      const cxF = fpX + 3.5 * cellSize;
      const cyF = fpY + 3.5 * cellSize;

      const outerSz = 7 * cellSize * fScale;
      const spaceSz = 5 * cellSize * fScale;
      const innerSz = 3 * cellSize * fScale;

      const outerRR = outerSz * 0.15;
      const gap1 = (outerSz - spaceSz) / 2;
      const spaceRR = Math.max(outerRR - gap1, 0);
      const gap2 = (spaceSz - innerSz) / 2;
      const innerRR = Math.max(spaceRR - gap2, 0);

      svg.push('    ' + renderSolidFinderShape(cxF - outerSz / 2, cyF - outerSz / 2, outerSz, fOuterStyle, finderOuter, outerRR));
      svg.push('    ' + renderSolidFinderShape(cxF - spaceSz / 2, cyF - spaceSz / 2, spaceSz, fOuterStyle, colors.background, spaceRR));
      svg.push('    ' + renderSolidFinderShape(cxF - innerSz / 2, cyF - innerSz / 2, innerSz, fInnerStyle, finderInner, innerRR));
    }
  } else {
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (!modules.get(row, col)) continue;
        const finderType = classifyFinderModule(row, col, finderPositions);
        if (!finderType || finderType === 'space') continue;
        const x = dataOriginX + col * cellSize;
        const y = dataOriginY + row * cellSize;
        let modFill = fillColor;
        if (finderType === 'outer') modFill = finderOuter;
        else if (finderType === 'inner') modFill = finderInner;
        svg.push('    ' + renderModule(x, y, cellSize, finderType === 'outer' ? fOuterStyle : fInnerStyle, fScale, modFill));
      }
    }
  }

  // ── Data modules ──
  if (isPondStyle) {
    const inset = cellSize * (1 - opts.moduleScale) / 2;
    const rr = Math.max(inset * 0.85, 0.3);
    const grid = [];
    for (let r = 0; r < moduleCount; r++) {
      grid[r] = [];
      for (let c = 0; c < moduleCount; c++) {
        grid[r][c] = modules.get(r, c) && !classifyFinderModule(r, c, finderPositions) && !isCleared(r, c);
      }
    }
    const gd = (r, c) => r >= 0 && r < moduleCount && c >= 0 && c < moduleCount && grid[r][c];
    const parts = [];
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (!grid[r][c]) continue;
        const x0 = dataOriginX + c * cellSize;
        const y0 = dataOriginY + r * cellSize;
        const tD = gd(r - 1, c), rD = gd(r, c + 1), bD = gd(r + 1, c), lD = gd(r, c - 1);
        const t = tD ? y0 : y0 + inset;
        const ri = rD ? x0 + cellSize : x0 + cellSize - inset;
        const b = bD ? y0 + cellSize : y0 + cellSize - inset;
        const l = lD ? x0 : x0 + inset;
        const tlR = !tD && !lD, trR = !tD && !rD, brR = !bD && !rD, blR = !bD && !lD;
        let d = `M ${fmt(l + (tlR ? rr : 0))} ${fmt(t)}`;
        d += ` H ${fmt(ri - (trR ? rr : 0))}`;
        if (trR) d += ` Q ${fmt(ri)} ${fmt(t)} ${fmt(ri)} ${fmt(t + rr)}`;
        d += ` V ${fmt(b - (brR ? rr : 0))}`;
        if (brR) d += ` Q ${fmt(ri)} ${fmt(b)} ${fmt(ri - rr)} ${fmt(b)}`;
        d += ` H ${fmt(l + (blR ? rr : 0))}`;
        if (blR) d += ` Q ${fmt(l)} ${fmt(b)} ${fmt(l)} ${fmt(b - rr)}`;
        d += ` V ${fmt(t + (tlR ? rr : 0))}`;
        if (tlR) d += ` Q ${fmt(l)} ${fmt(t)} ${fmt(l + rr)} ${fmt(t)}`;
        d += ' Z';
        parts.push(d);
      }
    }
    if (parts.length) {
      svg.push(`    <path d="${parts.join(' ')}" fill="${fillColor}"/>`);
    }
  } else if (isBarStyle) {
    const s = cellSize * opts.moduleScale;
    const halfGap = (cellSize - s) / 2;
    const rr = fmt(s * 0.45);
    if (opts.moduleStyle === 'barH') {
      for (let row = 0; row < moduleCount; row++) {
        let runStart = -1;
        for (let col = 0; col <= moduleCount; col++) {
          const isDark = col < moduleCount && modules.get(row, col);
          const finderType = col < moduleCount ? classifyFinderModule(row, col, finderPositions) : null;
          const shouldConnect = isDark && !finderType && !isCleared(row, col);
          if (shouldConnect) { if (runStart === -1) runStart = col; }
          else if (runStart !== -1) {
            const runLen = col - runStart;
            svg.push(`    <rect x="${fmt(dataOriginX + runStart * cellSize + halfGap)}" y="${fmt(dataOriginY + row * cellSize + halfGap)}" width="${fmt(runLen * cellSize - 2 * halfGap)}" height="${fmt(s)}" rx="${rr}" ry="${rr}" fill="${fillColor}"/>`);
            runStart = -1;
          }
        }
      }
    } else {
      for (let col = 0; col < moduleCount; col++) {
        let runStart = -1;
        for (let row = 0; row <= moduleCount; row++) {
          const isDark = row < moduleCount && modules.get(row, col);
          const finderType = row < moduleCount ? classifyFinderModule(row, col, finderPositions) : null;
          const shouldConnect = isDark && !finderType && !isCleared(row, col);
          if (shouldConnect) { if (runStart === -1) runStart = row; }
          else if (runStart !== -1) {
            const runLen = row - runStart;
            svg.push(`    <rect x="${fmt(dataOriginX + col * cellSize + halfGap)}" y="${fmt(dataOriginY + runStart * cellSize + halfGap)}" width="${fmt(s)}" height="${fmt(runLen * cellSize - 2 * halfGap)}" rx="${rr}" ry="${rr}" fill="${fillColor}"/>`);
            runStart = -1;
          }
        }
      }
    }
  } else {
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (!modules.get(row, col)) continue;
        if (isCleared(row, col)) continue;
        const finderType = classifyFinderModule(row, col, finderPositions);
        if (finderType) continue;
        const x = dataOriginX + col * cellSize;
        const y = dataOriginY + row * cellSize;
        svg.push('    ' + renderModule(x, y, cellSize, opts.moduleStyle, opts.moduleScale, fillColor));
      }
    }
  }

  svg.push('  </g>');

  // ── Decorative fill ──
  if (!bare && opts.decorativeFill) {
    const safeMargin = opts.decorativeSafeMargin ?? 6;
    const shieldInset = opts.decorativeShieldInset ?? 8;
    const density = opts.decorativeDensity || 0.35;
    const opacity = opts.decorativeOpacity ?? 0.25;
    const decoFill = opts.gradient ? colors.foreground : fillColor;
    const decoSize = cellSize;
    const decoScale = opts.decorativeScale ?? 0.65;

    const exclLeft = qrArea.x - safeMargin;
    const exclTop = qrArea.y - safeMargin;
    const exclRight = qrArea.x + qrArea.size + safeMargin;
    const exclBottom = qrArea.y + qrArea.size + safeMargin;

    const insetSx = ((width - shieldInset * 2) / width).toFixed(4);
    const insetSy = ((height - shieldInset * 2) / height).toFixed(4);
    svg.push(`  <clipPath id="shapeClipInset"><path d="${path}" transform="translate(${shieldInset},${shieldInset}) scale(${insetSx},${insetSy})"/></clipPath>`);
    svg.push(`  <g clip-path="url(#shapeClipInset)" opacity="${opacity}">`);

    const dCols = Math.ceil(width / decoSize);
    const dRows = Math.ceil(height / decoSize);
    const decoGrid = [];
    for (let dr = 0; dr < dRows; dr++) {
      decoGrid[dr] = [];
      for (let dc = 0; dc < dCols; dc++) {
        const gx = dc * decoSize;
        const gy = dr * decoSize;
        const cx = gx + decoSize / 2;
        const cy = gy + decoSize / 2;
        if (cx >= exclLeft && cx <= exclRight && cy >= exclTop && cy <= exclBottom) {
          decoGrid[dr][dc] = false;
          continue;
        }
        const hash = ((Math.imul(gx * 2654435761 | 0, gy * 2246822519 | 0)) >>> 0) / 4294967296;
        decoGrid[dr][dc] = hash <= density;
      }
    }

    if (opts.moduleStyle === 'pond') {
      const pInset = decoSize * (1 - decoScale) / 2;
      const pRR = Math.max(pInset * 0.85, 0.3);
      const dgd = (r, c) => r >= 0 && r < dRows && c >= 0 && c < dCols && decoGrid[r][c];
      const parts = [];
      for (let r = 0; r < dRows; r++) {
        for (let c = 0; c < dCols; c++) {
          if (!decoGrid[r][c]) continue;
          const x0 = c * decoSize, y0 = r * decoSize;
          const tD = dgd(r - 1, c), rD = dgd(r, c + 1), bD = dgd(r + 1, c), lD = dgd(r, c - 1);
          const t = tD ? y0 : y0 + pInset;
          const ri = rD ? x0 + decoSize : x0 + decoSize - pInset;
          const b = bD ? y0 + decoSize : y0 + decoSize - pInset;
          const l = lD ? x0 : x0 + pInset;
          const tlR = !tD && !lD, trR = !tD && !rD, brR = !bD && !rD, blR = !bD && !lD;
          let d = `M ${fmt(l + (tlR ? pRR : 0))} ${fmt(t)}`;
          d += ` H ${fmt(ri - (trR ? pRR : 0))}`;
          if (trR) d += ` Q ${fmt(ri)} ${fmt(t)} ${fmt(ri)} ${fmt(t + pRR)}`;
          d += ` V ${fmt(b - (brR ? pRR : 0))}`;
          if (brR) d += ` Q ${fmt(ri)} ${fmt(b)} ${fmt(ri - pRR)} ${fmt(b)}`;
          d += ` H ${fmt(l + (blR ? pRR : 0))}`;
          if (blR) d += ` Q ${fmt(l)} ${fmt(b)} ${fmt(l)} ${fmt(b - pRR)}`;
          d += ` V ${fmt(t + (tlR ? pRR : 0))}`;
          if (tlR) d += ` Q ${fmt(l)} ${fmt(t)} ${fmt(l + pRR)} ${fmt(t)}`;
          d += ' Z';
          parts.push(d);
        }
      }
      if (parts.length) svg.push(`    <path d="${parts.join(' ')}" fill="${decoFill}"/>`);
    } else if (opts.moduleStyle === 'barH') {
      const s = decoSize * decoScale;
      const halfGap = (decoSize - s) / 2;
      const bRR = fmt(s * 0.45);
      for (let dr = 0; dr < dRows; dr++) {
        let runStart = -1;
        for (let dc = 0; dc <= dCols; dc++) {
          if (dc < dCols && decoGrid[dr][dc]) { if (runStart === -1) runStart = dc; }
          else if (runStart !== -1) {
            const len = dc - runStart;
            svg.push(`    <rect x="${fmt(runStart * decoSize + halfGap)}" y="${fmt(dr * decoSize + halfGap)}" width="${fmt(len * decoSize - 2 * halfGap)}" height="${fmt(s)}" rx="${bRR}" ry="${bRR}" fill="${decoFill}"/>`);
            runStart = -1;
          }
        }
      }
    } else if (opts.moduleStyle === 'barV') {
      const s = decoSize * decoScale;
      const halfGap = (decoSize - s) / 2;
      const bRR = fmt(s * 0.45);
      for (let dc = 0; dc < dCols; dc++) {
        let runStart = -1;
        for (let dr = 0; dr <= dRows; dr++) {
          if (dr < dRows && decoGrid[dr][dc]) { if (runStart === -1) runStart = dr; }
          else if (runStart !== -1) {
            const len = dr - runStart;
            svg.push(`    <rect x="${fmt(dc * decoSize + halfGap)}" y="${fmt(runStart * decoSize + halfGap)}" width="${fmt(s)}" height="${fmt(len * decoSize - 2 * halfGap)}" rx="${bRR}" ry="${bRR}" fill="${decoFill}"/>`);
            runStart = -1;
          }
        }
      }
    } else {
      for (let dr = 0; dr < dRows; dr++) {
        for (let dc = 0; dc < dCols; dc++) {
          if (!decoGrid[dr][dc]) continue;
          svg.push('    ' + renderModule(dc * decoSize, dr * decoSize, decoSize, opts.moduleStyle, decoScale, decoFill));
        }
      }
    }

    svg.push('  </g>');
  }

  if (!bare) {
    if (opts.innerBorder) {
      const ibColor = opts.innerBorderColor || colors.outline;
      const off = opts.innerBorderOffset;
      const sx = (width - off * 2) / width;
      const sy = (height - off * 2) / height;
      svg.push(`  <path d="${path}" fill="none" stroke="${ibColor}" stroke-width="${opts.innerBorderWidth}" opacity="0.35" transform="translate(${off},${off}) scale(${sx.toFixed(4)},${sy.toFixed(4)})"/>`);
    }
    svg.push(`  <path d="${path}" fill="none" stroke="${colors.outline}" stroke-width="${colors.outlineWidth}" stroke-linejoin="round"/>`);
  }

  svg.push('</svg>');
  return svg.join('\n');
}

// ═════════════════════════════════════════════════
// Module Renderers (internal)
// ═════════════════════════════════════════════════

function renderSolidFinderShape(x, y, size, style, fill, cornerRadius) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  switch (style) {
    case 'circle':
    case 'dot':
      return `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" fill="${fill}"/>`;
    case 'rounded':
    case 'roundedSquare': {
      const rr = (cornerRadius !== undefined ? Math.max(cornerRadius, 0) : size * 0.15).toFixed(2);
      return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(size)}" height="${fmt(size)}" rx="${rr}" ry="${rr}" fill="${fill}"/>`;
    }
    case 'diamond': {
      const pts = [
        `${fmt(cx)},${fmt(cy - r)}`,
        `${fmt(cx + r)},${fmt(cy)}`,
        `${fmt(cx)},${fmt(cy + r)}`,
        `${fmt(cx - r)},${fmt(cy)}`,
      ].join(' ');
      return `<polygon points="${pts}" fill="${fill}"/>`;
    }
    case 'square':
    default:
      return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(size)}" height="${fmt(size)}" fill="${fill}"/>`;
  }
}

function renderModule(x, y, size, style, scale, fill) {
  const s = size * scale;
  const offset = (size - s) / 2;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = s / 2;

  switch (style) {
    case 'circle':
    case 'dot':
      return `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" fill="${fill}"/>`;
    case 'rounded':
    case 'roundedSquare': {
      const rr = (s * 0.35).toFixed(2);
      return `<rect x="${fmt(x + offset)}" y="${fmt(y + offset)}" width="${fmt(s)}" height="${fmt(s)}" rx="${rr}" ry="${rr}" fill="${fill}"/>`;
    }
    case 'diamond': {
      const pts = [
        `${fmt(cx)},${fmt(cy - r)}`,
        `${fmt(cx + r)},${fmt(cy)}`,
        `${fmt(cx)},${fmt(cy + r)}`,
        `${fmt(cx - r)},${fmt(cy)}`,
      ].join(' ');
      return `<polygon points="${pts}" fill="${fill}"/>`;
    }
    case 'square':
    default:
      return `<rect x="${fmt(x + offset)}" y="${fmt(y + offset)}" width="${fmt(s)}" height="${fmt(s)}" fill="${fill}"/>`;
  }
}

function fmt(n) {
  return Number(n.toFixed(2));
}

// ═════════════════════════════════════════════════
// Finder Pattern Detection (internal)
// ═════════════════════════════════════════════════

function getFinderPatternPositions(moduleCount) {
  return [
    { row: 0, col: 0 },
    { row: 0, col: moduleCount - 7 },
    { row: moduleCount - 7, col: 0 },
  ];
}

function classifyFinderModule(row, col, positions) {
  for (const pos of positions) {
    if (row >= pos.row && row < pos.row + 7 && col >= pos.col && col < pos.col + 7) {
      const lr = row - pos.row;
      const lc = col - pos.col;
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return 'outer';
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return 'inner';
      return 'space';
    }
  }
  return null;
}

// ═════════════════════════════════════════════════
// Gradient Builder (internal)
// ═════════════════════════════════════════════════

function buildGradientDef(gradient, indent = '') {
  const { type, colors, angle = 135, stops } = gradient;

  const stopElements = colors.map((color, i) => {
    const pct = stops ? stops[i] : Math.round((i / (colors.length - 1)) * 100);
    return `${indent}  <stop offset="${pct}%" stop-color="${color}"/>`;
  }).join('\n');

  if (type === 'radial') {
    return [
      `${indent}<radialGradient id="qrGradient" cx="50%" cy="50%" r="60%">`,
      stopElements,
      `${indent}</radialGradient>`,
    ].join('\n');
  }

  const rad = ((angle - 90) * Math.PI) / 180;
  const x1 = Math.round(50 + Math.sin(rad + Math.PI) * 50);
  const y1 = Math.round(50 + Math.cos(rad + Math.PI) * 50);
  const x2 = Math.round(50 + Math.sin(rad) * 50);
  const y2 = Math.round(50 + Math.cos(rad) * 50);

  return [
    `${indent}<linearGradient id="qrGradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">`,
    stopElements,
    `${indent}</linearGradient>`,
  ].join('\n');
}

// ═════════════════════════════════════════════════
// Utility (internal)
// ═════════════════════════════════════════════════

function mergeOptions(defaults, overrides) {
  const result = { ...defaults };
  for (const key of Object.keys(overrides)) {
    if (overrides[key] === undefined) continue;
    if (overrides[key] !== null && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = mergeOptions(defaults[key] || {}, overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}

// ═════════════════════════════════════════════════
// Default Export
// ═════════════════════════════════════════════════

export default {
  // Generation
  generateShapeQR,
  generateShapeQRBuffer,
  generateShapeQRDataURI,
  generateShieldQR,
  generateShieldQRBuffer,
  generateShieldQRDataURI,
  // Library access
  getShapeLibrary,
  getShapeCategories,
  getShapeVariations,
  getShieldShapes,
  getColorPresets,
  getPresetColors,
  getShieldPath,
  registerShape,
  resolveShape,
  resolveColors,
  serializeDesign,
  // Constants
  SHAPE_LIBRARY,
  SHIELD_PATHS,
  COLOR_PRESETS,
  MODULE_STYLES,
  FINDER_PATTERNS,
  FINDER_STYLES,
  GRADIENT_PRESETS,
  DEFAULT_OPTIONS,
  DEFAULT_DESIGN,
};
