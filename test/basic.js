/**
 * Basic smoke test for shield-qr-styler
 */

import {
  generateShapeQR,
  generateShapeQRDataURI,
  getShapeCategories,
  getShapeVariations,
  getColorPresets,
  getPresetColors,
  getShapeLibrary,
  resolveShape,
  resolveColors,
  registerShape,
  SHAPE_LIBRARY,
  COLOR_PRESETS,
  MODULE_STYLES,
  DEFAULT_OPTIONS,
  DEFAULT_DESIGN,
} from '../src/index.js';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${msg}`);
  } else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

async function run() {
  console.log('\n--- Shield QR Styler Tests ---\n');

  // Constants
  console.log('Constants:');
  assert(Object.keys(SHAPE_LIBRARY).length >= 9, 'SHAPE_LIBRARY has 9+ categories');
  assert(Object.keys(COLOR_PRESETS).length === 7, 'COLOR_PRESETS has 7 presets');
  assert(Object.keys(MODULE_STYLES).length === 7, 'MODULE_STYLES has 7 styles');
  assert(DEFAULT_OPTIONS.shapeCategory === 'shield', 'DEFAULT_OPTIONS has shield as default');
  assert(DEFAULT_DESIGN.preset === 'cyber', 'DEFAULT_DESIGN has cyber as default preset');

  // Library access
  console.log('\nLibrary Access:');
  const categories = getShapeCategories();
  assert(categories.includes('shield'), 'getShapeCategories includes shield');
  assert(categories.includes('heart'), 'getShapeCategories includes heart');

  const shieldVars = getShapeVariations('shield');
  assert(shieldVars.includes('classic'), 'Shield has classic variation');
  assert(shieldVars.includes('badge'), 'Shield has badge variation');
  assert(shieldVars.length === 4, 'Shield has 4 variations');

  const presets = getColorPresets();
  assert(presets.includes('cyber'), 'getColorPresets includes cyber');
  assert(presets.length === 7, '7 color presets');

  const cyberColors = getPresetColors('cyber');
  assert(cyberColors.background === '#0a0e27', 'Cyber background is #0a0e27');
  assert(cyberColors.foreground === '#00d4ff', 'Cyber foreground is #00d4ff');

  // Shape resolution
  console.log('\nShape Resolution:');
  const resolved = resolveShape({ shapeCategory: 'heart', shapeVariation: 'classic' });
  assert(resolved.category === 'heart', 'Resolves heart category');
  assert(resolved.variation === 'classic', 'Resolves classic variation');
  assert(resolved.shape.viewBox === '0 0 300 280', 'Heart has correct viewBox');

  // Legacy shape resolution
  const legacyResolved = resolveShape({ shape: 'badge' });
  assert(legacyResolved.category === 'shield', 'Legacy badge resolves to shield category');
  assert(legacyResolved.variation === 'badge', 'Legacy badge resolves correctly');

  // Color resolution
  console.log('\nColor Resolution:');
  const colors = resolveColors({ preset: 'royal' });
  assert(colors.background === '#1a0a3e', 'Royal background resolved');
  assert(colors.foreground === '#c9a0ff', 'Royal foreground resolved');

  // Custom shape registration
  console.log('\nCustom Shapes:');
  registerShape('test', {
    label: 'Test',
    icon: 'T',
    description: 'Test shape',
    variations: {
      basic: {
        label: 'Basic',
        description: 'Basic test',
        viewBox: '0 0 100 100',
        width: 100, height: 100,
        path: 'M 0 0 H 100 V 100 H 0 Z',
        qrArea: { x: 5, y: 5, size: 90 },
      },
    },
  });
  assert(SHAPE_LIBRARY.test !== undefined, 'Custom shape registered');
  assert(getShapeCategories().includes('test'), 'Custom shape appears in categories');

  // SVG Generation
  console.log('\nSVG Generation:');

  const svg1 = await generateShapeQR('https://example.com');
  assert(svg1.includes('<svg'), 'Default SVG generated');
  assert(svg1.includes('</svg>'), 'SVG is complete');
  assert(svg1.includes('viewBox'), 'SVG has viewBox');

  const svg2 = await generateShapeQR('https://example.com', {
    shapeCategory: 'heart',
    shapeVariation: 'classic',
    preset: 'fire',
    moduleStyle: 'diamond',
  });
  assert(svg2.includes('<svg'), 'Heart+fire SVG generated');
  assert(svg2.includes('<polygon'), 'Diamond modules use polygon');

  const svg3 = await generateShapeQR('https://example.com', {
    shapeCategory: 'circle',
    shapeVariation: 'squircle',
    preset: 'ocean',
    moduleStyle: 'pond',
    glowEffect: true,
    decorativeFill: true,
  });
  assert(svg3.includes('filter'), 'Glow effect present');
  assert(svg3.includes('shapeClipInset'), 'Decorative fill clip present');

  // Bar styles
  const svg4 = await generateShapeQR('https://example.com', { moduleStyle: 'barH' });
  assert(svg4.includes('<svg'), 'barH style generates SVG');

  const svg5 = await generateShapeQR('https://example.com', { moduleStyle: 'barV' });
  assert(svg5.includes('<svg'), 'barV style generates SVG');

  // Gradient
  const svg6 = await generateShapeQR('https://example.com', {
    gradient: { type: 'linear', colors: ['#ff0000', '#0000ff'], angle: 45, stops: [0, 100] },
  });
  assert(svg6.includes('linearGradient'), 'Linear gradient present');

  // Data URI
  const uri = await generateShapeQRDataURI('https://example.com', { preset: 'cyber' });
  assert(uri.startsWith('data:image/svg+xml;base64,'), 'Data URI format correct');

  // None (bare) shape
  const svgBare = await generateShapeQR('https://example.com', { shapeCategory: 'none' });
  assert(!svgBare.includes('filter'), 'Bare shape has no glow');
  assert(!svgBare.includes('stroke-linejoin'), 'Bare shape has no outline');

  // Summary
  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
