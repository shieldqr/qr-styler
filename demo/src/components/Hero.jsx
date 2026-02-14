import { useMemo } from 'react';
import { ArrowDown, Zap, Palette, Box, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import QRPreview from './QRPreview';

const HERO_DEMOS = [
  { shapeCategory: 'shield', shapeVariation: 'classic', preset: 'cyber', moduleStyle: 'circle', glowEffect: true, decorativeFill: true },
  { shapeCategory: 'heart', shapeVariation: 'classic', preset: 'fire', moduleStyle: 'diamond', glowEffect: true, decorativeFill: true },
  { shapeCategory: 'hexagon', shapeVariation: 'rounded', preset: 'royal', moduleStyle: 'roundedSquare', glowEffect: true, decorativeFill: true },
  { shapeCategory: 'circle', shapeVariation: 'squircle', preset: 'ocean', moduleStyle: 'pond', glowEffect: true, decorativeFill: true },
  { shapeCategory: 'diamond', shapeVariation: 'soft', preset: 'military', moduleStyle: 'circle', glowEffect: true, decorativeFill: true },
];

function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const cmd = 'npm install shield-qr-styler';

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 bg-gray-900/80 border border-gray-700/50 hover:border-cyan-500/30 rounded-xl px-5 py-3 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
    >
      <span className="text-gray-500 font-mono text-sm">$</span>
      <code className="font-mono text-sm text-cyan-400">{cmd}</code>
      {copied ? (
        <Check className="w-4 h-4 text-green-400 ml-2" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500 group-hover:text-gray-300 ml-2 transition-colors" />
      )}
    </button>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Open Source</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            <span className="text-white">Beautiful</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Shaped</span>
            <br />
            <span className="text-white">QR Codes</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Generate stunning QR codes in shields, hearts, hexagons, and more.
            22+ shape variations, 7 color presets, gradients, and glow effects.
            Framework-agnostic SVG output.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <InstallCommand />
            <a
              href="#playground"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              Try the Playground
            </a>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {[
              { icon: Box, label: '22+ Shapes' },
              { icon: Palette, label: '7 Presets' },
              { icon: Sparkles, label: 'Gradients' },
              { icon: Zap, label: 'SVG Output' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QR Demo Grid */}
        <div className="flex justify-center gap-6 flex-wrap">
          {HERO_DEMOS.map((design, i) => (
            <div
              key={i}
              className="glass-panel p-4 glow-cyan transition-transform hover:scale-105"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <QRPreview
                value="https://github.com/shield-qr-styler"
                design={design}
                className="w-32 h-36 sm:w-40 sm:h-44"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <a href="#showcase" className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors animate-bounce">
            <ArrowDown className="w-5 h-5" />
            <span className="text-sm font-medium">Explore all shapes</span>
          </a>
        </div>
      </div>
    </section>
  );
}
