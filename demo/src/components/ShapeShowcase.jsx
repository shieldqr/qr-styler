import { SHAPE_LIBRARY, COLOR_PRESETS } from 'shield-qr-styler';
import QRPreview from './QRPreview';

const PRESET_ROTATION = Object.keys(COLOR_PRESETS);
const MODULE_STYLES_LIST = ['circle', 'roundedSquare', 'diamond', 'pond', 'barH', 'barV', 'square'];

export default function ShapeShowcase() {
  let idx = 0;

  return (
    <section id="showcase" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Every Shape, Every Style
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            9 shape categories with 22+ variations. Each one fully scannable and production-ready.
          </p>
        </div>

        <div className="space-y-16">
          {Object.entries(SHAPE_LIBRARY).map(([catKey, cat]) => (
            <div key={catKey}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{cat.label}</h3>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Object.entries(cat.variations).map(([varKey, variation]) => {
                  const preset = PRESET_ROTATION[idx % PRESET_ROTATION.length];
                  const modStyle = MODULE_STYLES_LIST[idx % MODULE_STYLES_LIST.length];
                  idx++;
                  return (
                    <div key={varKey} className="glass-panel p-4 flex flex-col items-center gap-3 group hover:border-cyan-500/30 transition-all">
                      <QRPreview
                        value="https://shield-qr-styler.dev"
                        design={{
                          shapeCategory: catKey,
                          shapeVariation: varKey,
                          preset,
                          moduleStyle: modStyle,
                          glowEffect: true,
                          decorativeFill: true,
                        }}
                        className="w-full max-w-[160px]"
                      />
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">{variation.label}</p>
                        <p className="text-[11px] text-gray-500">{variation.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
