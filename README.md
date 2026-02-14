# Shield QR Styler

Generate beautifully shaped, customizable QR codes as SVG. Framework-agnostic, works in Node.js, browsers, and edge runtimes.

[![npm](https://img.shields.io/npm/v/shield-qr-styler)](https://www.npmjs.com/package/shield-qr-styler)
![license](https://img.shields.io/npm/l/shield-qr-styler)
![bundle size](https://img.shields.io/bundlephobia/minzip/shield-qr-styler)

**[Live Demo & Playground](https://qr-styler.vercel.app/)** | **[Documentation](https://qr-styler.vercel.app/#docs)** | **[npm](https://www.npmjs.com/package/shield-qr-styler)**

> Try the interactive playground at [qr-styler.vercel.app](https://qr-styler.vercel.app/) - customize shapes, colors, module styles, gradients, and effects in real-time, then download as SVG or PNG.

## Features

- **22+ Shape Variations** - Shield, heart, hexagon, circle, diamond, oval, square, rectangle, and more
- **7 Color Presets** - Cyber, stealth, royal, military, fire, ocean, monochrome
- **7 Module Styles** - Circle, rounded, diamond, square, horizontal bars, vertical bars, pond (organic blobs)
- **Gradient Support** - Linear and radial gradients with preset options
- **Effects** - Glow, inner borders, center clear (logo area), decorative fill
- **Finder Customization** - Pattern/solid mode with 4 shape styles
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

## Finder Pattern Customization

```javascript
const svg = await generateShapeQR(url, {
  finderPattern: 'solid',       // 'pattern' or 'solid'
  finderOuterStyle: 'rounded',  // 'rounded', 'square', 'circle', 'diamond'
  finderInnerStyle: 'circle',
  finderScale: 1.0,
});
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
  getShapeLibrary,      // () => full shape library object
  getShapeCategories,   // () => string[]
  getShapeVariations,   // (category) => string[]
  getColorPresets,      // () => string[]
  getPresetColors,      // (name) => ColorPreset | null
  registerShape,        // (key, definition, merge?) => void
  resolveShape,         // (design) => { category, variation, shape }
  resolveColors,        // (design) => { background, foreground, ... }
} from 'shield-qr-styler';
```

### Constants

```javascript
import {
  SHAPE_LIBRARY,      // Full shape definitions
  COLOR_PRESETS,       // Color preset definitions
  MODULE_STYLES,       // Module style metadata
  FINDER_PATTERNS,     // Finder pattern modes
  FINDER_STYLES,       // Finder shape styles
  GRADIENT_PRESETS,    // Gradient preset definitions
  DEFAULT_OPTIONS,     // Default generation options
  DEFAULT_DESIGN,      // Default UI design config
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
  GenerateOptions,
  DesignConfig,
  ShapeCategory,
  ShapeVariation,
  ColorPreset,
  GradientConfig,
} from 'shield-qr-styler';
```

## License

MIT
