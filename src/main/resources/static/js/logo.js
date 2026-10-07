/**
 * Phoe Wa Lone - Dynamic Logo Component
 */
document.addEventListener("DOMContentLoaded", function () {
    const logoContainers = document.querySelectorAll(".logo-badge, #logo-container");

    if (!logoContainers.length) {
        return;
    }

    const logoSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 100%; height: 100%; display: block;">
      <defs>
        <radialGradient id="circleBg" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ab7aff" />
          <stop offset="55%" stop-color="#6e48c4" />
          <stop offset="100%" stop-color="#3d1d85" />
        </radialGradient>
        <radialGradient id="bodyRed3D" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ff6b6b" />
          <stop offset="50%" stop-color="#ee0000" />
          <stop offset="100%" stop-color="#880000" />
        </radialGradient>
        <radialGradient id="face3D" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#fff8e1" />
          <stop offset="80%" stop-color="#ffe0b2" />
          <stop offset="100%" stop-color="#f57c00" />
        </radialGradient>
        <linearGradient id="gold3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff176" />
          <stop offset="50%" stop-color="#ffd54f" />
          <stop offset="100%" stop-color="#ff8f00" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#120029" flood-opacity="0.45"/>
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#ffe082" flood-opacity="0.8"/>
        </filter>
        <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
        <path id="circleTextArc" d="M 22,130 A 82,82 0 0,0 178,130" fill="none"/>
      </defs>

      <circle cx="100" cy="100" r="92" fill="url(#circleBg)" stroke="url(#gold3D)" stroke-width="4" filter="url(#dropShadow)" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.3" />

      <g fill="#ffe082" filter="url(#glow)">
        <path d="M 32,45 L 34,53 L 42,55 L 34,57 L 32,65 L 30,57 L 22,55 L 30,53 Z" />
        <path d="M 162,38 L 164,44 L 170,46 L 164,48 L 162,54 L 160,48 L 154,46 L 160,44 Z" />
        <circle cx="168" cy="85" r="2.5" />
        <circle cx="28" cy="98" r="3" />
      </g>

      <g transform="translate(0, -8)" filter="url(#dropShadow)">
        <path d="M 100,36 C 128,36 144,60 144,96 C 144,128 126,140 100,140 C 74,140 56,128 56,96 C 56,60 72,36 100,36 Z" fill="url(#bodyRed3D)" />
        <path d="M 60,110 Q 100,122 140,110 Q 100,117 60,110 Z" fill="url(#gold3D)" />
        <ellipse cx="100" cy="74" rx="30" ry="26" fill="url(#face3D)" />
        <path d="M 92,40 C 92,23 108,23 108,40 Z" fill="#1a1a1a" />
        <ellipse cx="100" cy="40" rx="5.5" ry="2.8" fill="url(#gold3D)" />
        <g>
          <ellipse cx="89" cy="69" rx="5.5" ry="7.5" fill="#111111" />
          <ellipse cx="87" cy="66" rx="2.2" ry="3" fill="#ffffff" />
          <circle cx="91" cy="72" r="1" fill="#ffffff" />
          <ellipse cx="111" cy="69" rx="5.5" ry="7.5" fill="#111111" />
          <ellipse cx="109" cy="66" rx="2.2" ry="3" fill="#ffffff" />
          <circle cx="113" cy="72" r="1" fill="#ffffff" />
          <path d="M 83,59 Q 89,54 95,59" fill="none" stroke="#4e342e" stroke-width="2.2" stroke-linecap="round" />
          <path d="M 105,59 Q 111,54 117,59" fill="none" stroke="#4e342e" stroke-width="2.2" stroke-linecap="round" />
        </g>
        <circle cx="79" cy="80" r="6" fill="#fff59d" opacity="0.85" />
        <circle cx="121" cy="80" r="6" fill="#fff59d" opacity="0.85" />
        <circle cx="79" cy="80" r="3.5" fill="#ff8a80" opacity="0.35" />
        <circle cx="121" cy="80" r="3.5" fill="#ff8a80" opacity="0.35" />
        <ellipse cx="100" cy="76" rx="1.6" ry="1" fill="#e65100" />
        <path d="M 91,82 Q 100,94 109,82 Z" fill="#b71c1c" stroke="#800000" stroke-width="0.8" />
        <path d="M 94,88 Q 100,93 106,88 Q 100,85 94,88 Z" fill="#ff8a80" />
        <g transform="translate(42, 88) rotate(-15)">
          <circle cx="7" cy="7" r="7" fill="#ffe0b2" stroke="#f57c00" stroke-width="1.2" />
        </g>
        <g transform="translate(134, 74) rotate(-28)">
          <circle cx="2" cy="9" r="6.5" fill="#ffe0b2" stroke="#f57c00" stroke-width="1.2" />
          <rect x="4" y="-16" width="9" height="30" rx="2.5" fill="#29b6f6" />
          <polygon points="4,14 13,14 8.5,22" fill="#ffe082" />
          <polygon points="7,19 10,19 8.5,22" fill="#212121" />
          <rect x="4" y="-16" width="9" height="6" fill="#ff5252" />
        </g>
      </g>

      <text font-family="sans-serif" font-weight="900" font-size="18.5" fill="url(#gold3D)" letter-spacing="1.5" filter="url(#textGlow)">
        <textPath href="#circleTextArc" startOffset="50%" text-anchor="middle">
          PHOE WA LONE
        </textPath>
      </text>
    </svg>
    `;

    logoContainers.forEach(container => {
        container.innerHTML = logoSVG;
    });
});