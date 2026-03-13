import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDecks } from '../hooks/useDecks';
import { useAuth } from '../hooks/useAuth';
import { encodeDeck } from '../utils/deckCode';
import FactionIcon from './FactionIcon';
import Card from './Card';
import cardData from '../data/cards.json';

const { cards, factions } = cardData;

export default function PublicDecks() {
  const { fetchPublicDecks, likeDeck, loading } = useDecks();
  const { user, openAuthModal } = useAuth();
  const [decks, setDecks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [copiedId, setCopiedId] = useState(null);
  const [likingId, setLikingId] = useState(null);

  useEffect(() => {
    loadDecks();
  }, [page, sort, user]);

  async function loadDecks() {
    const result = await fetchPublicDecks(page, sort);
    setDecks(result.decks);
    setTotalPages(result.totalPages);
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

  async function handleLike(deck) {
    if (!user) {
      openAuthModal();
      return;
    }

    if (likingId) return; // Prevent double-clicks

    // Optimistic update
    const previousDecks = [...decks];
    const wasLiked = deck.isLikedByUser;
    setDecks(decks.map(d =>
      d.id === deck.id
        ? { ...d, isLikedByUser: !wasLiked, likes: wasLiked ? d.likes - 1 : d.likes + 1 }
        : d
    ));

    setLikingId(deck.id);
    const result = await likeDeck(deck.id);
    setLikingId(null);

    if (!result) {
      // Rollback on error
      setDecks(previousDecks);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-frame-gold/30 to-frame-bronze/20 flex items-center justify-center border border-frame-gold/40">
            <svg className="w-5 h-5 text-frame-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-fantasy font-bold text-frame-gold">Public Decks</h1>
            <p className="text-sm text-gray-500">Browse community creations</p>
          </div>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input w-auto py-2 text-sm"
        >
          <option value="createdAt">Newest</option>
          <option value="likes">Most Liked</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">
          <svg className="animate-spin w-8 h-8 mx-auto mb-4 text-frame-gold" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading decks...
        </div>
      ) : decks.length === 0 ? (
        <div className="panel text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-card/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-400">No public decks yet. Be the first to share one!</p>
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
                    <h3 className="text-lg font-semibold text-white group-hover:text-frame-gold transition-colors">
                      {deck.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by <span className="text-gray-400">{deck.user?.username || 'Unknown'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {deck.views}
                    </span>
                    <button
                      onClick={() => handleLike(deck)}
                      disabled={likingId === deck.id}
                      className={`flex items-center gap-1 transition-all duration-200 hover:scale-110 ${
                        deck.isLikedByUser
                          ? 'text-red-500 hover:text-red-400'
                          : 'text-gray-500 hover:text-red-400'
                      } ${likingId === deck.id ? 'opacity-50' : ''}`}
                      title={user ? (deck.isLikedByUser ? 'Unlike' : 'Like') : 'Login to like'}
                    >
                      <svg className="w-4 h-4" fill={deck.isLikedByUser ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {deck.likes}
                    </button>
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
                    View / Edit
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`btn-fantasy-secondary px-4 py-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page <span className="text-frame-gold font-bold">{page}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`btn-fantasy-secondary px-4 py-2 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
