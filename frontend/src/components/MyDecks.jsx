import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDecks } from '../hooks/useDecks';
import { encodeDeck } from '../utils/deckCode';
import FactionIcon from './FactionIcon';
import Card from './Card';
import cardData from '../data/cards.json';

const { cards, factions } = cardData;

export default function MyDecks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchMyDecks, deleteDeck, loading } = useDecks();
  const [decks, setDecks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (user) {
      loadDecks();
    }
  }, [user]);

  async function loadDecks() {
    const result = await fetchMyDecks();
    setDecks(result);
  }

  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this deck?')) {
      const success = await deleteDeck(id);
      if (success) {
        setDecks(decks.filter(d => d.id !== id));
      }
    }
  }

  function getDeckFactions(deckCards) {
    const factionCounts = {};
    deckCards.forEach(cardId => {
      const card = cards.find(c => c.cardId === cardId);
      if (card) {
        factionCounts[card.faction] = (factionCounts[card.faction] || 0) + 1;
      }
    });
    return Object.entries(factionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({
        ...factions.find(f => f.id === id),
        count
      }));
  }

  function getTotalCost(deckCards) {
    return deckCards.reduce((sum, cardId) => {
      const card = cards.find(c => c.cardId === cardId);
      return sum + (card?.rankCost || 0);
    }, 0);
  }

  function copyDeckCode(deck) {
    const code = encodeDeck({
      name: deck.name,
      cards: deck.cards,
      cardBack: deck.cardBack
    });
    navigator.clipboard.writeText(code);
    setCopiedId(deck.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="panel text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-frame-gold/20 to-frame-bronze/10 flex items-center justify-center border border-frame-gold/30">
            <svg className="w-10 h-10 text-frame-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-fantasy font-bold text-frame-gold mb-3">My Decks</h1>
          <p className="text-gray-400 mb-6">Please login to view your decks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-frame-gold/30 to-frame-bronze/20 flex items-center justify-center border border-frame-gold/40">
            <svg className="w-5 h-5 text-frame-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-fantasy font-bold text-frame-gold">My Decks</h1>
            <p className="text-sm text-gray-500">Manage your deck collection</p>
          </div>
        </div>

        <Link to="/" className="btn-fantasy">
          Create New Deck
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">
          <svg className="animate-spin w-8 h-8 mx-auto mb-4 text-frame-gold" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading your decks...
        </div>
      ) : decks.length === 0 ? (
        <div className="panel text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-card/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-400 mb-4">You haven't created any decks yet.</p>
          <Link to="/" className="btn-fantasy inline-block">
            Create your first deck!
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {decks.map((deck) => {
            const deckFactions = getDeckFactions(deck.cards);
            const totalCost = getTotalCost(deck.cards);
            const primaryFaction = deckFactions[0];

            return (
              <div
                key={deck.id}
                className="panel relative overflow-hidden group"
                style={{
                  borderColor: primaryFaction ? `${primaryFaction.color}30` : undefined,
                }}
              >
                {/* Faction accent */}
                {primaryFaction && (
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: primaryFaction.color }}
                  />
                )}

                <div className="flex items-start justify-between">
                  <div className="pl-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-frame-gold transition-colors">
                        {deck.name}
                      </h3>
                      {deck.isPublic && (
                        <span className="px-2.5 py-0.5 bg-green-600/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Updated {new Date(deck.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {deck.isPublic && (
                      <>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {deck.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          {deck.likes}
                        </span>
                      </>
                    )}
                    <span className="star-cost">{totalCost}★</span>
                  </div>
                </div>

                {/* Faction Tags */}
                <div className="flex gap-2 mt-3 pl-3">
                  {deckFactions.map((faction) => (
                    <span
                      key={faction.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${faction.color}20`,
                        color: faction.color,
                        border: `1px solid ${faction.color}40`,
                      }}
                    >
                      <FactionIcon faction={faction.id} size="sm" showBackground={false} />
                      {faction.name} ({faction.count})
                    </span>
                  ))}
                </div>

                {/* Card Preview */}
                <div className="flex gap-1.5 mt-4 pl-3 overflow-x-auto pb-2">
                  {deck.cards.map((cardId, index) => {
                    const card = cards.find(c => c.cardId === cardId);
                    return card ? (
                      <Card key={`${deck.id}-${cardId}-${index}`} card={card} small />
                    ) : null;
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pl-3">
                  <Link to={`/deck/${deck.id}`} className="btn-fantasy text-sm px-4 py-2">
                    Edit
                  </Link>
                  <button
                    onClick={() => copyDeckCode(deck)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      copiedId === deck.id
                        ? 'bg-green-600 text-white'
                        : 'btn-fantasy-secondary'
                    }`}
                  >
                    {copiedId === deck.id ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    onClick={() => handleDelete(deck.id)}
                    className="btn-fantasy-danger text-sm px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
