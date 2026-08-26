/** Four chevrons and a signal trace — the NEAR Lab mark.
 *  `tone` flips it for the dark footer. */
export function LogoMark({ tone = 'navy' }: { tone?: 'navy' | 'inverse' }) {
  const ink = tone === 'navy' ? '#1A3E62' : '#FEFEFE';
  const knockout = tone === 'navy' ? '#FEFEFE' : '#0E2438';
  const trace = tone === 'navy' ? '#575755' : '#8FADC8';

  const placements = [
    'translate(48,4) rotate(-12) scale(0.34)',
    'translate(78,18) rotate(-20) scale(0.34)',
    'translate(4,52) rotate(10) scale(0.34)',
    'translate(46,58) rotate(22) scale(0.34)',
  ];

  return (
    <svg viewBox="-16 0 132 92" width="46" height="32" aria-hidden="true" style={{ overflow: 'visible' }}>
      <g fill={ink}>
        {placements.map((transform) => (
          <g key={transform} transform={transform}>
            <path
              d="M99 35 L32 2 Q24 -1 26 7 L48 33 Q49 35 48 37 L26 63 Q24 71 32 68 Z"
              stroke={ink}
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <circle cx="4" cy="35" r="14" />
            <circle cx="74" cy="35" r="10" fill={knockout} />
          </g>
        ))}
      </g>
      <polyline
        points="26,58 44,38 60,58 74,42"
        fill="none"
        stroke={trace}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
