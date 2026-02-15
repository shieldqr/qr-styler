# Shield QR Styler

Generate beautifully shaped, customizable QR codes as SVG. Framework-agnostic, works in Node.js, browsers, and edge runtimes.

[![npm](https://img.shields.io/npm/v/shield-qr-styler)](https://www.npmjs.com/package/shield-qr-styler)
![license](https://img.shields.io/npm/l/shield-qr-styler)
![bundle size](https://img.shields.io/bundlephobia/minzip/shield-qr-styler)

**[Live Demo & Playground](https://qr-styler.vercel.app/)** | **[Documentation](https://qr-styler.vercel.app/#docs)** | **[npm](https://www.npmjs.com/package/shield-qr-styler)** | **[GitHub](https://github.com/shieldqr/qr-styler)**

> Try the interactive playground at [qr-styler.vercel.app](https://qr-styler.vercel.app/) - customize shapes, colors, module styles, gradients, and effects in real-time, then download as SVG or PNG.

## Features

- **22+ Shape Variations** - Shield, heart, hexagon, circle, diamond, oval, square, rectangle, and more
- **7 Color Presets** - Cyber, stealth, royal, military, fire, ocean, monochrome
- **7 Module Styles** - Circle, rounded, diamond, square, horizontal bars, vertical bars, pond (organic blobs)
- **Gradient Support** - Linear and radial gradients with preset options
- **Effects** - Glow, inner borders, center clear (logo area), decorative fill
- **Finder Customization** - Pattern/solid mode with 4 shape styles
- **Sticker / Container Designer** - Wrap QR codes in styled outer & inner containers with curved text
- **5 Container Shapes** - Circle, square, portrait, landscape, and shield (4 shield variants)
- **Extensible** - Register custom shapes at runtime
- **SVG Output** - Clean, scalable vector graphics
- **Isomorphic** - Works in Node.js, browsers, and edge runtimes
- **TypeScript** - Full type declarations included
- **Zero DOM Dependencies** - Pure computation, no canvas required

## Installation

```bash
npm install shield-qr-styler
```

## Quick Start

```javascript
import { generateShapeQR } from 'shield-qr-styler';

const svg = await generateShapeQR('https://example.com', {
  shapeCategory: 'shield',
  shapeVariation: 'classic',
  preset: 'cyber',
});

// svg is a complete SVG string ready to use
document.getElementById('qr').innerHTML = svg;
```

## Shape Categories

| Category    | Variations                          | Description                    |
|-------------|-------------------------------------|--------------------------------|
| `none`      | default                             | Plain QR with no shape border  |
| `square`    | sharp, rounded, pill                | Square with corner variations  |
| `rectangle` | portrait, landscape, ticket         | Rectangular with notch options |
| `circle`    | perfect, squircle                   | Circle and iOS-icon squircle   |
| `oval`      | vertical, horizontal                | Elliptical shapes              |
| `diamond`   | classic, soft                       | Diamond / rhombus              |
| `heart`     | classic, rounded                    | Heart shapes                   |
| `hexagon`   | sharp, rounded                      | Six-sided shapes               |
| `shield`    | classic, badge, modern, emblem      | Shield shapes (4 variations)   |

## Color Presets

```javascript
// Use a named preset
const svg = await generateShapeQR(url, { preset: 'royal' });
```

| Preset       | Description                  |
|--------------|------------------------------|
| `cyber`      | Neon cyan on navy            |
| `stealth`    | Grey on black, minimal       |
| `royal`      | Purple & gold, luxurious     |
| `military`   | Green on olive, tactical     |
| `fire`       | Red & orange, bold           |
| `ocean`      | Blue tones, professional     |
| `monochrome` | Classic black on white       |

## Module Styles

```javascript
const svg = await generateShapeQR(url, {
  moduleStyle: 'pond',  // organic connected blobs
  moduleScale: 0.82,    // dot size (0.5 - 1.0)
});
```

Options: `circle`, `roundedSquare`, `diamond`, `square`, `barH`, `barV`, `pond`

## Gradients

```javascript
const svg = await generateShapeQR(url, {
  gradient: {
    type: 'linear',
    colors: ['#00d4ff', '#7b2ff7'],
    angle: 135,
    stops: [0, 100],
  },
});
```

## Effects

```javascript
const svg = await generateShapeQR(url, {
  glowEffect: true,          // Outer glow
  innerBorder: true,          // Inner border line
  centerClear: true,          // Clear center for logo
  centerSize: 0.22,           // Logo area size
  decorativeFill: true,       // Scatter dots in empty areas
  decorativeDensity: 0.35,    // Fill density
  decorativeOpacity: 0.25,    // Fill opacity
});
```

## Custom Colors

```javascript
const svg = await generateShapeQR(url, {
  colors: {
    background: '#1a0a3e',
    foreground: '#c9a0ff',
    outline: '#ffd700',
    finderOuter: '#ffd700',
    finderInner: '#c9a0ff',
    outlineWidth: 3,
  },
});
```

### Transparent Background

Set `background` to `'transparent'` so the QR code inherits the background of its parent container:

```javascript
const svg = await generateShapeQR(url, {
  colors: {
    background: 'transparent',
    foreground: '#00d4ff',
    outline: '#00d4ff',
  },
});
```

This renders the QR with no background fill, making it perfect for placing over images, gradients, or any colored surface. Finder pattern gaps are rendered as true cutouts so the parent background shows through correctly.

## Finder Pattern Customization

```javascript
const svg = await generateShapeQR(url, {
  finderPattern: 'solid',       // 'pattern' or 'solid'
  finderOuterStyle: 'rounded',  // 'rounded', 'square', 'circle', 'diamond'
  finderInnerStyle: 'circle',
  finderScale: 1.0,
});
```

## Sticker / Container Designer

Wrap your QR code inside styled containers with custom shapes, borders, and curved text.

### Quick Start

```javascript
import {
  STICKER_DEFAULTS,
  computeStickerGeometry,
  generateStickerFrameSVG,
} from 'shield-qr-styler';

const config = {
  ...STICKER_DEFAULTS,
  outerShape: 'shield',
  outerShieldVariant: 'classic',
  innerShape: 'shield',
  innerShieldVariant: 'classic',
  innerSizeRatio: 0.72,
  topTitle: 'SHIELDQR',
  bottomMessage: 'SCAN TO CONNECT',
};

// Compute geometry for QR positioning
const geo = computeStickerGeometry(config);

// Generate the sticker frame as a full SVG string
const frameSVG = generateStickerFrameSVG(config, 'my-sticker');
```

### Container Shapes

| Shape       | Description                                          |
|-------------|------------------------------------------------------|
| `circle`    | Round container                                      |
| `square`    | Square with optional rounded corners                 |
| `portrait`  | Tall rectangle (3:4 aspect ratio)                    |
| `landscape` | Wide rectangle (4:3 aspect ratio)                    |
| `shield`    | Shield outline — classic, badge, modern, emblem      |

### Sticker Config Properties

```javascript
const config = {
  // Outer container
  showOuterContainer: true,
  outerShape: 'circle',          // circle | square | portrait | landscape | shield
  outerShieldVariant: 'classic', // classic | badge | modern | emblem (when outerShape is 'shield')
  outerCornerRadius: 20,         // rect-based shapes only (SVG units)
  outerBgColor: '#1f2937',
  outerBorderWidth: 6,
  outerBorderColor: '#d4af37',
  outerBorderStyle: 'solid',     // solid | dashed | dotted

  // Inner container
  showInnerContainer: true,
  innerShape: 'circle',
  innerShieldVariant: 'classic',
  innerCornerRadius: 16,
  innerBgColor: '#ffffff',
  innerSizeRatio: 0.58,          // 0.3 – 0.8 relative to outer
  innerBorderWidth: 4,
  innerBorderColor: '#d4af37',
  innerBorderStyle: 'solid',

  // Text
  topTitle: 'SHIELDQR',
  bottomMessage: 'SCAN TO CONNECT',
  textColor: '#ffffff',
  titleFontSize: 32,
  titleLetterSpacing: 6,
  titleFontWeight: 700,
  messageFontSize: 20,
  messageLetterSpacing: 3,
  messageFontWeight: 600,
  fontFamily: 'Arial, Helvetica, sans-serif',

  // Text curvature: 0 = flat, positive = natural curve, negative = inverted
  topTextRadiusOffset: 0,
  bottomTextRadiusOffset: 0,
  topTextDy: 0,       // vertical shift
  bottomTextDy: 0,

  // QR sizing
  qrPadding: 0.12,    // padding inside inner container (ratio)
  qrZoom: 1.0,        // 0.5 – 3.0
  qrOffsetX: 0,       // horizontal offset (SVG units)
  qrOffsetY: 0,       // vertical offset (SVG units)
};
```

### Sticker Geometry

```javascript
const geo = computeStickerGeometry(config);
// Returns: {
//   canvasW, canvasH,           — SVG canvas dimensions
//   centerX, centerY,           — center point
//   outerHalfW, outerHalfH,     — outer container half-dimensions
//   innerHalfW, innerHalfH,     — inner container half-dimensions
//   textRadius,                  — radius for curved text paths
//   qrSize,                      — computed QR side length
//   qrSizePctW, qrSizePctH,    — QR size as % of canvas
//   qrOffsetPctX, qrOffsetPctY, — QR position as % of canvas
//   aspect,                      — current aspect ratio
// }
```

### Sticker Helper Functions

```javascript
import {
  getStickerWrapperBorderRadius, // (config, displayW, displayH) => CSS border-radius string
  stickerShieldTransform,        // (variant, cx, cy, halfW, halfH) => { path, transform }
  migrateStickerConfig,          // (rawConfig) => config — backward-compat key migration
} from 'shield-qr-styler';
```

## API Reference

### Core Functions

```javascript
import {
  generateShapeQR,          // (data, options?) => Promise<string>
  generateShapeQRBuffer,    // (data, options?) => Promise<Buffer | Uint8Array>
  generateShapeQRDataURI,   // (data, options?) => Promise<string>
} from 'shield-qr-styler';
```

### Library Access

```javascript
import {
  // QR library
  getShapeLibrary,      // () => full shape library object
  getShapeCategories,   // () => string[]
  getShapeVariations,   // (category) => string[]
  getColorPresets,      // () => string[]
  getPresetColors,      // (name) => ColorPreset | null
  registerShape,        // (key, definition, merge?) => void
  resolveShape,         // (design) => { category, variation, shape }
  resolveColors,        // (design) => { background, foreground, ... }

  // Sticker designer
  migrateStickerConfig,          // backward-compat config migration
  computeStickerGeometry,        // compute dimensions and positions
  generateStickerFrameSVG,       // generate full SVG frame string
  getStickerWrapperBorderRadius, // CSS border-radius for wrapper div
  stickerShieldTransform,        // SVG path + transform for shield shapes
} from 'shield-qr-styler';
```

### Constants

```javascript
import {
  // QR design
  SHAPE_LIBRARY,      // Full shape definitions
  COLOR_PRESETS,       // Color preset definitions
  MODULE_STYLES,       // Module style metadata
  FINDER_PATTERNS,     // Finder pattern modes
  FINDER_STYLES,       // Finder shape styles
  GRADIENT_PRESETS,    // Gradient preset definitions
  DEFAULT_OPTIONS,     // Default generation options
  DEFAULT_DESIGN,      // Default UI design config

  // Sticker designer
  STICKER_SHAPES,           // Available container shapes
  STICKER_SHIELD_VARIANTS,  // Shield variants with SVG path data
  STICKER_DEFAULTS,         // Default sticker configuration
} from 'shield-qr-styler';
```

### Custom Shapes

```javascript
import { registerShape, generateShapeQR } from 'shield-qr-styler';

registerShape('star', {
  label: 'Star',
  icon: '⭐',
  description: 'Star shapes',
  variations: {
    fivePoint: {
      label: '5 Point',
      viewBox: '0 0 300 300',
      width: 300, height: 300,
      path: 'M 150 10 L 190 110 ...',
      qrArea: { x: 65, y: 70, size: 170 },
    },
  },
});

const svg = await generateShapeQR(url, {
  shapeCategory: 'star',
  shapeVariation: 'fivePoint',
});
```

## Framework Examples

### React

```jsx
import { useState, useEffect } from 'react';
import { generateShapeQR } from 'shield-qr-styler';

function QRCode({ url, options }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    generateShapeQR(url, options).then(setSvg);
  }, [url, options]);
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### Next.js Server Component

```jsx
import { generateShapeQR } from 'shield-qr-styler';

export default async function QRPage() {
  const svg = await generateShapeQR('https://example.com', {
    shapeCategory: 'shield',
    preset: 'royal',
  });
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### Express API

```javascript
import express from 'express';
import { generateShapeQR } from 'shield-qr-styler';

const app = express();

app.get('/api/qr', async (req, res) => {
  const svg = await generateShapeQR(req.query.url, {
    shapeCategory: req.query.shape || 'shield',
    preset: req.query.preset || 'cyber',
  });
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});
```

## TypeScript

Full type declarations are included:

```typescript
import type {
  // QR types
  GenerateOptions,
  DesignConfig,
  ShapeCategory,
  ShapeVariation,
  ColorPreset,
  GradientConfig,

  // Sticker types
  StickerShapeInfo,     // { label, icon, aspect }
  StickerShieldVariant, // { path, origW, origH, label, description }
  StickerConfig,        // Full sticker configuration
  StickerGeometry,      // Return type of computeStickerGeometry()
} from 'shield-qr-styler';
```

## License

MIT
