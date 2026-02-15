import { useState } from 'react';
import { Copy, Check, BookOpen, Terminal, Code2, Layers, Palette, Shapes, Zap, Box, FileJson } from 'lucide-react';

function CodeBlock({ code, language = 'javascript', title }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-white/5 rounded-t-xl">
          <span className="text-xs font-semibold text-gray-400">{title}</span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">{language}</span>
        </div>
      )}
      <pre className={`bg-gray-900/80 border border-gray-700/50 ${title ? 'rounded-b-xl' : 'rounded-xl'} p-4 overflow-x-auto`}>
        <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">{code}</code>
      </pre>
      <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
      </button>
    </div>
  );
}

function DocSection({ id, icon: Icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-4 text-gray-400 leading-relaxed">{children}</div>
    </section>
  );
}

function PropTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Property</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Default</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{row.prop}</td>
              <td className="py-3 px-4 font-mono text-gray-500 text-xs">{row.type}</td>
              <td className="py-3 px-4 font-mono text-gray-600 text-xs">{row.default}</td>
              <td className="py-3 px-4 text-gray-400 text-xs">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'install', icon: Terminal, label: 'Installation' },
  { id: 'quickstart', icon: Zap, label: 'Quick Start' },
  { id: 'shapes', icon: Shapes, label: 'Shapes' },
  { id: 'presets', icon: Palette, label: 'Color Presets' },
  { id: 'modules', icon: Box, label: 'Module Styles' },
  { id: 'options', icon: Layers, label: 'All Options' },
  { id: 'sticker', icon: Layers, label: 'Sticker Designer' },
  { id: 'useconfig', icon: FileJson, label: 'Using Design Config' },
  { id: 'api', icon: Code2, label: 'API Reference' },
  { id: 'frameworks', icon: BookOpen, label: 'Framework Guides' },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('install');

  return (
    <section id="docs" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Documentation</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to generate beautiful shaped QR codes in your project.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <nav className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-1">
              {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === id ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="lg:col-span-3 space-y-16">

            {/* INSTALLATION */}
            <DocSection id="install" icon={Terminal} title="Installation">
              <CodeBlock code="npm install shield-qr-styler" language="bash" title="npm" />
              <CodeBlock code="yarn add shield-qr-styler" language="bash" title="yarn" />
              <CodeBlock code="pnpm add shield-qr-styler" language="bash" title="pnpm" />
              <p>The package has one dependency: <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">qrcode</code> for QR matrix generation. It works in Node.js, browsers (via bundlers), and edge runtimes.</p>
            </DocSection>

            {/* QUICK START */}
            <DocSection id="quickstart" icon={Zap} title="Quick Start">
              <CodeBlock title="Basic Usage" code={`import { generateShapeQR } from 'shield-qr-styler';

// Generate a shield-shaped QR code
const svg = await generateShapeQR('https://example.com', {
  shapeCategory: 'shield',
  shapeVariation: 'classic',
  preset: 'cyber',
});

// Insert into DOM
document.getElementById('qr').innerHTML = svg;`} />

              <CodeBlock title="Node.js / Server-Side" code={`import { generateShapeQR } from 'shield-qr-styler';
import fs from 'fs';

const svg = await generateShapeQR('https://example.com', {
  shapeCategory: 'heart',
  shapeVariation: 'classic',
  preset: 'fire',
  moduleStyle: 'diamond',
  glowEffect: true,
});

fs.writeFileSync('qr.svg', svg);`} />

              <CodeBlock title="As Data URI" code={`import { generateShapeQRDataURI } from 'shield-qr-styler';

const dataUri = await generateShapeQRDataURI('https://example.com', {
  shapeCategory: 'circle',
  shapeVariation: 'squircle',
  preset: 'ocean',
});

// Use in an <img> tag
// <img src={dataUri} alt="QR Code" />`} />
            </DocSection>

            {/* SHAPES */}
            <DocSection id="shapes" icon={Shapes} title="Shapes">
              <p>The library offers 9 shape categories, each with multiple variations. Use the two-level hierarchy to select your shape:</p>

              <CodeBlock code={`const svg = await generateShapeQR('https://example.com', {
  shapeCategory: 'hexagon',  // Category
  shapeVariation: 'rounded', // Variation within category
});`} />

              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'none', type: 'default', default: '-', desc: 'Plain QR code with no shape border' },
                  { prop: 'square', type: 'sharp, rounded, pill', default: '-', desc: 'Square shapes with corner variations' },
                  { prop: 'rectangle', type: 'portrait, landscape, ticket', default: '-', desc: 'Rectangular shapes with decorative notches' },
                  { prop: 'circle', type: 'perfect, squircle', default: '-', desc: 'Circular and iOS-icon squircle shapes' },
                  { prop: 'oval', type: 'vertical, horizontal', default: '-', desc: 'Elliptical shapes in both orientations' },
                  { prop: 'diamond', type: 'classic, soft', default: '-', desc: 'Diamond / rhombus shapes' },
                  { prop: 'heart', type: 'classic, rounded', default: '-', desc: 'Heart shapes for special occasions' },
                  { prop: 'hexagon', type: 'sharp, rounded', default: '-', desc: 'Six-sided shapes' },
                  { prop: 'shield', type: 'classic, badge, modern, emblem', default: '-', desc: 'Protective shield shapes (4 variations)' },
                ]} />
              </div>

              <CodeBlock title="Querying Available Shapes" code={`import { getShapeCategories, getShapeVariations, getShapeLibrary } from 'shield-qr-styler';

// Get all category keys
const categories = getShapeCategories();
// ['none', 'square', 'rectangle', 'circle', 'oval', 'diamond', 'heart', 'hexagon', 'shield']

// Get variations for a category
const shieldVariations = getShapeVariations('shield');
// ['classic', 'badge', 'modern', 'emblem']

// Get the full library with metadata
const library = getShapeLibrary();
// { shield: { label: 'Shield', icon: '🛡️', variations: { ... } }, ... }`} />

              <CodeBlock title="Register Custom Shapes" code={`import { registerShape } from 'shield-qr-styler';

registerShape('star', {
  label: 'Star',
  icon: '⭐',
  description: 'Star shapes',
  variations: {
    fivePoint: {
      label: '5 Point',
      description: 'Classic five-pointed star',
      viewBox: '0 0 300 300',
      width: 300, height: 300,
      path: 'M 150 10 L 190 110 L 290 110 L 210 175 L 240 280 L 150 220 L 60 280 L 90 175 L 10 110 L 110 110 Z',
      qrArea: { x: 65, y: 70, size: 170 },
    },
  },
});`} />
            </DocSection>

            {/* COLOR PRESETS */}
            <DocSection id="presets" icon={Palette} title="Color Presets">
              <p>7 built-in color presets, or use fully custom colors.</p>

              <CodeBlock code={`// Using a preset
const svg = await generateShapeQR('https://example.com', {
  preset: 'royal', // cyber, stealth, royal, military, fire, ocean, monochrome
});

// Using custom colors
const svg2 = await generateShapeQR('https://example.com', {
  colors: {
    background: '#1a0a3e',
    foreground: '#c9a0ff',
    outline: '#ffd700',
    finderOuter: '#ffd700',
    finderInner: '#c9a0ff',
    outlineWidth: 3,
  },
});`} />

              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'cyber', type: 'preset', default: '-', desc: 'Neon cyan on navy blue (dark)' },
                  { prop: 'stealth', type: 'preset', default: '-', desc: 'Grey on black, minimal (dark)' },
                  { prop: 'royal', type: 'preset', default: '-', desc: 'Purple & gold, luxurious (dark)' },
                  { prop: 'military', type: 'preset', default: '-', desc: 'Green on olive, tactical (dark)' },
                  { prop: 'fire', type: 'preset', default: '-', desc: 'Red & orange, bold (dark)' },
                  { prop: 'ocean', type: 'preset', default: '-', desc: 'Blue tones, professional (dark)' },
                  { prop: 'monochrome', type: 'preset', default: '-', desc: 'Classic black on white (light)' },
                ]} />
              </div>

              <CodeBlock title="Gradient Support" code={`const svg = await generateShapeQR('https://example.com', {
  preset: 'cyber',
  gradient: {
    type: 'linear',        // 'linear' or 'radial'
    colors: ['#00d4ff', '#7b2ff7'],
    angle: 135,            // for linear only
    stops: [0, 100],       // percentage stops
  },
});`} />
            </DocSection>

            {/* MODULE STYLES */}
            <DocSection id="modules" icon={Box} title="Module Styles">
              <p>7 different module rendering styles for QR code dots.</p>
              <CodeBlock code={`const svg = await generateShapeQR('https://example.com', {
  moduleStyle: 'pond',    // circle, roundedSquare, diamond, square, barH, barV, pond
  moduleScale: 0.82,       // 0.5 - 1.0 (size of each module)
});`} />

              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'circle', type: 'style', default: '(default)', desc: 'Circular dots' },
                  { prop: 'roundedSquare', type: 'style', default: '-', desc: 'Rounded squares' },
                  { prop: 'diamond', type: 'style', default: '-', desc: 'Diamond shapes' },
                  { prop: 'square', type: 'style', default: '-', desc: 'Sharp pixel squares' },
                  { prop: 'barH', type: 'style', default: '-', desc: 'Horizontal connected bars' },
                  { prop: 'barV', type: 'style', default: '-', desc: 'Vertical connected bars' },
                  { prop: 'pond', type: 'style', default: '-', desc: 'Connected organic blobs (water-drop effect)' },
                ]} />
              </div>

              <CodeBlock title="Finder Pattern Customization" code={`const svg = await generateShapeQR('https://example.com', {
  finderPattern: 'solid',      // 'pattern' (per-module) or 'solid' (concentric shapes)
  finderOuterStyle: 'rounded', // 'rounded', 'square', 'circle', 'diamond'
  finderInnerStyle: 'circle',  // 'rounded', 'square', 'circle', 'diamond'
  finderScale: 1.0,            // 0.5 - 1.0
});`} />
            </DocSection>

            {/* ALL OPTIONS */}
            <DocSection id="options" icon={Layers} title="All Options">
              <p>Complete reference of all available options for <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">generateShapeQR()</code>.</p>

              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'shapeCategory', type: 'string', default: "'shield'", desc: 'Shape category (none, square, rectangle, circle, oval, diamond, heart, hexagon, shield)' },
                  { prop: 'shapeVariation', type: 'string', default: "'classic'", desc: 'Variation within the chosen category' },
                  { prop: 'preset', type: 'string | null', default: 'null', desc: 'Color preset name (cyber, stealth, royal, military, fire, ocean, monochrome)' },
                  { prop: 'moduleStyle', type: 'string', default: "'circle'", desc: 'Module rendering style' },
                  { prop: 'moduleScale', type: 'number', default: '0.82', desc: 'Module size (0.5 - 1.0)' },
                  { prop: 'finderScale', type: 'number', default: '1.0', desc: 'Finder pattern module scale (0.5 - 1.0)' },
                  { prop: 'finderPattern', type: 'string', default: "'pattern'", desc: "'pattern' or 'solid'" },
                  { prop: 'finderOuterStyle', type: 'string', default: "'rounded'", desc: 'Outer finder shape style' },
                  { prop: 'finderInnerStyle', type: 'string', default: "'rounded'", desc: 'Inner finder dot style' },
                  { prop: 'errorCorrection', type: 'string', default: "'H'", desc: 'QR error correction level (L, M, Q, H)' },
                  { prop: 'colors', type: 'object', default: '{ ... }', desc: 'Custom color configuration object' },
                  { prop: 'gradient', type: 'object | null', default: 'null', desc: 'Gradient configuration ({ type, colors, angle, stops })' },
                  { prop: 'glowEffect', type: 'boolean', default: 'false', desc: 'Enable outer glow effect on shape' },
                  { prop: 'glowColor', type: 'string | null', default: 'null', desc: 'Glow color (defaults to outline color)' },
                  { prop: 'glowIntensity', type: 'number', default: '8', desc: 'Glow blur radius' },
                  { prop: 'innerBorder', type: 'boolean', default: 'false', desc: 'Show inner border inside shape' },
                  { prop: 'innerBorderWidth', type: 'number', default: '1', desc: 'Inner border stroke width' },
                  { prop: 'innerBorderColor', type: 'string | null', default: 'null', desc: 'Inner border color' },
                  { prop: 'innerBorderOffset', type: 'number', default: '8', desc: 'Inner border offset from shape edge' },
                  { prop: 'centerClear', type: 'boolean', default: 'false', desc: 'Clear center area for logo' },
                  { prop: 'centerSize', type: 'number', default: '0.22', desc: 'Center clear radius (fraction of QR size)' },
                  { prop: 'decorativeFill', type: 'boolean', default: 'true', desc: 'Fill shape background with decorative dots' },
                  { prop: 'decorativeDensity', type: 'number', default: '0.35', desc: 'Decorative fill density (0 - 1)' },
                  { prop: 'decorativeOpacity', type: 'number', default: '0.25', desc: 'Decorative fill opacity' },
                  { prop: 'decorativeScale', type: 'number', default: '0.65', desc: 'Decorative dot size (0.1 - 1.0)' },
                  { prop: 'decorativeSafeMargin', type: 'number', default: '6', desc: 'Gap between QR data and decorative fill (px)' },
                  { prop: 'decorativeShieldInset', type: 'number', default: '8', desc: 'Inset from shape edge for decorative fill (px)' },
                ]} />
              </div>
            </DocSection>

            {/* STICKER DESIGNER */}
            <DocSection id="sticker" icon={Layers} title="Sticker / Container Designer">
              <p>Wrap your QR code inside styled containers with custom shapes, borders, and curved text. The sticker designer provides an outer container, an inner container, curved top/bottom text, and QR positioning controls.</p>

              <CodeBlock title="Quick Start — Sticker Frame SVG" code={`import {
  STICKER_DEFAULTS,
  computeStickerGeometry,
  generateStickerFrameSVG,
} from 'shield-qr-styler';

// Use defaults or customise
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

// Get geometry for positioning the QR code
const geo = computeStickerGeometry(config);
// geo.qrOffsetPctX, geo.qrOffsetPctY, geo.qrSizePctW, geo.qrSizePctH

// Generate the sticker frame as an SVG string
const frameSVG = generateStickerFrameSVG(config, 'my-sticker');
// Returns a full <svg> element string with containers, borders, and curved text`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Sticker Config Properties</h4>

              <h5 className="text-base font-semibold text-gray-300 mt-6 mb-2">Outer Container</h5>
              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'showOuterContainer', type: 'boolean', default: 'true', desc: 'Toggle outer container visibility' },
                  { prop: 'outerShape', type: 'string', default: "'circle'", desc: "Shape: 'circle', 'square', 'portrait', 'landscape', 'shield'" },
                  { prop: 'outerShieldVariant', type: 'string', default: "'classic'", desc: "Shield style when outerShape is 'shield': 'classic', 'badge', 'modern', 'emblem'" },
                  { prop: 'outerCornerRadius', type: 'number', default: '20', desc: 'Corner radius for rect-based shapes (SVG units)' },
                  { prop: 'outerBgColor', type: 'string', default: "'#1f2937'", desc: 'Outer container background color' },
                  { prop: 'outerBorderWidth', type: 'number', default: '6', desc: 'Outer container border width (0 to disable)' },
                  { prop: 'outerBorderColor', type: 'string', default: "'#d4af37'", desc: 'Outer container border color' },
                  { prop: 'outerBorderStyle', type: 'string', default: "'solid'", desc: "Border style: 'solid', 'dashed', 'dotted'" },
                ]} />
              </div>

              <h5 className="text-base font-semibold text-gray-300 mt-6 mb-2">Inner Container</h5>
              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'showInnerContainer', type: 'boolean', default: 'true', desc: 'Toggle inner container visibility' },
                  { prop: 'innerShape', type: 'string', default: "'circle'", desc: "Shape: 'circle', 'square', 'portrait', 'landscape', 'shield'" },
                  { prop: 'innerShieldVariant', type: 'string', default: "'classic'", desc: "Shield style when innerShape is 'shield'" },
                  { prop: 'innerCornerRadius', type: 'number', default: '16', desc: 'Corner radius for rect-based shapes (SVG units)' },
                  { prop: 'innerBgColor', type: 'string', default: "'#ffffff'", desc: 'Inner container background color' },
                  { prop: 'innerSizeRatio', type: 'number', default: '0.58', desc: 'Inner container size relative to outer (0.3 – 0.8)' },
                  { prop: 'innerBorderWidth', type: 'number', default: '4', desc: 'Inner container border width' },
                  { prop: 'innerBorderColor', type: 'string', default: "'#d4af37'", desc: 'Inner container border color' },
                  { prop: 'innerBorderStyle', type: 'string', default: "'solid'", desc: "Border style: 'solid', 'dashed', 'dotted'" },
                  { prop: 'qrPadding', type: 'number', default: '0.12', desc: 'QR code padding inside the inner container (ratio)' },
                ]} />
              </div>

              <h5 className="text-base font-semibold text-gray-300 mt-6 mb-2">Text</h5>
              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'topTitle', type: 'string', default: "'SHIELDQR'", desc: 'Curved text along the top arc' },
                  { prop: 'bottomMessage', type: 'string', default: "'SCAN TO CONNECT'", desc: 'Curved text along the bottom arc' },
                  { prop: 'textColor', type: 'string', default: "'#ffffff'", desc: 'Color for both top and bottom text' },
                  { prop: 'titleFontSize', type: 'number', default: '32', desc: 'Top title font size (SVG units)' },
                  { prop: 'titleLetterSpacing', type: 'number', default: '6', desc: 'Top title letter spacing' },
                  { prop: 'titleFontWeight', type: 'number', default: '700', desc: 'Top title font weight' },
                  { prop: 'messageFontSize', type: 'number', default: '20', desc: 'Bottom message font size' },
                  { prop: 'messageLetterSpacing', type: 'number', default: '3', desc: 'Bottom message letter spacing' },
                  { prop: 'messageFontWeight', type: 'number', default: '600', desc: 'Bottom message font weight' },
                  { prop: 'fontFamily', type: 'string', default: "'Arial, Helvetica, sans-serif'", desc: 'Font family for both texts' },
                  { prop: 'topTextRadiusOffset', type: 'number', default: '0', desc: 'Top text curvature: 0 = flat, positive = natural curve up, negative = inverted' },
                  { prop: 'bottomTextRadiusOffset', type: 'number', default: '0', desc: 'Bottom text curvature: 0 = flat, positive = natural curve down, negative = inverted' },
                  { prop: 'topTextDy', type: 'number', default: '0', desc: 'Top text vertical shift (SVG units, negative = up)' },
                  { prop: 'bottomTextDy', type: 'number', default: '0', desc: 'Bottom text vertical shift (SVG units, negative = up)' },
                ]} />
              </div>

              <h5 className="text-base font-semibold text-gray-300 mt-6 mb-2">QR Sizing & Position</h5>
              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'qrZoom', type: 'number', default: '1.0', desc: 'QR code zoom level (0.5 – 3.0)' },
                  { prop: 'qrOffsetX', type: 'number', default: '0', desc: 'Horizontal offset of the QR code (SVG units)' },
                  { prop: 'qrOffsetY', type: 'number', default: '0', desc: 'Vertical offset of the QR code (SVG units)' },
                ]} />
              </div>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Available Container Shapes</h4>
              <div className="glass-panel overflow-hidden">
                <PropTable rows={[
                  { prop: 'circle', type: 'shape', default: '-', desc: 'Round container' },
                  { prop: 'square', type: 'shape', default: '-', desc: 'Square with optional rounded corners' },
                  { prop: 'portrait', type: 'shape', default: '-', desc: 'Tall rectangle (3:4 aspect ratio)' },
                  { prop: 'landscape', type: 'shape', default: '-', desc: 'Wide rectangle (4:3 aspect ratio)' },
                  { prop: 'shield', type: 'shape', default: '-', desc: 'Shield outline — uses STICKER_SHIELD_VARIANTS (classic, badge, modern, emblem)' },
                ]} />
              </div>

              <CodeBlock title="Geometry Helper" code={`import { computeStickerGeometry } from 'shield-qr-styler';

const geo = computeStickerGeometry(config);
// Returns:
// {
//   canvasW, canvasH,           — SVG canvas dimensions
//   centerX, centerY,           — center point
//   outerHalfW, outerHalfH,     — outer container half-dimensions
//   innerHalfW, innerHalfH,     — inner container half-dimensions
//   textRadius,                  — radius for curved text paths
//   qrSize,                      — computed QR side length
//   qrSizePctW, qrSizePctH,    — QR size as % of canvas
//   qrOffsetPctX, qrOffsetPctY, — QR position as % of canvas
//   aspect,                      — current aspect ratio
// }`} />

              <CodeBlock title="CSS Wrapper Border Radius" code={`import { getStickerWrapperBorderRadius } from 'shield-qr-styler';

// Get CSS border-radius for the outer wrapper div
const borderRadius = getStickerWrapperBorderRadius(config, displayW, displayH);
// Returns: '50%' for circle, '0' for shield, or a percentage string for rect shapes`} />

              <CodeBlock title="Shield Transform Helper" code={`import { stickerShieldTransform } from 'shield-qr-styler';

// Get the SVG path and transform for rendering a shield variant
const { path, transform } = stickerShieldTransform('classic', cx, cy, halfW, halfH);
// Use in: <path d={path} transform={transform} />`} />

              <CodeBlock title="Full Example — React Sticker Component" code={`import { useMemo } from 'react';
import { generateShapeQR } from 'shield-qr-styler';
import {
  STICKER_DEFAULTS,
  computeStickerGeometry,
  generateStickerFrameSVG,
  getStickerWrapperBorderRadius,
} from 'shield-qr-styler';

function QRSticker({ url, qrDesign, stickerConfig }) {
  const cfg = { ...STICKER_DEFAULTS, ...stickerConfig };
  const geo = computeStickerGeometry(cfg);
  const frameSVG = generateStickerFrameSVG(cfg, 'sticker-1');

  const wrapperStyle = {
    position: 'relative',
    width: 300,
    aspectRatio: geo.canvasW + ' / ' + geo.canvasH,
    borderRadius: getStickerWrapperBorderRadius(cfg, 300, 300 * (geo.canvasH / geo.canvasW)),
    overflow: 'hidden',
  };

  return (
    <div style={wrapperStyle}>
      {/* Sticker frame */}
      <div style={{ position: 'absolute', inset: 0 }}
           dangerouslySetInnerHTML={{ __html: frameSVG }} />
      {/* QR code */}
      <div style={{
        position: 'absolute',
        left: geo.qrOffsetPctX + '%',
        top: geo.qrOffsetPctY + '%',
        width: geo.qrSizePctW + '%',
        height: geo.qrSizePctH + '%',
      }}>
        <QRPreview value={url} design={qrDesign} />
      </div>
    </div>
  );
}`} />
            </DocSection>

            {/* USING DESIGN CONFIG */}
            <DocSection id="useconfig" icon={FileJson} title="Using the Design Config">
              <p>The playground lets you <strong className="text-white">Copy</strong> or <strong className="text-white">Download</strong> the full design config as JSON. Here's how to use it in your code.</p>

              <p className="text-sm">The exported JSON has this structure:</p>
              <CodeBlock language="json" code={`{
  "qrValue": "https://qr-styler.vercel.app",
  "qrDesign": { /* QR styling options */ },
  "stickerConfig": { /* sticker/container options — present when sticker is enabled */ }
}`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">QR Code Only (no sticker)</h4>
              <p className="text-sm">Pass <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">qrDesign</code> directly as the options to <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">generateShapeQR()</code>:</p>

              <CodeBlock title="Browser / Node.js" code={`import { generateShapeQR } from 'shield-qr-styler';

// Paste the copied config
const config = {
  "qrValue": "https://qr-styler.vercel.app",
  "qrDesign": { "shapeCategory": "shield", "preset": "cyber", /* ... */ }
};

const svg = await generateShapeQR(config.qrValue, config.qrDesign);

// Insert into DOM
document.getElementById('qr').innerHTML = svg;

// Or save to file (Node.js)
// import fs from 'fs';
// fs.writeFileSync('qr-code.svg', svg);`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">QR Code + Sticker Frame</h4>
              <p className="text-sm">When <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">stickerConfig</code> is present, use the sticker functions to wrap the QR code inside styled containers:</p>

              <CodeBlock title="Browser — HTML Composition" code={`import {
  generateShapeQR,
  computeStickerGeometry,
  generateStickerFrameSVG,
} from 'shield-qr-styler';

// Paste the copied config
const config = { "qrValue": "...", "qrDesign": { ... }, "stickerConfig": { ... } };

// 1. Generate the QR SVG
const qrSvg = await generateShapeQR(config.qrValue, config.qrDesign);

// 2. Generate the sticker frame
const frameSvg = generateStickerFrameSVG(config.stickerConfig, 'my-qr');

// 3. Get geometry to position the QR inside the frame
const geo = computeStickerGeometry(config.stickerConfig);
const sc = config.stickerConfig;

// 4. Compose them together
document.getElementById('sticker').innerHTML = \`
  <div style="
    position: relative;
    width: 400px;
    aspect-ratio: \${geo.canvasW} / \${geo.canvasH};
    overflow: hidden;
  ">
    <div style="position: absolute; inset: 0">\${frameSvg}</div>
    <div style="
      position: absolute;
      left: \${geo.qrOffsetPctX + (sc.qrOffsetX / geo.canvasW) * 100}%;
      top: \${geo.qrOffsetPctY + (sc.qrOffsetY / geo.canvasH) * 100}%;
      width: \${geo.qrSizePctW}%;
      height: \${geo.qrSizePctH}%;
    ">\${qrSvg}</div>
  </div>
\`;`} />

              <CodeBlock title="Node.js — Composite SVG File" code={`import {
  generateShapeQR,
  computeStickerGeometry,
  generateStickerFrameSVG,
} from 'shield-qr-styler';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('qr-design-config.json', 'utf-8'));

// Generate QR
const qrSvg = await generateShapeQR(config.qrValue, config.qrDesign);

if (config.stickerConfig) {
  const geo = computeStickerGeometry(config.stickerConfig);
  const frame = generateStickerFrameSVG(config.stickerConfig, 'export');

  // Extract inner content from both SVGs
  const frameInner = frame.replace(/^<svg[^>]*>/, '').replace(/<\\/svg>$/, '');
  const vbMatch = qrSvg.match(/viewBox="([^"]+)"/);
  const qrViewBox = vbMatch ? vbMatch[1] : '0 0 ' + geo.qrSize + ' ' + geo.qrSize;
  const qrInner = qrSvg.replace(/^<svg[^>]*>/, '').replace(/<\\/svg>$/, '');

  const sc = config.stickerConfig;
  const qrX = (geo.qrOffsetPctX / 100) * geo.canvasW + (sc.qrOffsetX || 0);
  const qrY = (geo.qrOffsetPctY / 100) * geo.canvasH + (sc.qrOffsetY || 0);
  const qrW = (geo.qrSizePctW / 100) * geo.canvasW;
  const qrH = (geo.qrSizePctH / 100) * geo.canvasH;

  const composite = '<svg xmlns="http://www.w3.org/2000/svg" '
    + 'viewBox="0 0 ' + geo.canvasW + ' ' + geo.canvasH + '">'
    + frameInner
    + '<svg x="' + qrX + '" y="' + qrY + '" width="' + qrW + '" '
    + 'height="' + qrH + '" viewBox="' + qrViewBox + '">'
    + qrInner + '</svg></svg>';

  fs.writeFileSync('qr-sticker.svg', composite);
} else {
  fs.writeFileSync('qr-code.svg', qrSvg);
}`} />

              <CodeBlock title="React Component" code={`import { useState, useEffect, useMemo } from 'react';
import {
  generateShapeQR,
  computeStickerGeometry,
  generateStickerFrameSVG,
} from 'shield-qr-styler';

function QRFromConfig({ config }) {
  const [qrSvg, setQrSvg] = useState('');

  useEffect(() => {
    generateShapeQR(config.qrValue, config.qrDesign).then(setQrSvg);
  }, [config.qrValue, config.qrDesign]);

  // If no sticker, render QR only
  if (!config.stickerConfig) {
    return <div dangerouslySetInnerHTML={{ __html: qrSvg }} />;
  }

  const geo = computeStickerGeometry(config.stickerConfig);
  const frame = generateStickerFrameSVG(config.stickerConfig, 'cfg-qr');
  const sc = config.stickerConfig;

  return (
    <div style={{
      position: 'relative',
      width: 400,
      aspectRatio: geo.canvasW + ' / ' + geo.canvasH,
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}
           dangerouslySetInnerHTML={{ __html: frame }} />
      <div style={{
        position: 'absolute',
        left: geo.qrOffsetPctX + (sc.qrOffsetX / geo.canvasW) * 100 + '%',
        top: geo.qrOffsetPctY + (sc.qrOffsetY / geo.canvasH) * 100 + '%',
        width: geo.qrSizePctW + '%',
        height: geo.qrSizePctH + '%',
      }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
    </div>
  );
}`} />
            </DocSection>

            {/* API REFERENCE */}
            <DocSection id="api" icon={Code2} title="API Reference">
              <h4 className="text-lg font-bold text-white mt-6 mb-3">Core Functions</h4>

              <CodeBlock title="generateShapeQR(data, options?)" code={`// Returns: Promise<string> (SVG markup)
const svg = await generateShapeQR('https://example.com', { preset: 'cyber' });`} />

              <CodeBlock title="generateShapeQRBuffer(data, options?)" code={`// Returns: Promise<Buffer | Uint8Array>
// Node.js: Buffer, Browser: Uint8Array
const buffer = await generateShapeQRBuffer('https://example.com');`} />

              <CodeBlock title="generateShapeQRDataURI(data, options?)" code={`// Returns: Promise<string> (data:image/svg+xml;base64,...)
const uri = await generateShapeQRDataURI('https://example.com');`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Library Access</h4>

              <CodeBlock code={`import {
  // QR library access
  getShapeLibrary,     // Full library object
  getShapeCategories,  // ['none', 'square', ...]
  getShapeVariations,  // ('shield') => ['classic', 'badge', ...]
  getColorPresets,     // ['cyber', 'stealth', ...]
  getPresetColors,     // ('cyber') => { background, foreground, ... }
  registerShape,       // Add custom shapes at runtime
  resolveShape,        // Resolve design config to shape definition
  resolveColors,       // Resolve design config to color values

  // Sticker designer functions
  migrateStickerConfig,          // (rawCfg) => cfg — backward-compat key migration
  computeStickerGeometry,        // (cfg) => StickerGeometry — dimensions, positions, radii
  generateStickerFrameSVG,       // (cfg, uid) => string — full <svg> frame markup
  getStickerWrapperBorderRadius, // (cfg, w, h) => string — CSS border-radius
  stickerShieldTransform,        // (variant, cx, cy, halfW, halfH) => { path, transform }
} from 'shield-qr-styler';`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Constants</h4>

              <CodeBlock code={`import {
  // QR design constants
  SHAPE_LIBRARY,     // Full shape definitions
  COLOR_PRESETS,     // Color preset definitions with metadata
  MODULE_STYLES,     // Module style definitions with icons
  FINDER_PATTERNS,   // Finder pattern mode definitions
  FINDER_STYLES,     // Finder shape style definitions
  GRADIENT_PRESETS,  // Gradient preset definitions
  DEFAULT_OPTIONS,   // Default generation options
  DEFAULT_DESIGN,    // Default design config for UI components

  // Sticker designer constants
  STICKER_SHAPES,           // Available container shapes { circle, square, portrait, landscape, shield }
  STICKER_SHIELD_VARIANTS,  // Shield variants { classic, badge, modern, emblem } with SVG path data
  STICKER_DEFAULTS,         // Full default sticker configuration object
} from 'shield-qr-styler';`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">TypeScript</h4>
              <p>Full TypeScript declarations are included. Key types:</p>

              <CodeBlock language="typescript" code={`import type {
  // QR types
  GenerateOptions,
  DesignConfig,
  ShapeCategory,
  ShapeVariation,
  ColorPreset,
  GradientConfig,
  ResolvedShape,

  // Sticker types
  StickerShapeInfo,     // { label, icon, aspect }
  StickerShieldVariant, // { path, origW, origH, label, description }
  StickerConfig,        // Full sticker configuration interface
  StickerGeometry,      // Return type of computeStickerGeometry()
} from 'shield-qr-styler';`} />
            </DocSection>

            {/* FRAMEWORK GUIDES */}
            <DocSection id="frameworks" icon={BookOpen} title="Framework Guides">

              <h4 className="text-lg font-bold text-white mt-2 mb-3">React</h4>
              <CodeBlock title="React Component" code={`import { useState, useEffect } from 'react';
import { generateShapeQR } from 'shield-qr-styler';

function QRCode({ url, options }) {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    generateShapeQR(url, options).then(setSvg);
  }, [url, options]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Usage
<QRCode
  url="https://example.com"
  options={{
    shapeCategory: 'shield',
    shapeVariation: 'classic',
    preset: 'cyber',
    glowEffect: true,
  }}
/>`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Vue</h4>
              <CodeBlock title="Vue 3 Composition API" code={`<script setup>
import { ref, watchEffect } from 'vue';
import { generateShapeQR } from 'shield-qr-styler';

const svg = ref('');
const url = ref('https://example.com');

watchEffect(async () => {
  svg.value = await generateShapeQR(url.value, {
    shapeCategory: 'heart',
    preset: 'fire',
  });
});
</script>

<template>
  <div v-html="svg" />
</template>`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Svelte</h4>
              <CodeBlock title="Svelte Component" code={`<script>
  import { generateShapeQR } from 'shield-qr-styler';

  let svg = '';
  let url = 'https://example.com';

  $: generateShapeQR(url, {
    shapeCategory: 'hexagon',
    preset: 'military',
  }).then(result => svg = result);
</script>

{@html svg}`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Next.js (Server Component)</h4>
              <CodeBlock title="Next.js Server Component" code={`// app/qr/page.jsx (Server Component)
import { generateShapeQR } from 'shield-qr-styler';

export default async function QRPage() {
  const svg = await generateShapeQR('https://example.com', {
    shapeCategory: 'shield',
    preset: 'royal',
    moduleStyle: 'roundedSquare',
  });

  return (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
  );
}`} />

              <h4 className="text-lg font-bold text-white mt-8 mb-3">Express / Node.js API</h4>
              <CodeBlock title="Express Endpoint" code={`import express from 'express';
import { generateShapeQR } from 'shield-qr-styler';

const app = express();

app.get('/api/qr', async (req, res) => {
  const { url, shape, preset } = req.query;

  const svg = await generateShapeQR(url || 'https://example.com', {
    shapeCategory: shape || 'shield',
    preset: preset || 'cyber',
  });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.listen(3000);`} />

            </DocSection>
          </div>
        </div>
      </div>
    </section>
  );
}
