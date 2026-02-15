import { useState, useCallback } from 'react';
import { Download, RotateCcw, Sparkles, Palette, Grid3X3, Shapes } from 'lucide-react';
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
} from 'shield-qr-styler';

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

export default function PlaygroundSection() {
  const [qrValue, setQrValue] = useState('https://shield-qr-styler.dev');
  const [design, setDesignState] = useState({ ...DEFAULT_DESIGN });
  const [openSections, setOpenSections] = useState({ shape: true, preset: true, style: false, gradient: false, effects: false, custom: false });

  const setDesign = useCallback((updater) => {
    setDesignState((prev) => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
  }, []);

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleReset = () => setDesignState({ ...DEFAULT_DESIGN });

  const currentCategory = SHAPE_LIBRARY[design.shapeCategory] || SHAPE_LIBRARY.shield;
  const currentCategoryKey = design.shapeCategory || 'shield';

  const handleCategoryChange = (catKey) => {
    const cat = SHAPE_LIBRARY[catKey];
    setDesign({ shapeCategory: catKey, shapeVariation: Object.keys(cat.variations)[0], shape: null });
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('playground-qr-svg');
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgString = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qr-code.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    const svgEl = document.getElementById('playground-qr-svg');
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgString = new XMLSerializer().serializeToString(clone);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = Math.round(1024 * (img.height / img.width));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  const { shape: currentShape } = resolveShape(design);

  return (
    <section id="playground" className="py-20 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Interactive Playground</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Customize every aspect of your QR code in real-time. Download as SVG or PNG.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Preview */}
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
                  </span>
                </div>
                <div className="flex justify-center">
                  <QRPreview id="playground-qr-svg" value={qrValue} design={design} className="w-full max-w-[280px]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleDownloadSVG} className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-colors text-sm">
                  <Download className="h-4 w-4" />SVG
                </button>
                <button onClick={handleDownloadPNG} className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl transition-colors text-sm">
                  <Download className="h-4 w-4" />PNG
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex justify-end">
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-cyan-400 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" />Reset
              </button>
            </div>

            {/* SHAPE */}
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

            {/* COLOR PRESET */}
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

            {/* MODULE STYLE */}
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
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2"><span>Module Size</span><span>{Math.round((design.moduleScale || 0.82) * 100)}%</span></label>
                    <input type="range" min="50" max="100" value={Math.round((design.moduleScale || 0.82) * 100)} onChange={(e) => setDesign({ moduleScale: parseInt(e.target.value) / 100 })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2"><span>Finder Size</span><span>{Math.round((design.finderScale ?? 1.0) * 100)}%</span></label>
                    <input type="range" min="50" max="100" value={Math.round((design.finderScale ?? 1.0) * 100)} onChange={(e) => setDesign({ finderScale: parseInt(e.target.value) / 100 })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  </div>
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

            {/* GRADIENT */}
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

            {/* EFFECTS */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Sparkles} label="Effects" open={openSections.effects} onToggle={() => toggleSection('effects')} />
              {openSections.effects && (
                <div className="p-4 space-y-4">
                  {[
                    { key: 'glowEffect', label: 'Glow Effect' },
                    { key: 'innerBorder', label: 'Inner Border' },
                    { key: 'centerClear', label: 'Center Clear' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-semibold text-gray-300">{label}</span>
                      <div className="relative">
                        <input type="checkbox" checked={design[key] || false} onChange={(e) => setDesign({ [key]: e.target.checked })} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-700 peer-checked:bg-cyan-500 rounded-full transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                      </div>
                    </label>
                  ))}
                  <div className="pt-3 border-t border-white/5">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-sm font-semibold text-gray-300">Decorative Fill</span>
                        <p className="text-[11px] text-gray-500">Scattered dots in the empty shape area</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" checked={design.decorativeFill ?? true} onChange={(e) => setDesign({ decorativeFill: e.target.checked })} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-700 peer-checked:bg-cyan-500 rounded-full transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                      </div>
                    </label>
                    {(design.decorativeFill ?? true) && (
                      <div className="mt-3 space-y-3">
                        {[
                          { key: 'decorativeDensity', label: 'Density', min: 10, max: 70, def: 0.35 },
                          { key: 'decorativeScale', label: 'Dot Size', min: 10, max: 100, def: 0.65 },
                          { key: 'decorativeOpacity', label: 'Opacity', min: 5, max: 100, def: 0.25 },
                        ].map(({ key, label, min, max, def }) => (
                          <div key={key}>
                            <label className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-1.5"><span>{label}</span><span>{Math.round((design[key] ?? def) * 100)}%</span></label>
                            <input type="range" min={min} max={max} value={Math.round((design[key] ?? def) * 100)} onChange={(e) => setDesign({ [key]: parseInt(e.target.value) / 100 })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CUSTOM COLORS */}
            <div className="glass-panel overflow-hidden">
              <SectionHeader icon={Palette} label="Custom Colors" open={openSections.custom} onToggle={() => toggleSection('custom')} />
              {openSections.custom && (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-gray-500 mb-2">Override the preset with custom colours.</p>
                  {/* Transparent background toggle */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <span className="text-xs font-semibold text-gray-400 w-24 flex-shrink-0">Transparent BG</span>
                    <button
                      onClick={() => setDesign((prev) => {
                        const presetColors = COLOR_PRESETS[prev.preset] || COLOR_PRESETS.cyber;
                        const isCurrentlyTransparent = prev.customColors?.background === 'transparent';
                        if (isCurrentlyTransparent) {
                          // Restore the preset background
                          const base = { ...prev.customColors, background: presetColors.background };
                          // If all colors match preset, remove customColors entirely
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
          </div>
        </div>
      </div>
    </section>
  );
}
