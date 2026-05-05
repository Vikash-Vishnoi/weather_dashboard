"use client";

import { memo } from "react";

const sizeMap = { sm: 32, md: 48, lg: 80, xl: 120 };

export const WeatherIcon = memo(function WeatherIcon({
  conditionId,
  isDay,
  size = "md",
  className = "",
}) {
  const px = sizeMap[size] || sizeMap.md;

  const getIcon = () => {
    if (conditionId >= 200 && conditionId < 300) return <Thunderstorm px={px} />;
    if (conditionId >= 300 && conditionId < 400) return <Drizzle px={px} />;
    if (conditionId >= 500 && conditionId < 600) return <Rain px={px} />;
    if (conditionId >= 600 && conditionId < 700) return <Snow px={px} />;
    if (conditionId >= 700 && conditionId < 800) return <Fog px={px} />;
    if (conditionId === 800) return isDay ? <ClearDay px={px} /> : <ClearNight px={px} />;
    if (conditionId === 801) return isDay ? <FewCloudsDay px={px} /> : <FewCloudsNight px={px} />;
    return <Cloudy px={px} />;
  };

  return (
    <div className={className} style={{ width: px, height: px }}>
      {getIcon()}
    </div>
  );
});

function ClearDay({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <style>{`
        .sun-core { animation: pulse-sun 3s ease-in-out infinite; transform-origin: 50px 50px; }
        .sun-ray { animation: spin-rays 8s linear infinite; transform-origin: 50px 50px; }
        @keyframes pulse-sun { 0%,100%{r:18} 50%{r:20} }
        @keyframes spin-rays { to{transform:rotate(360deg)} }
      `}</style>
      <g className="sun-ray">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="17"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>
      <circle className="sun-core" cx="50" cy="50" r="18" fill="#FBBF24" />
      <circle cx="50" cy="50" r="14" fill="#FCD34D" />
    </svg>
  );
}

function ClearNight({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <style>{`
        .moon { animation: glow-moon 4s ease-in-out infinite; }
        @keyframes glow-moon { 0%,100%{filter:drop-shadow(0 0 4px #C7D2FE)} 50%{filter:drop-shadow(0 0 10px #A5B4FC)} }
      `}</style>
      <g className="moon">
        <path d="M60 20 A30 30 0 1 0 60 80 A20 20 0 1 1 60 20Z" fill="#C7D2FE" />
      </g>
      {[[75, 25], [80, 55], [68, 75], [30, 20]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#E0E7FF" opacity="0.7">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur={`${2 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

function FewCloudsDay({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <circle cx="35" cy="38" r="14" fill="#FBBF24" />
      <g opacity="0.9">
        <circle cx="45" cy="62" r="16" fill="white" />
        <circle cx="62" cy="65" r="13" fill="white" />
        <circle cx="30" cy="65" r="12" fill="white" />
        <rect x="30" y="65" width="45" height="12" fill="white" />
      </g>
    </svg>
  );
}

function FewCloudsNight({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <path d="M38 22 A16 16 0 1 0 38 54 A11 11 0 1 1 38 22Z" fill="#C7D2FE" />
      <g opacity="0.9">
        <circle cx="55" cy="68" r="16" fill="#CBD5E1" />
        <circle cx="70" cy="70" r="12" fill="#CBD5E1" />
        <circle cx="40" cy="70" r="11" fill="#CBD5E1" />
        <rect x="40" y="70" width="42" height="11" fill="#CBD5E1" />
      </g>
    </svg>
  );
}

function Cloudy({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <style>{`.cloud{animation:float-cloud 4s ease-in-out infinite;transform-origin:50px 50px}
        @keyframes float-cloud{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}`}</style>
      <g className="cloud">
        <circle cx="38" cy="50" r="20" fill="#94A3B8" />
        <circle cx="62" cy="54" r="17" fill="#94A3B8" />
        <circle cx="25" cy="57" r="14" fill="#94A3B8" />
        <rect x="25" y="57" width="54" height="15" fill="#94A3B8" />
      </g>
    </svg>
  );
}

function Rain({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <style>{`
        .drop{animation:fall 1.2s ease-in infinite;}
        .d1{animation-delay:0s}.d2{animation-delay:0.3s}.d3{animation-delay:0.6s}.d4{animation-delay:0.9s}
        @keyframes fall{0%{transform:translateY(0);opacity:1}100%{transform:translateY(20px);opacity:0}}
      `}</style>
      <circle cx="38" cy="38" r="18" fill="#64748B" />
      <circle cx="60" cy="42" r="15" fill="#64748B" />
      <circle cx="24" cy="45" r="12" fill="#64748B" />
      <rect x="24" y="45" width="51" height="12" fill="#64748B" />
      <g fill="#60A5FA">
        <line className="drop d1" x1="35" y1="62" x2="30" y2="74" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        <line className="drop d2" x1="50" y1="62" x2="45" y2="74" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        <line className="drop d3" x1="65" y1="62" x2="60" y2="74" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        <line className="drop d4" x1="42" y1="68" x2="37" y2="80" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Drizzle({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <circle cx="38" cy="38" r="18" fill="#64748B" />
      <circle cx="60" cy="42" r="15" fill="#64748B" />
      <circle cx="24" cy="45" r="12" fill="#64748B" />
      <rect x="24" y="45" width="51" height="12" fill="#64748B" />
      {[[33, 62], [46, 67], [59, 62], [40, 74], [53, 74]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#93C5FD">
          <animate
            attributeName="cy"
            from={y}
            to={y + 12}
            dur="1.4s"
            begin={`${i * 0.28}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0"
            dur="1.4s"
            begin={`${i * 0.28}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

function Thunderstorm({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <style>{`.bolt{animation:flash 2s ease-in-out infinite;}
        @keyframes flash{0%,90%,100%{opacity:1}95%{opacity:0.2}}`}</style>
      <circle cx="38" cy="35" r="20" fill="#334155" />
      <circle cx="62" cy="40" r="17" fill="#334155" />
      <circle cx="22" cy="44" r="13" fill="#334155" />
      <rect x="22" y="44" width="57" height="13" fill="#334155" />
      <polygon className="bolt" points="52,58 44,72 50,72 42,88 60,68 54,68 62,58" fill="#FCD34D" />
    </svg>
  );
}

function Snow({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      <circle cx="38" cy="38" r="18" fill="#94A3B8" />
      <circle cx="60" cy="42" r="15" fill="#94A3B8" />
      <circle cx="24" cy="45" r="12" fill="#94A3B8" />
      <rect x="24" y="45" width="51" height="12" fill="#94A3B8" />
      {[[35, 65], [50, 65], [65, 65], [42, 77], [57, 77]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="white" opacity="0.9">
            <animate
              attributeName="cy"
              from={y}
              to={y + 14}
              dur={`${1.6 + i * 0.2}s`}
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0"
              dur={`${1.6 + i * 0.2}s`}
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

function Fog({ px }) {
  return (
    <svg viewBox="0 0 100 100" width={px} height={px}>
      {[30, 45, 58, 70].map((y, i) => (
        <rect
          key={i}
          x={10 + i * 3}
          y={y}
          width={80 - i * 6}
          height="6"
          rx="3"
          fill="#94A3B8"
          opacity="0.7"
        >
          <animate
            attributeName="x"
            values={`${10 + i * 3};${14 + i * 3};${10 + i * 3}`}
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}
