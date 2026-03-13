import FactionIcon from './FactionIcon';
import cardData from '../data/cards.json';

const { factions } = cardData;

export default function Filters({ filters, setFilters }) {
  return (
    <div className="panel space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search cards by name or ability..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="input pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Faction Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ ...filters, faction: '' })}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${!filters.faction
                ? 'bg-gradient-to-r from-frame-gold/30 to-frame-bronze/20 text-frame-gold border border-frame-gold/40'
                : 'bg-surface-card/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              }
            `}
          >
            All
          </button>
          {factions.map((faction) => (
            <button
              key={faction.id}
              onClick={() => setFilters({ ...filters, faction: faction.id })}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${filters.faction === faction.id
                  ? 'text-white border'
                  : 'bg-surface-card/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                }
              `}
              style={{
                backgroundColor: filters.faction === faction.id ? `${faction.color}40` : undefined,
                borderColor: filters.faction === faction.id ? `${faction.color}80` : undefined,
                boxShadow: filters.faction === faction.id ? `0 0 15px ${faction.color}30` : undefined,
              }}
            >
              <FactionIcon faction={faction.id} size="sm" showBackground={false} />
              <span className="hidden sm:inline">{faction.name}</span>
            </button>
          ))}
        </div>

        {/* Cost Filter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Cost:</span>
          <div className="flex gap-1">
            {[2, 3, 4, 5].map((cost) => (
              <button
                key={cost}
                onClick={() => setFilters({ ...filters, cost: filters.cost === cost ? null : cost })}
                className={`
                  w-9 h-9 rounded-lg font-bold transition-all duration-200 flex items-center justify-center
                  ${filters.cost === cost
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-lg'
                    : 'bg-surface-card/50 text-gray-400 border border-gray-700 hover:border-yellow-500/50'
                  }
                `}
                style={{
                  boxShadow: filters.cost === cost ? '0 0 15px rgba(234, 179, 8, 0.4)' : undefined,
                }}
              >
                <span className="star-cost text-sm">{'★'.repeat(Math.min(cost, 2))}</span>
                {cost > 2 && <span className="text-xs ml-0.5">{cost}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-gray-500 text-sm">Sort:</span>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="input w-auto py-2 text-sm bg-surface-card/50"
          >
            <option value="faction">Faction</option>
            <option value="name">Name</option>
            <option value="cost">Cost</option>
            <option value="power">Power</option>
            <option value="damage">Damage</option>
          </select>
        </div>
      </div>
    </div>
  );
}
