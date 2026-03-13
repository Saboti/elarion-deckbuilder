const factionData = {
  nocturne: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
      </svg>
    ),
    color: '#6b21a8',
    bgColor: 'bg-purple-900/60',
  },
  ironheart: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    color: '#b45309',
    bgColor: 'bg-amber-900/60',
  },
  wildborn: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M6.5 21C4 21 2 19 2 16.5 2 14 3 12 6 10c-1-2 .5-3.5 2.5-3.5C10 6.5 11 7 11 8.5c.5-1 1.5-1.5 3-1.5 2 0 3 1.5 2.5 3.5 3 2 4 4 4 6.5 0 2.5-2 4.5-4.5 4.5-1.5 0-2.5-.5-3.5-1.5-.5.5-1.5 1-3 1z" />
      </svg>
    ),
    color: '#15803d',
    bgColor: 'bg-green-900/60',
  },
  veilwalkers: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
      </svg>
    ),
    color: '#0369a1',
    bgColor: 'bg-sky-900/60',
  },
  silvertongue: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.643.792 3.099 2.013 4.013C6.217 12.177 4 15.314 4 19h2c0-3.309 2.691-6 6-6s6 2.691 6 6h2c0-3.686-2.217-6.823-5.013-7.987C16.208 10.099 17 8.643 17 7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z" />
      </svg>
    ),
    color: '#64748b',
    bgColor: 'bg-slate-800/60',
  },
  fleshbound: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    color: '#be123c',
    bgColor: 'bg-rose-900/60',
  },
};

export default function FactionIcon({ faction, size = 'md', showBackground = true }) {
  const data = factionData[faction];
  if (!data) return null;

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  const iconSizeClasses = {
    sm: '[&_svg]:w-3 [&_svg]:h-3',
    md: '[&_svg]:w-4 [&_svg]:h-4',
    lg: '[&_svg]:w-6 [&_svg]:h-6',
    xl: '[&_svg]:w-10 [&_svg]:h-10',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${iconSizeClasses[size]}
        rounded-full flex items-center justify-center
        ${showBackground ? data.bgColor : ''}
        transition-all duration-200
      `}
      style={{
        color: data.color,
        boxShadow: showBackground ? `0 0 10px ${data.color}40` : 'none',
        border: showBackground ? `1px solid ${data.color}60` : 'none',
      }}
      title={faction.charAt(0).toUpperCase() + faction.slice(1)}
    >
      {data.icon}
    </div>
  );
}

export function FactionIconLarge({ faction }) {
  const data = factionData[faction];
  if (!data) return null;

  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center opacity-30"
      style={{ color: data.color }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
        {data.icon.props.children}
      </svg>
    </div>
  );
}

export { factionData };
