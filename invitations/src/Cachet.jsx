/* Cachet de cire dessiné en SVG : couleur libre, initiales ou motif d'olivier. */

function eclaircir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)));
  return `rgb(${c.join(",")})`;
}

/* Contour irrégulier de la cire, toujours le même pour un même rayon */
function contour(r) {
  const pts = [];
  const N = 36;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const bosse = Math.sin(i * 2.7) * 0.035 + Math.sin(i * 5.3 + 1) * 0.025 + (i % 4 === 0 ? 0.03 : 0);
    const rr = r * (1 + bosse);
    pts.push([100 + Math.cos(a) * rr, 100 + Math.sin(a) * rr]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const p = pts[(i + 1) % N];
    const m = pts[i];
    const cx = (m[0] + p[0]) / 2, cy = (m[1] + p[1]) / 2;
    d += ` Q ${m[0].toFixed(1)} ${m[1].toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  return d + " Z";
}

const BORD = contour(88);

function Olivier({ couleur }) {
  const feuilles = [
    [-26, 14, -35], [-14, 4, 30], [-4, -6, -40], [8, -14, 28], [18, -22, -38], [28, -30, 20],
  ];
  return (
    <g transform="translate(100 104)" fill={couleur} stroke={couleur}>
      <path d="M -36 24 Q 0 0 34 -36" fill="none" strokeWidth="2.4" strokeLinecap="round" />
      {feuilles.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="11" ry="4.2" transform={`rotate(${r} ${x} ${y}) translate(${i % 2 ? 7 : -7} 0)`} stroke="none" />
      ))}
      <circle cx="-6" cy="8" r="4.2" stroke="none" />
      <circle cx="10" cy="-2" r="3.8" stroke="none" />
    </g>
  );
}

export default function Cachet({ couleur = "#6A6A33", initiales = "", className, style }) {
  const id = "c" + couleur.slice(1);
  const clair = eclaircir(couleur, 0.32);
  const sombre = eclaircir(couleur, -0.38);
  const grave = eclaircir(couleur, -0.22);
  const ini = initiales.trim().slice(0, 3);
  const taille = ini.length >= 3 ? 50 : ini.length === 2 ? 64 : 78;
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={id + "g"} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={clair} />
          <stop offset=".55" stopColor={couleur} />
          <stop offset="1" stopColor={sombre} />
        </radialGradient>
        <filter id={id + "o"} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#1a0a02" floodOpacity=".45" />
        </filter>
      </defs>
      <path d={BORD} fill={`url(#${id}g)`} filter={`url(#${id}o)`} />
      {/* cuvette pressée par le sceau */}
      <circle cx="100" cy="100" r="64" fill={grave} opacity=".55" />
      <circle cx="100" cy="100" r="64" fill="none" stroke={sombre} strokeWidth="2.5" opacity=".7" />
      <circle cx="101" cy="102" r="65.5" fill="none" stroke={clair} strokeWidth="1.6" opacity=".55" />
      <circle cx="100" cy="100" r="56" fill="none" stroke={sombre} strokeWidth="1" opacity=".45" />
      {ini ? (
        <g fontFamily="'Cormorant Garamond', 'Amiri', serif" fontWeight="500" fontSize={taille} textAnchor="middle" dominantBaseline="central">
          <text x="101.2" y="102.2" fill={clair} opacity=".55">{ini}</text>
          <text x="100" y="101" fill={sombre} opacity=".9">{ini}</text>
        </g>
      ) : (
        <>
          <g opacity=".5" transform="translate(1.2 1.2)"><Olivier couleur={clair} /></g>
          <g opacity=".85"><Olivier couleur={sombre} /></g>
        </>
      )}
    </svg>
  );
}
