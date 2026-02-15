import { useState, useCallback, useMemo } from 'react';
import { Download, RotateCcw, Sparkles, Palette, Grid3X3, Shapes, Type, Square, Move, Copy, Check, FileJson } from 'lucide-react';
import QRPreview from './QRPreview';
import {
  SHAPE_LIBRARY,
  COLOR_PRESETS,
  MODULE_STYLES,
  FINDER_PATTERNS,
  FINDER_STYLES,
  GRADIENT_PRESETS,
  DEFAULT_DESIGN,
  resolveShape,
  STICKER_SHAPES,
  STICKER_SHIELD_VARIANTS,
  STICKER_DEFAULTS,
  computeStickerGeometry,
  generateStickerFrameSVG,
  getStickerWrapperBorderRadius,
} from 'shield-qr-styler';

// ─── Reusable UI helpers ─────────────────────────

function SectionHeader({ icon: Icon, label, open, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
      <span className="flex items-center gap-2 text-sm font-bold text-gray-200">
        <Icon className="h-4 w-4 text-cyan-400" />{label}
      </span>
      <span className="text-gray-500 text-xs">{open ? '−' : '+'}</span>
    </button>
  );
}

function ShapeThumbnail({ path, viewBox, className = '' }) {
  return (
    <svg viewBox={viewBox} className={`w-8 h-10 ${className}`}>
      <path d={path} fill="currentColor" opacity="0.2" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}

function SliderRow({ label, value, onChange, min, max, step = 1, unit = '', displayValue }) {
  return (
    <div>
      <label className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-1.5">
        <span>{label}</span><span>{displayValue ?? `${value}${unit}`}</span>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-semibold text-gray-400 w-24 flex-shrink-0">{label}</label>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-transparent" />
      <span className="text-xs font-mono text-gray-500">{value}</span>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <div>
        <span className="text-sm font-semibold text-gray-300">{label}</span>
        {description && <p className="text-[11px] text-gray-500">{description}</p>}
      </div>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-10 h-5 bg-gray-700 peer-checked:bg-cyan-500 rounded-full transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
      </div>
    </label>
  );
}

const STICKER_SHAPE_OPTIONS = Object.entries(STICKER_SHAPES).map(([k, v]) => ({ value: k, label: v.label, icon: v.icon }));

// ─── Main component ─────────────────────────────

export default function PlaygroundSection() {
  const [qrValue, setQrValue] = useState('https://qr-styler.vercel.app');
  const [design, setDesignState] = useState({
    ...DEFAULT_DESIGN,
    shapeCategory: 'shield',
    shapeVariation: 'classic',
    shape: null,
    preset: 'cyber',
    moduleStyle: 'circle',
    moduleScale: 0.82,
    finderScale: 1,
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
  });
  const [stickerCfg, setStickerCfgState] = useState({
    ...STICKER_DEFAULTS,
    outerShape: 'shield',
    outerShieldVariant: 'classic',
    outerBgColor: '#1f2937',
    outerBorderWidth: 3,
    outerBorderColor: '#d4af37',
    outerBorderStyle: 'solid',
    innerShape: 'shield',
    innerShieldVariant: 'classic',
    innerBgColor: '#ffffff',
    innerSizeRatio: 0.72,
    innerBorderWidth: 0,
    innerBorderColor: '#d4af37',
    messageFontSize: 14,
    messageLetterSpacing: 5,
    topTextRadiusOffset: 138,
    bottomTextRadiusOffset: 200,
    topTextDy: -11,
    bottomTextDy: -1,
    qrPadding: 0.2,
    qrZoom: 1.37,
    qrOffsetX: 0,
    qrOffsetY: 1,
  });
  const [stickerEnabled, setStickerEnabled] = useState(true);
  const [openSections, setOpenSections] = useState({ shape: true, preset: true, style: false, gradient: false, effects: false, custom: false, stickerOuter: false, stickerInner: false, stickerTopText: false, stickerBottomText: false, stickerQR: false });
  const [copied, setCopied] = useState(false);

  const setDesign = useCallback((updater) => {
    setDesignState((prev) => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
  }, []);

  const setStickerCfg = useCallback((updater) => {
    setStickerCfgState((prev) => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
  }, []);

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleReset = () => { setDesignState({ ...DEFAULT_DESIGN }); setStickerCfgState({ ...STICKER_DEFAULTS }); setStickerEnabled(false); };

  const currentCategory = SHAPE_LIBRARY[design.shapeCategory] || SHAPE_LIBRARY.shield;
  const currentCategoryKey = design.shapeCategory || 'shield';

  const handleCategoryChange = (catKey) => {
    const cat = SHAPE_LIBRARY[catKey];
    setDesign({ shapeCategory: catKey, shapeVariation: Object.keys(cat.variations)[0], shape: null });
  };

  // ── Sticker geometry + frame SVG ──
  const stickerGeo = useMemo(() => stickerEnabled ? computeStickerGeometry(stickerCfg) : null, [stickerEnabled, stickerCfg]);
  const stickerFrameHtml = useMemo(() => stickerEnabled ? generateStickerFrameSVG(stickerCfg, 'pg-stk') : '', [stickerEnabled, stickerCfg]);

  // ── Build combined SVG string (sticker frame + QR) ──
  const buildExportSVG = useCallback(() => {
    const qrEl = document.getElementById('playground-qr-svg');
    if (!qrEl) return null;

    // Clone QR SVG and get its serialized content
    const qrClone = qrEl.cloneNode(true);
    qrClone.removeAttribute('id');
    qrClone.removeAttribute('class');
    qrClone.removeAttribute('style');
    const qrString = new XMLSerializer().serializeToString(qrClone);

    if (!stickerEnabled || !stickerGeo) {
      // No sticker — return the bare QR SVG
      const bare = qrEl.cloneNode(true);
      bare.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      return new XMLSerializer().serializeToString(bare);
    }

    // Build a composite SVG at sticker canvas dimensions
    const { canvasW, canvasH, qrOffsetPctX, qrOffsetPctY, qrSizePctW, qrSizePctH } = stickerGeo;
    const qrX = (qrOffsetPctX / 100) * canvasW + (stickerCfg.qrOffsetX || 0);
    const qrY = (qrOffsetPctY / 100) * canvasH + (stickerCfg.qrOffsetY || 0);
    const qrW = (qrSizePctW / 100) * canvasW;
    const qrH = (qrSizePctH / 100) * canvasH;

    // Get sticker frame SVG — it's a full <svg> tag, extract its inner content
    const frameSvg = generateStickerFrameSVG(stickerCfg, 'export-stk');
    const parser = new DOMParser();
    const frameDoc = parser.parseFromString(frameSvg, 'image/svg+xml');
    const frameSvgEl = frameDoc.querySelector('svg');
    const frameInner = frameSvgEl ? frameSvgEl.innerHTML : '';

    // Extract the inner content of the QR SVG (strip outer <svg> tag) and grab its viewBox
    const qrDoc = parser.parseFromString(qrString, 'image/svg+xml');
    const qrSvgEl = qrDoc.querySelector('svg');
    const qrViewBox = qrSvgEl?.getAttribute('viewBox') || `0 0 ${qrW} ${qrH}`;
    const qrInner = qrSvgEl ? qrSvgEl.innerHTML : '';

    const composite = [
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${canvasW} ${canvasH}" width="${canvasW}" height="${canvasH}">`,
      `<!-- Sticker frame -->`,
      frameInner,
      `<!-- QR code -->`,
      `<svg x="${qrX}" y="${qrY}" width="${qrW}" height="${qrH}" viewBox="${qrViewBox}">`,
      qrInner,
      `</svg>`,
      `</svg>`,
    ].join('\n');

    return composite;
  }, [stickerEnabled, stickerGeo, stickerCfg]);

  // ── Download helpers ──
  const handleDownloadSVG = () => {
    const svgString = buildExportSVG();
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = stickerEnabled ? 'qr-sticker.svg' : 'qr-code.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    const svgString = buildExportSVG();
    if (!svgString) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const scale = stickerEnabled && stickerGeo ? 2048 / Math.max(stickerGeo.canvasW, stickerGeo.canvasH) : 1;
      canvas.width = stickerEnabled && stickerGeo ? Math.round(stickerGeo.canvasW * scale) : 1024;
      canvas.height = stickerEnabled && stickerGeo ? Math.round(stickerGeo.canvasH * scale) : Math.round(1024 * (img.height / img.width));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = stickerEnabled ? 'qr-sticker.png' : 'qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  // ── JSON export ──
  const fullConfig = useMemo(() => {
    const obj = { qrValue, qrDesign: design };
    if (stickerEnabled) obj.stickerConfig = stickerCfg;
    return obj;
  }, [qrValue, design, stickerEnabled, stickerCfg]);

  const configJSON = useMemo(() => JSON.stringify(fullConfig, null, 2), [fullConfig]);

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(configJSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([configJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qr-design-config.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const { shape: currentShape } = resolveShape(design);

  // ── Sticker preview wrapper ──
  const stickerWrapperStyle = stickerEnabled && stickerGeo ? {
    position: 'relative',
    width: '100%',
    maxWidth: 280,
    aspectRatio: `${stickerGeo.canvasW} / ${stickerGeo.canvasH}`,
    borderRadius: getStickerWrapperBorderRadius(stickerCfg, 280, 280 * (stickerGeo.canvasH / stickerGeo.canvasW)),
    overflow: 'hidden',
    margin: '0 auto',
  } : null;

  return (
    <section id="playground" className="py-20 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Interactive Playground</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Customize every aspect of your QR code in real-time. Download as SVG or PNG.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* ── PREVIEW ── */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* URL Input */}
              <div className="glass-panel p-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">QR Data</label>
                <input
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  placeholder="Enter URL or text..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div className="glass-panel p-6 glow-cyan">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {currentCategory.label} / {currentShape?.label}
                    {stickerEnabled && ' + Sticker'}
                  </span>
                </div>
                <div className="flex justify-center">
                  {stickerEnabled && stickerGeo ? (
                    <div style={stickerWrapperStyle}>
                      {/* Sticker frame layer */}
                      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: stickerFrameHtml }} />
                      {/* QR layer positioned over inner container */}
                      <div style={{
                        position: 'absolute',
                        left: `${stickerGeo.qrOffsetPctX + (stickerCfg.qrOffsetX / stickerGeo.canvasW) * 100}%`,
                        top: `${stickerGeo.qrOffsetPctY + (stickerCfg.qrOffsetY / stickerGeo.canvasH) * 100}%`,
                        width: `${stickerGeo.qrSizePctW}%`,
                        height: `${stickerGeo.qrSizePctH}%`,
                      }}>
                        <QRPreview id="playground-qr-svg" value={qrValue} design={design} className="w-full h-full" />
                      </div>
                    </div>
                  ) : (
                    <QRPreview id="playground-qr-svg" value={qrValue} design={design} className="w-full max-w-[280px]" />
                  )}
                </div>
              </div>

              {/* Download buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleDownloadSVG} className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-colors text-sm">
                  <Download className="h-4 w-4" />SVG
                </button>
                <button onClick={handleDownloadPNG} className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl transition-colors text-sm">
                  <Download className="h-4 w-4" />PNG
                </button>
              </div>

              {/* JSON Export */}
              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileJson className="h-3.5 w-3.5 text-cyan-400" />Design Config
                  </span>
                  <div className="flex gap-2">
                    <button onClick={handleCopyJSON} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={handleDownloadJSON} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                      <Download className="h-3 w-3" />JSON
                    </button>
                  </div>
                </div>
                <pre className="text-[10px] font-mono text-gray-500 bg-black/30 rounded-lg p-3 max-h-40 overflow-auto leading-relaxed select-all">{configJSON}</pre>
              </div>
            </div>
          </div>

          {/* ── CONTROLS ── */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex justify-end">
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-cyan-400 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" />Reset All
              </button>
            </div>

            {/* ═══ QR SHAPE ═══ */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Shapes} label="Shape" open={openSections.shape} onToggle={() => toggleSection('shape')} />
              {openSections.shape && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {Object.entries(SHAPE_LIBRARY).map(([catKey, cat]) => {
                        const firstVar = Object.values(cat.variations)[0];
                        return (
                          <button key={catKey} onClick={() => handleCategoryChange(catKey)} className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${currentCategoryKey === catKey ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}>
                            <ShapeThumbnail path={firstVar.path} viewBox={firstVar.viewBox} className={currentCategoryKey === catKey ? 'text-cyan-400' : 'text-gray-500'} />
                            <span className="text-[10px] font-bold text-gray-300">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Variation</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(currentCategory.variations).map(([varKey, variation]) => (
                        <button key={varKey} onClick={() => setDesign({ shapeVariation: varKey, shape: null })} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${design.shapeVariation === varKey ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}>
                          <ShapeThumbnail path={variation.path} viewBox={variation.viewBox} className={design.shapeVariation === varKey ? 'text-cyan-400' : 'text-gray-500'} />
                          <span className="text-xs font-bold text-gray-300">{variation.label}</span>
                          <span className="text-[10px] text-gray-500 text-center">{variation.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ═══ COLOR PRESET ═══ */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Palette} label="Color Preset" open={openSections.preset} onToggle={() => toggleSection('preset')} />
              {openSections.preset && (
                <div className="p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
                      <button key={key} onClick={() => setDesign({ preset: key, customColors: null })} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${design.preset === key && !design.customColors ? 'border-cyan-500 bg-cyan-500/10 scale-105' : 'border-white/10 hover:border-white/20'}`}>
                        <div className="w-10 h-12 rounded-md border overflow-hidden flex items-center justify-center" style={{ background: preset.background, borderColor: preset.outline }}>
                          <div className="w-5 h-5 rounded-sm" style={{ background: preset.foreground, opacity: 0.9 }} />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ═══ MODULE STYLE ═══ */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Grid3X3} label="Module Style" open={openSections.style} onToggle={() => toggleSection('style')} />
              {openSections.style && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(MODULE_STYLES).map(([key, style]) => (
                      <button key={key} onClick={() => setDesign({ moduleStyle: key })} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${design.moduleStyle === key ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}>
                        <span className="text-2xl">{style.icon}</span>
                        <span className="text-xs font-bold text-gray-300">{style.label}</span>
                      </button>
                    ))}
                  </div>
                  <SliderRow label="Module Size" value={Math.round((design.moduleScale || 0.82) * 100)} onChange={(v) => setDesign({ moduleScale: v / 100 })} min={50} max={100} displayValue={`${Math.round((design.moduleScale || 0.82) * 100)}%`} />
                  <SliderRow label="Finder Size" value={Math.round((design.finderScale ?? 1.0) * 100)} onChange={(v) => setDesign({ finderScale: v / 100 })} min={50} max={100} displayValue={`${Math.round((design.finderScale ?? 1.0) * 100)}%`} />
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">Finder Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(FINDER_PATTERNS).map(([key, fp]) => (
                        <button key={key} onClick={() => setDesign({ finderPattern: key })} className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${(design.finderPattern || 'pattern') === key ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-400'}`}>
                          {fp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">Outer Shape</label>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(FINDER_STYLES).map(([key, fs]) => (
                        <button key={key} onClick={() => setDesign({ finderOuterStyle: key })} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${(design.finderOuterStyle || 'rounded') === key ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10'}`}>
                          <span className="text-lg">{fs.icon}</span>
                          <span className="text-[10px] font-bold text-gray-400">{fs.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">Inner Shape</label>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(FINDER_STYLES).map(([key, fs]) => (
                        <button key={key} onClick={() => setDesign({ finderInnerStyle: key })} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${(design.finderInnerStyle || 'rounded') === key ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10'}`}>
                          <span className="text-lg">{fs.icon}</span>
                          <span className="text-[10px] font-bold text-gray-400">{fs.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ═══ GRADIENT ═══ */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Sparkles} label="Gradient" open={openSections.gradient} onToggle={() => toggleSection('gradient')} />
              {openSections.gradient && (
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(GRADIENT_PRESETS).map(([key, gp]) => (
                      <button key={key} onClick={() => setDesign({ gradient: gp.value })} className={`p-3 rounded-xl border transition-all text-center ${(design.gradient === null && gp.value === null) || JSON.stringify(design.gradient) === JSON.stringify(gp.value) ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}>
                        {gp.value ? (
                          <div className="w-full h-6 rounded-md mb-1.5" style={{ background: gp.value.type === 'linear' ? `linear-gradient(${gp.value.angle || 135}deg, ${gp.value.colors.join(', ')})` : `radial-gradient(circle, ${gp.value.colors.join(', ')})` }} />
                        ) : (
                          <div className="w-full h-6 rounded-md mb-1.5 bg-white/5 flex items-center justify-center"><span className="text-[10px] text-gray-500">OFF</span></div>
                        )}
                        <span className="text-[10px] font-semibold text-gray-400">{gp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ═══ EFFECTS ═══ */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Sparkles} label="Effects" open={openSections.effects} onToggle={() => toggleSection('effects')} />
              {openSections.effects && (
                <div className="p-4 space-y-4">
                  {[
                    { key: 'glowEffect', label: 'Glow Effect' },
                    { key: 'innerBorder', label: 'Inner Border' },
                    { key: 'centerClear', label: 'Center Clear' },
                  ].map(({ key, label }) => (
                    <ToggleRow key={key} label={label} checked={design[key] || false} onChange={(v) => setDesign({ [key]: v })} />
                  ))}
                  <div className="pt-3 border-t border-white/5">
                    <ToggleRow label="Decorative Fill" description="Scattered dots in the empty shape area" checked={design.decorativeFill ?? true} onChange={(v) => setDesign({ decorativeFill: v })} />
                    {(design.decorativeFill ?? true) && (
                      <div className="mt-3 space-y-3">
                        {[
                          { key: 'decorativeDensity', label: 'Density', min: 10, max: 70, def: 0.35 },
                          { key: 'decorativeScale', label: 'Dot Size', min: 10, max: 100, def: 0.65 },
                          { key: 'decorativeOpacity', label: 'Opacity', min: 5, max: 100, def: 0.25 },
                        ].map(({ key, label, min, max, def }) => (
                          <SliderRow key={key} label={label} value={Math.round((design[key] ?? def) * 100)} onChange={(v) => setDesign({ [key]: v / 100 })} min={min} max={max} displayValue={`${Math.round((design[key] ?? def) * 100)}%`} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ═══ CUSTOM COLORS ═══ */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Palette} label="Custom Colors" open={openSections.custom} onToggle={() => toggleSection('custom')} />
              {openSections.custom && (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-gray-500 mb-2">Override the preset with custom colours.</p>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <span className="text-xs font-semibold text-gray-400 w-24 flex-shrink-0">Transparent BG</span>
                    <button
                      onClick={() => setDesign((prev) => {
                        const presetColors = COLOR_PRESETS[prev.preset] || COLOR_PRESETS.cyber;
                        const isCurrentlyTransparent = prev.customColors?.background === 'transparent';
                        if (isCurrentlyTransparent) {
                          const base = { ...prev.customColors, background: presetColors.background };
                          const allMatch = base.foreground === presetColors.foreground && base.outline === presetColors.outline && base.finderOuter === presetColors.finderOuter && base.finderInner === presetColors.finderInner;
                          return { ...prev, customColors: allMatch ? null : base, preset: allMatch ? (prev.preset || 'cyber') : null };
                        } else {
                          const base = prev.customColors || { background: presetColors.background, foreground: presetColors.foreground, outline: presetColors.outline, finderOuter: presetColors.finderOuter, finderInner: presetColors.finderInner, outlineWidth: presetColors.outlineWidth };
                          return { ...prev, preset: null, customColors: { ...base, background: 'transparent' } };
                        }
                      })}
                      className={`relative w-10 h-5 rounded-full transition-colors ${design.customColors?.background === 'transparent' ? 'bg-cyan-500' : 'bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${design.customColors?.background === 'transparent' ? 'translate-x-5' : ''}`} />
                    </button>
                    <span className="text-xs text-gray-500">QR takes parent background</span>
                  </label>
                  {['background', 'foreground', 'outline', 'finderOuter', 'finderInner'].map((colorKey) => {
                    const presetColors = COLOR_PRESETS[design.preset] || COLOR_PRESETS.cyber;
                    const val = design.customColors?.[colorKey] || presetColors[colorKey] || '#000000';
                    const isTransparentBg = colorKey === 'background' && val === 'transparent';
                    return (
                      <div key={colorKey} className={`flex items-center gap-3 ${isTransparentBg ? 'opacity-40 pointer-events-none' : ''}`}>
                        <label className="text-xs font-semibold text-gray-400 w-24 flex-shrink-0 capitalize">{colorKey.replace(/([A-Z])/g, ' $1')}</label>
                        <input type="color" value={isTransparentBg ? '#000000' : val} onChange={(e) => setDesign((prev) => {
                          const base = prev.customColors || { background: presetColors.background, foreground: presetColors.foreground, outline: presetColors.outline, finderOuter: presetColors.finderOuter, finderInner: presetColors.finderInner, outlineWidth: presetColors.outlineWidth };
                          return { ...prev, preset: null, customColors: { ...base, [colorKey]: e.target.value } };
                        })} className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-transparent" />
                        <span className="text-xs font-mono text-gray-500">{isTransparentBg ? 'transparent' : val}</span>
                      </div>
                    );
                  })}
                  <button onClick={() => setDesign({ preset: 'cyber', customColors: null })} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">Reset to preset</button>
                </div>
              )}
            </div>

            {/* ═══ STICKER DESIGNER ═══ */}
            <div className="glass-panel overflow-hidden border border-dashed border-cyan-500/30">
              <button onClick={() => setStickerEnabled(!stickerEnabled)} className="w-full flex items-center justify-between px-4 py-3 bg-cyan-500/5 hover:bg-cyan-500/10 rounded-xl transition-colors">
                <span className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                  <Square className="h-4 w-4" />Sticker / Container Designer
                </span>
                <div className="relative">
                  <div className={`w-10 h-5 rounded-full transition-colors ${stickerEnabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${stickerEnabled ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
              </button>

              {stickerEnabled && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-gray-500">Wrap the QR code inside styled containers with custom shapes, borders, and curved text.</p>

                  {/* Outer Container */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <SectionHeader icon={Square} label="Outer Container" open={openSections.stickerOuter} onToggle={() => toggleSection('stickerOuter')} />
                    {openSections.stickerOuter && (
                      <div className="p-4 space-y-4">
                        <ToggleRow label="Show Outer Container" checked={stickerCfg.showOuterContainer !== false} onChange={(v) => setStickerCfg({ showOuterContainer: v })} />
                        {stickerCfg.showOuterContainer !== false && (<>
                          <div>
                            <label className="text-xs font-semibold text-gray-400 mb-2 block">Shape</label>
                            <div className="flex flex-wrap gap-2">
                              {STICKER_SHAPE_OPTIONS.map((opt) => (
                                <button key={opt.value} onClick={() => setStickerCfg({ outerShape: opt.value })} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${stickerCfg.outerShape === opt.value ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                                  <span>{opt.icon}</span>{opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          {stickerCfg.outerShape === 'shield' && (
                            <div>
                              <label className="text-xs font-semibold text-gray-400 mb-2 block">Shield Style</label>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(STICKER_SHIELD_VARIANTS).map(([key, v]) => (
                                  <button key={key} onClick={() => setStickerCfg({ outerShieldVariant: key })} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${stickerCfg.outerShieldVariant === key ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                                    <svg viewBox={`0 0 ${v.origW} ${v.origH}`} className="w-4 h-5 shrink-0" fill="currentColor"><path d={v.path} /></svg>
                                    <span className="font-semibold">{v.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {stickerCfg.outerShape !== 'circle' && stickerCfg.outerShape !== 'shield' && (
                            <SliderRow label="Corner Radius" value={stickerCfg.outerCornerRadius} onChange={(v) => setStickerCfg({ outerCornerRadius: v })} min={0} max={100} step={2} unit="px" />
                          )}
                          <ColorRow label="Background" value={stickerCfg.outerBgColor} onChange={(v) => setStickerCfg({ outerBgColor: v })} />
                          <div className="grid grid-cols-2 gap-3">
                            <SliderRow label="Border Width" value={stickerCfg.outerBorderWidth} onChange={(v) => setStickerCfg({ outerBorderWidth: v })} min={0} max={20} unit="px" />
                            <div>
                              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Border Style</label>
                              <div className="flex gap-1">
                                {['solid', 'dashed', 'dotted'].map((s) => (
                                  <button key={s} onClick={() => setStickerCfg({ outerBorderStyle: s })} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${stickerCfg.outerBorderStyle === s ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-500'}`}>{s}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <ColorRow label="Border Color" value={stickerCfg.outerBorderColor} onChange={(v) => setStickerCfg({ outerBorderColor: v })} />
                        </>)}
                      </div>
                    )}
                  </div>

                  {/* Inner Container */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <SectionHeader icon={Square} label="Inner Container" open={openSections.stickerInner} onToggle={() => toggleSection('stickerInner')} />
                    {openSections.stickerInner && (
                      <div className="p-4 space-y-4">
                        <ToggleRow label="Show Inner Container" checked={stickerCfg.showInnerContainer !== false} onChange={(v) => setStickerCfg({ showInnerContainer: v })} />
                        {stickerCfg.showInnerContainer !== false && (<>
                          <div>
                            <label className="text-xs font-semibold text-gray-400 mb-2 block">Shape</label>
                            <div className="flex flex-wrap gap-2">
                              {STICKER_SHAPE_OPTIONS.map((opt) => (
                                <button key={opt.value} onClick={() => setStickerCfg({ innerShape: opt.value })} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${stickerCfg.innerShape === opt.value ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                                  <span>{opt.icon}</span>{opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          {stickerCfg.innerShape === 'shield' && (
                            <div>
                              <label className="text-xs font-semibold text-gray-400 mb-2 block">Shield Style</label>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(STICKER_SHIELD_VARIANTS).map(([key, v]) => (
                                  <button key={key} onClick={() => setStickerCfg({ innerShieldVariant: key })} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${stickerCfg.innerShieldVariant === key ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                                    <svg viewBox={`0 0 ${v.origW} ${v.origH}`} className="w-4 h-5 shrink-0" fill="currentColor"><path d={v.path} /></svg>
                                    <span className="font-semibold">{v.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {stickerCfg.innerShape !== 'circle' && stickerCfg.innerShape !== 'shield' && (
                            <SliderRow label="Corner Radius" value={stickerCfg.innerCornerRadius} onChange={(v) => setStickerCfg({ innerCornerRadius: v })} min={0} max={80} step={2} unit="px" />
                          )}
                          <ColorRow label="Background" value={stickerCfg.innerBgColor} onChange={(v) => setStickerCfg({ innerBgColor: v })} />
                          <SliderRow label="Size Ratio" value={Math.round(stickerCfg.innerSizeRatio * 100)} onChange={(v) => setStickerCfg({ innerSizeRatio: v / 100 })} min={30} max={80} displayValue={`${Math.round(stickerCfg.innerSizeRatio * 100)}%`} />
                          <div className="grid grid-cols-2 gap-3">
                            <SliderRow label="Border Width" value={stickerCfg.innerBorderWidth} onChange={(v) => setStickerCfg({ innerBorderWidth: v })} min={0} max={12} unit="px" />
                            <div>
                              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Border Style</label>
                              <div className="flex gap-1">
                                {['solid', 'dashed', 'dotted'].map((s) => (
                                  <button key={s} onClick={() => setStickerCfg({ innerBorderStyle: s })} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${stickerCfg.innerBorderStyle === s ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-500'}`}>{s}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <ColorRow label="Border Color" value={stickerCfg.innerBorderColor} onChange={(v) => setStickerCfg({ innerBorderColor: v })} />
                          <SliderRow label="QR Padding" value={Math.round(stickerCfg.qrPadding * 100)} onChange={(v) => setStickerCfg({ qrPadding: v / 100 })} min={0} max={30} displayValue={`${Math.round(stickerCfg.qrPadding * 100)}%`} />
                        </>)}
                      </div>
                    )}
                  </div>

                  {/* Top Text */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <SectionHeader icon={Type} label="Top Text" open={openSections.stickerTopText} onToggle={() => toggleSection('stickerTopText')} />
                    {openSections.stickerTopText && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Title</label>
                          <input type="text" value={stickerCfg.topTitle} onChange={(e) => setStickerCfg({ topTitle: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                        </div>
                        <ColorRow label="Text Color" value={stickerCfg.textColor} onChange={(v) => setStickerCfg({ textColor: v })} />
                        <div className="grid grid-cols-2 gap-3">
                          <SliderRow label="Font Size" value={stickerCfg.titleFontSize} onChange={(v) => setStickerCfg({ titleFontSize: v })} min={16} max={52} step={2} unit="px" />
                          <SliderRow label="Letter Spacing" value={stickerCfg.titleLetterSpacing} onChange={(v) => setStickerCfg({ titleLetterSpacing: v })} min={0} max={16} unit="px" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <SliderRow label="Curvature" value={stickerCfg.topTextRadiusOffset} onChange={(v) => setStickerCfg({ topTextRadiusOffset: v })} min={-200} max={200} step={2} displayValue={`${stickerCfg.topTextRadiusOffset}${Math.abs(stickerCfg.topTextRadiusOffset) < 5 ? ' flat' : ''}`} />
                          <SliderRow label="Vertical Shift" value={stickerCfg.topTextDy} onChange={(v) => setStickerCfg({ topTextDy: v })} min={-50} max={50} displayValue={`${stickerCfg.topTextDy}px`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Text */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <SectionHeader icon={Type} label="Bottom Text" open={openSections.stickerBottomText} onToggle={() => toggleSection('stickerBottomText')} />
                    {openSections.stickerBottomText && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Message</label>
                          <input type="text" value={stickerCfg.bottomMessage} onChange={(e) => setStickerCfg({ bottomMessage: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                        </div>
                        <ColorRow label="Text Color" value={stickerCfg.textColor} onChange={(v) => setStickerCfg({ textColor: v })} />
                        <div className="grid grid-cols-2 gap-3">
                          <SliderRow label="Font Size" value={stickerCfg.messageFontSize} onChange={(v) => setStickerCfg({ messageFontSize: v })} min={12} max={36} step={2} unit="px" />
                          <SliderRow label="Letter Spacing" value={stickerCfg.messageLetterSpacing} onChange={(v) => setStickerCfg({ messageLetterSpacing: v })} min={0} max={12} unit="px" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <SliderRow label="Curvature" value={stickerCfg.bottomTextRadiusOffset} onChange={(v) => setStickerCfg({ bottomTextRadiusOffset: v })} min={-200} max={200} step={2} displayValue={`${stickerCfg.bottomTextRadiusOffset}${Math.abs(stickerCfg.bottomTextRadiusOffset) < 5 ? ' flat' : ''}`} />
                          <SliderRow label="Vertical Shift" value={stickerCfg.bottomTextDy} onChange={(v) => setStickerCfg({ bottomTextDy: v })} min={-50} max={50} displayValue={`${stickerCfg.bottomTextDy}px`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR Size & Position */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <SectionHeader icon={Move} label="QR Size & Position" open={openSections.stickerQR} onToggle={() => toggleSection('stickerQR')} />
                    {openSections.stickerQR && (
                      <div className="p-4 space-y-4">
                        <SliderRow label="QR Zoom" value={Math.round(stickerCfg.qrZoom * 100)} onChange={(v) => setStickerCfg({ qrZoom: v / 100 })} min={50} max={300} displayValue={`${Math.round(stickerCfg.qrZoom * 100)}%`} />
                        <SliderRow label="Offset X" value={stickerCfg.qrOffsetX} onChange={(v) => setStickerCfg({ qrOffsetX: v })} min={-30} max={30} displayValue={`${stickerCfg.qrOffsetX}px`} />
                        <SliderRow label="Offset Y" value={stickerCfg.qrOffsetY} onChange={(v) => setStickerCfg({ qrOffsetY: v })} min={-30} max={30} displayValue={`${stickerCfg.qrOffsetY}px`} />
                        <button onClick={() => setStickerCfg({ qrOffsetX: 0, qrOffsetY: 0 })} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">Reset to center</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
