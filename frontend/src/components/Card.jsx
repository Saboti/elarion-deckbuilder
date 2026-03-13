import FactionIcon, { factionData } from './FactionIcon';

const IMAGE_BASE = 'https://elarionaetherfall.com/card-art';

const factionColors = {
  nocturne: { ring: 'ring-purple-600', bg: 'from-purple-900/40 to-purple-950/60' },
  ironheart: { ring: 'ring-amber-600', bg: 'from-amber-900/40 to-amber-950/60' },
  wildborn: { ring: 'ring-green-600', bg: 'from-green-900/40 to-green-950/60' },
  veilwalkers: { ring: 'ring-sky-600', bg: 'from-sky-900/40 to-sky-950/60' },
  silvertongue: { ring: 'ring-slate-500', bg: 'from-slate-800/40 to-slate-900/60' },
  fleshbound: { ring: 'ring-rose-600', bg: 'from-rose-900/40 to-rose-950/60' },
};

function StarRating({ count, small }) {
  return (
    <div className={`flex ${small ? 'gap-0' : 'gap-0.5'}`}>
      {[...Array(count)].map((_, i) => (
        <span
          key={i}
          className={`star-cost ${small ? 'text-[8px]' : 'text-xs'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Card({ card, onClick, selected, small, showAbility }) {
  const imageUrl = `${IMAGE_BASE}/${card.cardId}.png`;
  const factionStyle = factionColors[card.faction] || factionColors.nocturne;
  const factionColor = factionData[card.faction]?.color || '#6b21a8';

  return (
    <div
      onClick={() => onClick?.(card)}
      className={`
        card card-frame relative
        ${factionStyle.ring}
        ${selected ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2'}
        ${small ? 'w-20' : 'w-36'}
        aspect-[2/3]
        group
      `}
      style={{
        '--faction-color': factionColor,
      }}
    >
      {/* Card Background / Artwork */}
      <div className={`absolute inset-0 bg-gradient-to-b ${factionStyle.bg}`}>
        <img
          src={imageUrl}
          alt={card.name}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Top Row: Stars + Faction Badge */}
      <div className={`absolute top-1.5 left-1.5 right-1.5 flex justify-between items-start ${small ? 'top-1' : ''}`}>
        {/* Star Cost */}
        <div
          className={`
            flex items-center justify-center rounded-md px-1.5 py-0.5
            bg-black/60 backdrop-blur-sm
          `}
        >
          <StarRating count={card.rankCost} small={small} />
        </div>

        {/* Faction Badge */}
        {!small && (
          <FactionIcon faction={card.faction} size="md" />
        )}
      </div>

      {/* Name Banner */}
      {!small && (
        <div className="name-banner">
          <p
            className="text-xs font-semibold text-white truncate"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            {card.name}
          </p>
        </div>
      )}

      {/* Bottom Stats: Power (left) + Damage (right) */}
      <div className={`absolute ${small ? 'bottom-0.5 left-0.5 right-0.5' : 'bottom-1.5 left-1.5 right-1.5'} flex justify-between items-end`}>
        {/* Power Badge (Blue) */}
        <div
          className={`
            stat-badge stat-badge-power
            ${small ? 'w-5 h-5 text-[10px]' : 'w-8 h-8 text-sm'}
          `}
        >
          {card.power}
        </div>

        {/* Damage Badge (Red) */}
        <div
          className={`
            stat-badge stat-badge-damage
            ${small ? 'w-5 h-5 text-[10px]' : 'w-8 h-8 text-sm'}
          `}
        >
          {card.damage}
        </div>
      </div>

      {/* Selection Glow Effect */}
      {selected && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 20px rgba(234, 179, 8, 0.6), inset 0 0 20px rgba(234, 179, 8, 0.2)`,
          }}
        />
      )}

      {/* Hover Overlay with Ability */}
      {showAbility && !small && (
        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center p-3 rounded-xl">
          <p className="text-xs font-semibold text-yellow-400 mb-1">{card.name}</p>
          <p className="text-[10px] text-gray-300 leading-relaxed">{card.ability}</p>
          <div className="mt-2 flex items-center gap-2 text-[10px]">
            <span className="text-yellow-400">★{card.rankCost}</span>
            <span className="text-blue-400">PWR {card.power}</span>
            <span className="text-red-400">DMG {card.damage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
