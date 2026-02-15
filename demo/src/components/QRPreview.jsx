/**
 * QRPreview - React component for rendering shaped QR codes as inline SVG.
 * Uses the qrcode package for matrix generation; renders entirely client-side.
 *
 * Props:
 *   value     - URL or data to encode
 *   design    - Design config object
 *   className - Additional CSS classes
 *   id        - SVG element id
 */

import { useMemo } from 'react';
import QRCode from 'qrcode';
import {
  SHAPE_LIBRARY,
  SHIELD_PATHS,
  COLOR_PRESETS,
  resolveShape,
  resolveColors,
} from 'shield-qr-styler';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function fmt(n) {
  return Number(n.toFixed(2));
}

function getFinderPatternPositions(moduleCount) {
  return [
    { row: 0, col: 0 },
    { row: 0, col: moduleCount - 7 },
    { row: moduleCount - 7, col: 0 },
  ];
}

function classifyFinderModule(row, col, positions) {
  for (const pos of positions) {
    if (row >= pos.row && row < pos.row + 7 && col >= pos.col && col < pos.col + 7) {
      const lr = row - pos.row;
      const lc = col - pos.col;
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return 'outer';
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return 'inner';
      return 'space';
    }
  }
  return null;
}

function isTransparentColor(color) {
  if (!color || typeof color !== 'string') return false;
  const c = color.trim().toLowerCase();
  return c === 'transparent' || c === 'none' || c === 'rgba(0,0,0,0)' || c === 'rgba(0, 0, 0, 0)';
}

/** Generate path string for a finder shape (for donut rendering). */
function finderShapePathData(x, y, size, style, cornerRadius) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;
  switch (style) {
    case 'circle':
    case 'dot':
      return `M${fmt(cx - r)},${fmt(cy)} A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(cx + r)},${fmt(cy)} A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(cx - r)},${fmt(cy)}Z`;
    case 'rounded':
    case 'roundedSquare': {
      const rr = Math.min(cornerRadius !== undefined ? Math.max(cornerRadius, 0) : size * 0.15, size / 2);
      return `M${fmt(x + rr)},${fmt(y)} L${fmt(x + size - rr)},${fmt(y)} A${fmt(rr)},${fmt(rr)} 0 0,1 ${fmt(x + size)},${fmt(y + rr)} L${fmt(x + size)},${fmt(y + size - rr)} A${fmt(rr)},${fmt(rr)} 0 0,1 ${fmt(x + size - rr)},${fmt(y + size)} L${fmt(x + rr)},${fmt(y + size)} A${fmt(rr)},${fmt(rr)} 0 0,1 ${fmt(x)},${fmt(y + size - rr)} L${fmt(x)},${fmt(y + rr)} A${fmt(rr)},${fmt(rr)} 0 0,1 ${fmt(x + rr)},${fmt(y)}Z`;
    }
    case 'diamond':
      return `M${fmt(cx)},${fmt(cy - r)} L${fmt(cx + r)},${fmt(cy)} L${fmt(cx)},${fmt(cy + r)} L${fmt(cx - r)},${fmt(cy)}Z`;
    case 'square':
    default:
      return `M${fmt(x)},${fmt(y)} L${fmt(x + size)},${fmt(y)} L${fmt(x + size)},${fmt(y + size)} L${fmt(x)},${fmt(y + size)}Z`;
  }
}

/** Render a ring/donut (outer minus hole) as a single <path> with fill-rule="evenodd". */
function renderFinderDonut(outerX, outerY, outerSz, outerStyle, outerRR, holeX, holeY, holeSz, holeStyle, holeRR, fill, keyPrefix) {
  const outer = finderShapePathData(outerX, outerY, outerSz, outerStyle, outerRR);
  const hole = finderShapePathData(holeX, holeY, holeSz, holeStyle, holeRR);
  return <path key={keyPrefix} d={`${outer} ${hole}`} fill={fill} fillRule="evenodd" />;
}

function renderSolidFinderShape(x, y, size, style, fill, keyPrefix, cornerRadius) {
  const cx = fmt(x + size / 2);
  const cy = fmt(y + size / 2);
  const r = fmt(size / 2);
  switch (style) {
    case 'circle':
    case 'dot':
      return <circle key={`${keyPrefix}-${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />;
    case 'rounded':
    case 'roundedSquare': {
      const rr = fmt(cornerRadius !== undefined ? Math.max(cornerRadius, 0) : size * 0.15);
      return <rect key={`${keyPrefix}-${cx}-${cy}`} x={fmt(x)} y={fmt(y)} width={fmt(size)} height={fmt(size)} rx={rr} ry={rr} fill={fill} />;
    }
    case 'diamond': {
      const pts = `${cx},${fmt(y)} ${fmt(x + size)},${cy} ${cx},${fmt(y + size)} ${fmt(x)},${cy}`;
      return <polygon key={`${keyPrefix}-${cx}-${cy}`} points={pts} fill={fill} />;
    }
    case 'square':
    default:
      return <rect key={`${keyPrefix}-${cx}-${cy}`} x={fmt(x)} y={fmt(y)} width={fmt(size)} height={fmt(size)} fill={fill} />;
  }
}

function renderModule(x, y, size, style, scale, fill) {
  const s = size * scale;
  const offset = (size - s) / 2;
  const cx = fmt(x + size / 2);
  const cy = fmt(y + size / 2);
  const r = fmt(s / 2);
  switch (style) {
    case 'circle':
    case 'dot':
      return <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />;
    case 'rounded':
    case 'roundedSquare': {
      const rr = fmt(s * 0.35);
      return <rect key={`${cx}-${cy}`} x={fmt(x + offset)} y={fmt(y + offset)} width={fmt(s)} height={fmt(s)} rx={rr} ry={rr} fill={fill} />;
    }
    case 'diamond': {
      const pts = `${cx},${fmt(y + size / 2 - s / 2)} ${fmt(x + size / 2 + s / 2)},${cy} ${cx},${fmt(y + size / 2 + s / 2)} ${fmt(x + size / 2 - s / 2)},${cy}`;
      return <polygon key={`${cx}-${cy}`} points={pts} fill={fill} />;
    }
    case 'square':
    default:
      return <rect key={`${cx}-${cy}`} x={fmt(x + offset)} y={fmt(y + offset)} width={fmt(s)} height={fmt(s)} fill={fill} />;
  }
}

function buildGradientDef(gradient) {
  if (!gradient) return null;
  const { type, colors, angle = 135, stops } = gradient;
  const stopElements = colors.map((color, i) => {
    const pct = stops ? stops[i] : Math.round((i / (colors.length - 1)) * 100);
    return <stop key={i} offset={`${pct}%`} stopColor={color} />;
  });
  if (type === 'radial') {
    return <radialGradient id="qrGradient" cx="50%" cy="50%" r="60%">{stopElements}</radialGradient>;
  }
  const rad = ((angle - 90) * Math.PI) / 180;
  const x1 = Math.round(50 + Math.sin(rad + Math.PI) * 50);
  const y1 = Math.round(50 + Math.cos(rad + Math.PI) * 50);
  const x2 = Math.round(50 + Math.sin(rad) * 50);
  const y2 = Math.round(50 + Math.cos(rad) * 50);
  return <linearGradient id="qrGradient" x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>{stopElements}</linearGradient>;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function QRPreview({ value, design = {}, className = '', id }) {
  const svgContent = useMemo(() => {
    if (!value) return null;
    try {
      const qrData = QRCode.create(value, { errorCorrectionLevel: 'H' });
      const modules = qrData.modules;
      const moduleCount = modules.size;
      const { shape: resolvedShape } = resolveShape(design);
      const { qrArea, path, viewBox, width, height, bare } = resolvedShape;

      const rawModuleSize = qrArea.size / moduleCount;
      const quietModules = 1.5;
      const quietPx = quietModules * rawModuleSize;
      const dataOriginX = qrArea.x + quietPx;
      const dataOriginY = qrArea.y + quietPx;
      const dataSize = qrArea.size - quietPx * 2;
      const cellSize = dataSize / moduleCount;

      const colors = resolveColors(design);
      const transparentBg = isTransparentColor(colors.background);
      const bgFill = transparentBg ? 'none' : colors.background;
      const finderOuter = colors.finderOuter || colors.foreground;
      const finderInner = colors.finderInner || colors.foreground;
      const fillColor = design.gradient ? 'url(#qrGradient)' : colors.foreground;

      const moduleScale = design.moduleScale || 0.82;
      const moduleStyle = design.moduleStyle || 'circle';
      const glowEffect = design.glowEffect ?? false;
      const innerBorder = design.innerBorder ?? false;
      const centerClear = design.centerClear ?? false;
      const centerSize = design.centerSize || 0.22;

      const finderPositions = getFinderPatternPositions(moduleCount);
      const qrCenterX = dataOriginX + dataSize / 2;
      const qrCenterY = dataOriginY + dataSize / 2;
      const clearRadius = centerClear ? dataSize * centerSize : 0;

      const moduleElements = [];
      const fScale = design.finderScale ?? 1.0;
      const finderOuterStyle = design.finderOuterStyle || 'rounded';
      const finderInnerStyle = design.finderInnerStyle || 'rounded';
      const isBarStyle = moduleStyle === 'barH' || moduleStyle === 'barV';
      const isPondStyle = moduleStyle === 'pond';

      const isCleared = (r, c) => {
        if (!centerClear) return false;
        const px = dataOriginX + c * cellSize + cellSize / 2 - qrCenterX;
        const py = dataOriginY + r * cellSize + cellSize / 2 - qrCenterY;
        return Math.sqrt(px * px + py * py) < clearRadius;
      };

      const finderPatternMode = design.finderPattern || 'pattern';

      if (finderPatternMode === 'solid') {
        for (const pos of finderPositions) {
          const fpX = dataOriginX + pos.col * cellSize;
          const fpY = dataOriginY + pos.row * cellSize;
          const cxF = fpX + 3.5 * cellSize;
          const cyF = fpY + 3.5 * cellSize;
          const outerSz = 7 * cellSize * fScale;
          const spaceSz = 5 * cellSize * fScale;
          const innerSz = 3 * cellSize * fScale;
          const outerRR = outerSz * 0.15;
          const gap1 = (outerSz - spaceSz) / 2;
          const spaceRR = Math.max(outerRR - gap1, 0);
          const gap2 = (spaceSz - innerSz) / 2;
          const innerRR = Math.max(spaceRR - gap2, 0);
          if (transparentBg) {
            moduleElements.push(renderFinderDonut(
              cxF - outerSz / 2, cyF - outerSz / 2, outerSz, finderOuterStyle, outerRR,
              cxF - spaceSz / 2, cyF - spaceSz / 2, spaceSz, finderOuterStyle, spaceRR,
              finderOuter, `fr-${pos.row}-${pos.col}`
            ));
          } else {
            moduleElements.push(renderSolidFinderShape(cxF - outerSz / 2, cyF - outerSz / 2, outerSz, finderOuterStyle, finderOuter, `fo-${pos.row}-${pos.col}`, outerRR));
            moduleElements.push(renderSolidFinderShape(cxF - spaceSz / 2, cyF - spaceSz / 2, spaceSz, finderOuterStyle, colors.background, `fs-${pos.row}-${pos.col}`, spaceRR));
          }
          moduleElements.push(renderSolidFinderShape(cxF - innerSz / 2, cyF - innerSz / 2, innerSz, finderInnerStyle, finderInner, `fi-${pos.row}-${pos.col}`, innerRR));
        }
      } else {
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (!modules.get(row, col)) continue;
            const finderType = classifyFinderModule(row, col, finderPositions);
            if (!finderType || finderType === 'space') continue;
            const x = dataOriginX + col * cellSize;
            const y = dataOriginY + row * cellSize;
            let modFill = fillColor;
            if (finderType === 'outer') modFill = finderOuter;
            else if (finderType === 'inner') modFill = finderInner;
            const fStyle = finderType === 'outer' ? finderOuterStyle : finderInnerStyle;
            moduleElements.push(renderModule(x, y, cellSize, fStyle, fScale, modFill));
          }
        }
      }

      // Data modules
      if (isPondStyle) {
        const inset = cellSize * (1 - moduleScale) / 2;
        const rr = Math.max(inset * 0.85, 0.3);
        const grid = [];
        for (let r = 0; r < moduleCount; r++) {
          grid[r] = [];
          for (let c = 0; c < moduleCount; c++) {
            grid[r][c] = modules.get(r, c) && !classifyFinderModule(r, c, finderPositions) && !isCleared(r, c);
          }
        }
        const gd = (r, c) => r >= 0 && r < moduleCount && c >= 0 && c < moduleCount && grid[r][c];
        const pathParts = [];
        for (let r = 0; r < moduleCount; r++) {
          for (let c = 0; c < moduleCount; c++) {
            if (!grid[r][c]) continue;
            const x0 = dataOriginX + c * cellSize;
            const y0 = dataOriginY + r * cellSize;
            const tD = gd(r - 1, c), rD = gd(r, c + 1), bD = gd(r + 1, c), lD = gd(r, c - 1);
            const t = tD ? y0 : y0 + inset;
            const ri = rD ? x0 + cellSize : x0 + cellSize - inset;
            const b = bD ? y0 + cellSize : y0 + cellSize - inset;
            const l = lD ? x0 : x0 + inset;
            const tlR = !tD && !lD, trR = !tD && !rD, brR = !bD && !rD, blR = !bD && !lD;
            let d = `M ${fmt(l + (tlR ? rr : 0))} ${fmt(t)}`;
            d += ` H ${fmt(ri - (trR ? rr : 0))}`;
            if (trR) d += ` Q ${fmt(ri)} ${fmt(t)} ${fmt(ri)} ${fmt(t + rr)}`;
            d += ` V ${fmt(b - (brR ? rr : 0))}`;
            if (brR) d += ` Q ${fmt(ri)} ${fmt(b)} ${fmt(ri - rr)} ${fmt(b)}`;
            d += ` H ${fmt(l + (blR ? rr : 0))}`;
            if (blR) d += ` Q ${fmt(l)} ${fmt(b)} ${fmt(l)} ${fmt(b - rr)}`;
            d += ` V ${fmt(t + (tlR ? rr : 0))}`;
            if (tlR) d += ` Q ${fmt(l)} ${fmt(t)} ${fmt(l + rr)} ${fmt(t)}`;
            d += ' Z';
            pathParts.push(d);
          }
        }
        if (pathParts.length) moduleElements.push(<path key="pond" d={pathParts.join(' ')} fill={fillColor} />);
      } else if (isBarStyle) {
        const s = cellSize * moduleScale;
        const halfGap = (cellSize - s) / 2;
        const rr = fmt(s * 0.45);
        if (moduleStyle === 'barH') {
          for (let row = 0; row < moduleCount; row++) {
            let runStart = -1;
            for (let col = 0; col <= moduleCount; col++) {
              const isDark = col < moduleCount && modules.get(row, col);
              const ft = col < moduleCount ? classifyFinderModule(row, col, finderPositions) : null;
              const shouldConnect = isDark && !ft && !isCleared(row, col);
              if (shouldConnect) { if (runStart === -1) runStart = col; }
              else if (runStart !== -1) {
                const len = col - runStart;
                moduleElements.push(<rect key={`bh-${row}-${runStart}`} x={fmt(dataOriginX + runStart * cellSize + halfGap)} y={fmt(dataOriginY + row * cellSize + halfGap)} width={fmt(len * cellSize - 2 * halfGap)} height={fmt(s)} rx={rr} ry={rr} fill={fillColor} />);
                runStart = -1;
              }
            }
          }
        } else {
          for (let col = 0; col < moduleCount; col++) {
            let runStart = -1;
            for (let row = 0; row <= moduleCount; row++) {
              const isDark = row < moduleCount && modules.get(row, col);
              const ft = row < moduleCount ? classifyFinderModule(row, col, finderPositions) : null;
              const shouldConnect = isDark && !ft && !isCleared(row, col);
              if (shouldConnect) { if (runStart === -1) runStart = row; }
              else if (runStart !== -1) {
                const len = row - runStart;
                moduleElements.push(<rect key={`bv-${runStart}-${col}`} x={fmt(dataOriginX + col * cellSize + halfGap)} y={fmt(dataOriginY + runStart * cellSize + halfGap)} width={fmt(s)} height={fmt(len * cellSize - 2 * halfGap)} rx={rr} ry={rr} fill={fillColor} />);
                runStart = -1;
              }
            }
          }
        }
      } else {
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (!modules.get(row, col)) continue;
            if (isCleared(row, col)) continue;
            if (classifyFinderModule(row, col, finderPositions)) continue;
            const x = dataOriginX + col * cellSize;
            const y = dataOriginY + row * cellSize;
            moduleElements.push(renderModule(x, y, cellSize, moduleStyle, moduleScale, fillColor));
          }
        }
      }

      // Decorative fill
      const decorativeFillEnabled = design.decorativeFill ?? true;
      const decorativeElements = [];
      const decoSafeMargin = design.decorativeSafeMargin ?? 6;
      const decoShieldInset = design.decorativeShieldInset ?? 8;
      const decoScale = design.decorativeScale ?? 0.65;

      if (!bare && decorativeFillEnabled) {
        const density = design.decorativeDensity || 0.35;
        const decoSize = cellSize;
        const decoFill = colors.foreground;
        const exclLeft = qrArea.x - decoSafeMargin;
        const exclTop = qrArea.y - decoSafeMargin;
        const exclRight = qrArea.x + qrArea.size + decoSafeMargin;
        const exclBottom = qrArea.y + qrArea.size + decoSafeMargin;
        const dCols = Math.ceil(width / decoSize);
        const dRows = Math.ceil(height / decoSize);
        const decoGrid = [];
        for (let dr = 0; dr < dRows; dr++) {
          decoGrid[dr] = [];
          for (let dc = 0; dc < dCols; dc++) {
            const gx = dc * decoSize;
            const gy = dr * decoSize;
            const cx = gx + decoSize / 2;
            const cy = gy + decoSize / 2;
            if (cx >= exclLeft && cx <= exclRight && cy >= exclTop && cy <= exclBottom) { decoGrid[dr][dc] = false; continue; }
            const hash = (Math.imul(gx * 2654435761 | 0, gy * 2246822519 | 0) >>> 0) / 4294967296;
            decoGrid[dr][dc] = hash <= density;
          }
        }
        for (let dr = 0; dr < dRows; dr++) {
          for (let dc = 0; dc < dCols; dc++) {
            if (!decoGrid[dr][dc]) continue;
            decorativeElements.push(renderModule(dc * decoSize, dr * decoSize, decoSize, moduleStyle, decoScale, decoFill));
          }
        }
      }

      const insetSx = ((width - decoShieldInset * 2) / width).toFixed(4);
      const insetSy = ((height - decoShieldInset * 2) / height).toFixed(4);

      return { viewBox, width, height, path, qrArea, colors, bgFill, transparentBg, moduleElements, decorativeElements: bare ? [] : decorativeElements, glowEffect: bare ? false : glowEffect, innerBorder: bare ? false : innerBorder, gradient: design.gradient, glowColor: colors.outline, innerBorderOffset: 8, decorativeOpacity: design.decorativeOpacity ?? 0.25, decoShieldInset, insetSx, insetSy, bare: !!bare };
    } catch (err) {
      console.error('QRPreview error:', err);
      return null;
    }
  }, [value, design]);

  if (!svgContent) {
    return (
      <div className={`flex items-center justify-center text-gray-500 ${className}`}>
        <span className="text-sm">No QR data</span>
      </div>
    );
  }

  const { viewBox, width, height, path, qrArea, colors, bgFill, transparentBg, moduleElements, decorativeElements, glowEffect, innerBorder, gradient, glowColor, innerBorderOffset, decorativeOpacity, decoShieldInset, insetSx, insetSy, bare } = svgContent;
  const off = innerBorderOffset;
  const sx = ((width - off * 2) / width).toFixed(4);
  const sy = ((height - off * 2) / height).toFixed(4);
  const uid = id || `sqr-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={className}>
      <svg id={id} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" role="img" aria-label="QR Code" style={{ maxWidth: width, maxHeight: height }}>
        <defs>
          <clipPath id={`${uid}-clip`}><path d={path} /></clipPath>
          {!bare && <clipPath id={`${uid}-clip-inset`}><path d={path} transform={`translate(${decoShieldInset},${decoShieldInset}) scale(${insetSx},${insetSy})`} /></clipPath>}
          {gradient && buildGradientDef(gradient)}
          {glowEffect && (
            <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor={glowColor} floodOpacity="0.5" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
        </defs>

        {bare ? (
          !transparentBg && <rect x="0" y="0" width={width} height={height} fill={bgFill} />
        ) : (
          <path d={path} fill={bgFill} {...(glowEffect ? { filter: `url(#${uid}-glow)` } : {})} />
        )}

        {!transparentBg && (
          <rect x={qrArea.x} y={qrArea.y} width={qrArea.size} height={qrArea.size} rx={fmt(qrArea.size * 0.02)} ry={fmt(qrArea.size * 0.02)} fill={bgFill} {...(!bare ? { clipPath: `url(#${uid}-clip)` } : {})} />
        )}

        <g {...(!bare ? { clipPath: `url(#${uid}-clip)` } : {})}>{moduleElements}</g>

        {!bare && decorativeElements.length > 0 && (
          <g clipPath={`url(#${uid}-clip-inset)`} opacity={decorativeOpacity}>{decorativeElements}</g>
        )}

        {!bare && innerBorder && (
          <path d={path} fill="none" stroke={colors.outline} strokeWidth="1" opacity="0.35" transform={`translate(${off},${off}) scale(${sx},${sy})`} />
        )}

        {!bare && (
          <path d={path} fill="none" stroke={colors.outline} strokeWidth={colors.outlineWidth || 3} strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}
