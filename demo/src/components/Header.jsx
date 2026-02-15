import { useState, useEffect } from 'react';
import { Shield, Github, Package } from 'lucide-react';
import pkgJson from '../../../package.json';

// Build-time version from the library's package.json (always current)
const BUILD_VERSION = pkgJson.version;

export default function Header() {
  const [version, setVersion] = useState(BUILD_VERSION);

  // Try to fetch latest published npm version as a bonus indicator
  useEffect(() => {
    fetch('https://registry.npmjs.org/shield-qr-styler/latest')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.version) {
          // Show whichever is newer: build version or npm version
          const npmVer = data.version;
          setVersion(npmVer > BUILD_VERSION ? npmVer : BUILD_VERSION);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">Shield QR Styler</span>
              {version && (
                <a href="https://www.npmjs.com/package/shield-qr-styler" target="_blank" rel="noopener noreferrer" className="hidden sm:inline ml-2 text-xs font-mono text-gray-500 bg-gray-800/80 px-2 py-0.5 rounded-full hover:text-cyan-400 transition-colors">
                  v{version}
                </a>
              )}
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#showcase" className="text-sm text-gray-400 hover:text-white transition-colors">Shapes</a>
            <a href="#playground" className="text-sm text-gray-400 hover:text-white transition-colors">Playground</a>
            <a href="#docs" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://www.npmjs.com/package/shield-qr-styler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">npm</span>
            </a>
            <a
              href="https://github.com/shieldqr/qr-styler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="#playground"
              className="ml-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold rounded-lg text-sm transition-colors"
            >
              Try It
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
