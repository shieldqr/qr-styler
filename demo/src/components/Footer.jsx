import { Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white">Shield QR Styler</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate beautifully shaped, customizable QR codes as SVG.
              Open source, framework-agnostic, and ready for production.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-300 mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#docs" className="text-gray-500 hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#playground" className="text-gray-500 hover:text-cyan-400 transition-colors">Playground</a></li>
              <li><a href="https://www.npmjs.com/package/shield-qr-styler" className="text-gray-500 hover:text-cyan-400 transition-colors">npm Package</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-300 mb-4 text-sm uppercase tracking-wider">Install</h4>
            <div className="bg-gray-900/80 border border-gray-800 rounded-lg px-4 py-3">
              <code className="text-sm text-cyan-400 font-mono">npm install shield-qr-styler</code>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">MIT License</p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> for the developer community
          </p>
        </div>
      </div>
    </footer>
  );
}
