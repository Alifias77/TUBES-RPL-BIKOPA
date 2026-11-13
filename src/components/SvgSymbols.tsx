import React from 'react';

export default function SvgSymbols() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="bus-side" viewBox="0 0 420 160">
          <ellipse cx="210" cy="146" rx="195" ry="8" fill="#000" opacity=".22" />
          <rect x="10" y="18" width="400" height="108" rx="20" fill="#f4f6fa" />
          <rect x="10" y="100" width="400" height="10" fill="#ff6b4a" />
          <rect x="28" y="34" width="300" height="52" rx="8" fill="#1d2b45" />
          <g stroke="#f4f6fa" strokeWidth="5">
            <path d="M78 34v52M128 34v52M178 34v52M228 34v52M278 34v52" />
          </g>
          <path d="M340 34h26q28 0 36 24v28h-62z" fill="#1d2b45" />
          <rect x="392" y="96" width="12" height="9" rx="3" fill="#ffc233" />
          <circle cx="92" cy="128" r="23" fill="#111827" />
          <circle cx="92" cy="128" r="10" fill="#9aa5b8" />
          <circle cx="326" cy="128" r="23" fill="#111827" />
          <circle cx="326" cy="128" r="10" fill="#9aa5b8" />
        </symbol>

        <symbol id="van-side" viewBox="0 0 340 140">
          <ellipse cx="170" cy="128" rx="158" ry="7" fill="#000" opacity=".22" />
          <path d="M10 42Q10 20 32 20H248Q280 20 300 54L324 80Q330 86 330 96V112H10Z" fill="#f4f6fa" />
          <rect x="10" y="94" width="320" height="7" fill="#ff6b4a" />
          <rect x="30" y="32" width="200" height="40" rx="6" fill="#1d2b45" />
          <g stroke="#f4f6fa" strokeWidth="5">
            <path d="M96 32v40M162 32v40" />
          </g>
          <path d="M248 32h14q16 0 30 24l8 14h-52z" fill="#1d2b45" />
          <circle cx="80" cy="112" r="20" fill="#111827" />
          <circle cx="80" cy="112" r="9" fill="#9aa5b8" />
          <circle cx="260" cy="112" r="20" fill="#111827" />
          <circle cx="260" cy="112" r="9" fill="#9aa5b8" />
        </symbol>

        <symbol id="car-side" viewBox="0 0 300 120">
          <ellipse cx="150" cy="110" rx="136" ry="6" fill="#000" opacity=".22" />
          <path d="M15 80Q15 62 35 58L70 56Q90 28 122 26H180Q210 28 228 54L268 60Q285 64 285 82V94H15Z" fill="#f4f6fa" />
          <path d="M92 54Q104 36 126 36H174Q194 38 208 54Z" fill="#1d2b45" />
          <rect x="15" y="82" width="270" height="6" fill="#ff6b4a" />
          <circle cx="78" cy="94" r="20" fill="#111827" />
          <circle cx="78" cy="94" r="9" fill="#9aa5b8" />
          <circle cx="224" cy="94" r="20" fill="#111827" />
          <circle cx="224" cy="94" r="9" fill="#9aa5b8" />
        </symbol>

        <symbol id="bus-front" viewBox="0 0 240 220">
          <ellipse cx="120" cy="208" rx="100" ry="8" fill="#000" opacity=".2" />
          <rect x="10" y="62" width="14" height="42" rx="5" fill="#1d2b45" />
          <rect x="216" y="62" width="14" height="42" rx="5" fill="#1d2b45" />
          <rect x="26" y="176" width="28" height="30" rx="7" fill="#111827" />
          <rect x="186" y="176" width="28" height="30" rx="7" fill="#111827" />
          <rect x="30" y="8" width="180" height="176" rx="30" fill="#f7f8fb" />
          <rect x="82" y="16" width="76" height="10" rx="4" fill="#ff6b4a" />
          <rect x="46" y="34" width="148" height="82" rx="14" fill="#22324f" />
          <path d="M58 44h50l-18 62H58z" fill="#fff" opacity=".1" />
          <circle cx="120" cy="134" r="9" fill="#ff6b4a" />
          <rect x="70" y="146" width="100" height="18" rx="6" fill="#cfd6e2" />
          <circle cx="54" cy="150" r="10" fill="#fff" stroke="#ffc233" strokeWidth="3" />
          <circle cx="186" cy="150" r="10" fill="#fff" stroke="#ffc233" strokeWidth="3" />
          <rect x="34" y="170" width="172" height="14" rx="7" fill="#9aa5b8" />
        </symbol>

        <symbol id="scene-road" viewBox="0 0 300 180">
          <rect width="300" height="180" fill="#a9d3f0" />
          <g fill="#7fa3c4">
            <rect x="20" y="52" width="26" height="40" />
            <rect x="50" y="64" width="20" height="28" />
            <rect x="230" y="48" width="30" height="44" />
            <rect x="262" y="62" width="22" height="30" />
          </g>
          <rect y="90" width="300" height="90" fill="#6fae6b" />
          <polygon points="136,90 164,90 262,180 38,180" fill="#4a5568" />
          <polygon points="148,92 152,92 168,180 132,180" fill="#e5e9f0" opacity=".9" />
          <polygon points="136,90 140,90 52,180 38,180" fill="#e5e9f0" opacity=".5" />
          <polygon points="164,90 160,90 248,180 262,180" fill="#e5e9f0" opacity=".5" />
        </symbol>

        <symbol id="scene-castle" viewBox="0 0 300 180">
          <rect width="300" height="180" fill="#9fd0f0" />
          <ellipse cx="60" cy="34" rx="34" ry="10" fill="#fff" opacity=".8" />
          <ellipse cx="250" cy="48" rx="30" ry="9" fill="#fff" opacity=".7" />
          <rect x="70" y="70" width="160" height="80" fill="#c8b697" />
          <rect x="54" y="52" width="40" height="98" fill="#bba886" />
          <rect x="206" y="52" width="40" height="98" fill="#bba886" />
          <polygon points="54,52 74,26 94,52" fill="#8a5a44" />
          <polygon points="206,52 226,26 246,52" fill="#8a5a44" />
          <rect x="128" y="44" width="44" height="106" fill="#d3c2a3" />
          <polygon points="128,44 150,16 172,44" fill="#8a5a44" />
          <path d="M136 150v-28a14 14 0 0128 0v28z" fill="#5a4636" />
          <g fill="#5a4636">
            <rect x="70" y="84" width="8" height="16" rx="3" />
            <rect x="222" y="84" width="8" height="16" rx="3" />
            <rect x="104" y="90" width="8" height="14" rx="3" />
            <rect x="188" y="90" width="8" height="14" rx="3" />
          </g>
          <rect y="150" width="300" height="30" fill="#6fae6b" />
          <path d="M130 180l8-30h24l8 30z" fill="#d9cdb3" />
        </symbol>
      </defs>
    </svg>
  );
}
