import { calculateDeckStats, getFactionDistribution, getClanBonus } from '../utils/deckCode';
import FactionIcon from './FactionIcon';
import cardData from '../data/cards.json';

const { factions } = cardData;

export default function DeckStats({ deckCards, totalCost, maxCost }) {
  const stats = calculateDeckStats(deckCards, cardData.cards);
  const distribution = getFactionDistribution(deckCards, cardData.cards);
  const bonuses = getClanBonus(distribution);

  if (!stats) {
    return (
      <div className="panel text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-card/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">Add cards to see stats</p>
      </div>
    );
  }

  return (
    <div className="panel space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-frame-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="font-fantasy font-semibold text-frame-gold">Deck Stats</h3>
      </div>

      {/* Averages Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Avg Cost"
          value={stats.avgCost}
          color="yellow"
          icon="★"
        />
        <StatCard
          label="Avg Power"
          value={stats.avgPower}
          color="blue"
          icon="⚔"
        />
        <StatCard
          label="Avg Damage"
          value={stats.avgDamage}
          color="red"
          icon="💥"
        />
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-card/50 rounded-lg p-3 border border-blue-500/20">
          <p className="text-blue-400 text-2xl font-bold">{stats.totalPower}</p>
          <p className="text-xs text-gray-500">Total Power</p>
        </div>
        <div className="bg-surface-card/50 rounded-lg p-3 border border-red-500/20">
          <p className="text-red-400 text-2xl font-bold">{stats.totalDamage}</p>
          <p className="text-xs text-gray-500">Total Damage</p>
        </div>
      </div>

      <div className="ornament-divider" />

      {/* Cost Curve */}
      <div>
        <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
          <span className="star-cost">★</span>
          Cost Curve
        </p>
        <div className="flex items-end gap-2 h-20 px-2">
          {Object.entries(stats.costCurve).map(([cost, count]) => {
            const maxCount = Math.max(...Object.values(stats.costCurve), 1);
            const height = (count / maxCount) * 100;
            return (
              <div key={cost} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-all duration-500 relative group"
                  style={{
                    height: `${height}%`,
                    minHeight: count > 0 ? '8px' : '0',
                    background: count > 0
                      ? 'linear-gradient(180deg, rgba(234, 179, 8, 0.8) 0%, rgba(234, 179, 8, 0.4) 100%)'
                      : 'transparent',
                    boxShadow: count > 0 ? '0 0 10px rgba(234, 179, 8, 0.3)' : 'none',
                  }}
                >
                  {count > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-400">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{cost}★</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ornament-divider" />

      {/* Faction Distribution */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Faction Distribution</p>
        <div className="space-y-2">
          {Object.entries(distribution).map(([factionId, count]) => {
            const faction = factions.find(f => f.id === factionId);
            const percentage = (count / deckCards.length) * 100;
            return (
              <div key={factionId} className="flex items-center gap-3">
                <FactionIcon faction={factionId} size="sm" />
                <span className="text-sm flex-1 text-gray-300">{faction?.name}</span>
                <div className="w-20 h-2 rounded-full bg-surface-card overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: faction?.color,
                      boxShadow: `0 0 8px ${faction?.color}60`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-400 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clan Bonuses */}
      {bonuses.length > 0 && (
        <>
          <div className="ornament-divider" />
          <div>
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Clan Bonuses
            </p>
            <div className="space-y-2">
              {bonuses.map(({ faction, count, bonus }) => {
                const factionData = factions.find(f => f.id === faction);
                const isMajor = bonus === 'Major';
                return (
                  <div
                    key={faction}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200
                      ${isMajor ? 'animate-glow' : ''}
                    `}
                    style={{
                      backgroundColor: `${factionData?.color}20`,
                      borderColor: `${factionData?.color}40`,
                      boxShadow: isMajor ? `0 0 15px ${factionData?.color}40` : 'none',
                      color: factionData?.color,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FactionIcon faction={faction} size="sm" />
                      <span className="text-sm font-medium text-white">{factionData?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`
                        text-xs font-bold px-2 py-0.5 rounded
                        ${isMajor
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-700/50 text-gray-300'
                        }
                      `}>
                        {bonus}
                      </span>
                      <span className="text-xs text-gray-400">({count}/8)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const colorClasses = {
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  };

  return (
    <div className={`
      rounded-lg p-3 text-center border
      bg-gradient-to-br ${colorClasses[color]}
    `}>
      <p className={`text-xl font-bold ${colorClasses[color].split(' ').pop()}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        <span className="mr-1">{icon}</span>
        {label}
      </p>
    </div>
  );
}
