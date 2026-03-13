import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardGrid from './CardGrid';
import Card from './Card';
import Filters from './Filters';
import DeckStats from './DeckStats';
import ImportExport from './ImportExport';
import { useAuth } from '../hooks/useAuth';
import { useDecks } from '../hooks/useDecks';
import cardData from '../data/cards.json';

const { cards } = cardData;
const MAX_CARDS = 8;
const MAX_COST = 25;

export default function DeckBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchDeck, createDeck, updateDeck, loading } = useDecks();

  const [deckName, setDeckName] = useState('New Deck');
  const [deckCards, setDeckCards] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [addError, setAddError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    faction: '',
    cost: null,
    sort: 'faction'
  });

  // Calculate total cost
  const totalCost = useMemo(() => {
    return deckCards.reduce((sum, cardId) => {
      const card = cards.find(c => c.cardId === cardId);
      return sum + (card?.rankCost || 0);
    }, 0);
  }, [deckCards]);

  // Load existing deck if editing
  useEffect(() => {
    if (id) {
      loadDeck(id);
    }
  }, [id]);

  async function loadDeck(deckId) {
    const deck = await fetchDeck(deckId);
    if (deck) {
      setDeckName(deck.name);
      setDeckCards(deck.cards);
      setIsPublic(deck.isPublic);
      setEditingId(deck.id);
    }
  }

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let result = [...cards];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.ability.toLowerCase().includes(search)
      );
    }

    if (filters.faction) {
      result = result.filter((c) => c.faction === filters.faction);
    }

    if (filters.cost) {
      result = result.filter((c) => c.rankCost === filters.cost);
    }

    result.sort((a, b) => {
      switch (filters.sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cost':
          return a.rankCost - b.rankCost;
        case 'power':
          return b.power - a.power;
        case 'damage':
          return b.damage - a.damage;
        case 'faction':
        default:
          return a.faction.localeCompare(b.faction) || a.rankCost - b.rankCost;
      }
    });

    return result;
  }, [filters]);

  function handleCardClick(card) {
    setAddError('');

    if (deckCards.includes(card.cardId)) {
      // Remove from deck
      setDeckCards(deckCards.filter((c) => c !== card.cardId));
    } else {
      // Check both conditions before adding
      if (deckCards.length >= MAX_CARDS) {
        setAddError('Deck is full (8/8 cards)');
        return;
      }

      const newTotalCost = totalCost + card.rankCost;
      if (newTotalCost > MAX_COST) {
        setAddError(`Not enough cost budget (${totalCost}/${MAX_COST})`);
        return;
      }

      setDeckCards([...deckCards, card.cardId]);
    }
  }

  function handleImport(deck) {
    setDeckName(deck.name);
    setDeckCards(deck.cards);
  }

  async function handleSave() {
    if (!user) {
      setSaveMessage('Please login to save decks');
      return;
    }

    if (deckCards.length !== MAX_CARDS) {
      setSaveMessage('Deck must have exactly 8 cards');
      return;
    }

    if (totalCost > MAX_COST) {
      setSaveMessage(`Deck cost exceeds limit (${totalCost}/${MAX_COST})`);
      return;
    }

    const deckData = {
      name: deckName,
      cards: deckCards,
      isPublic
    };

    let result;
    if (editingId) {
      result = await updateDeck(editingId, deckData);
    } else {
      result = await createDeck(deckData);
    }

    if (result) {
      setSaveMessage('Deck saved!');
      if (!editingId) {
        setEditingId(result.id);
        navigate(`/deck/${result.id}`, { replace: true });
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setSaveMessage('Failed to save deck');
    }
  }

  function handleClear() {
    setDeckCards([]);
    setDeckName('New Deck');
    setEditingId(null);
    setIsPublic(false);
    setAddError('');
    navigate('/', { replace: true });
  }

  // Get full card data for deck
  const deckCardData = deckCards
    .map((cardId) => cards.find((c) => c.cardId === cardId))
    .filter(Boolean);

  const isDeckComplete = deckCards.length === MAX_CARDS && totalCost <= MAX_COST;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content - Card Grid */}
      <div className="flex-1 space-y-4">
        <Filters filters={filters} setFilters={setFilters} />

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {filteredCards.length} cards
          </span>
          {addError && (
            <span className="text-red-400 animate-pulse">{addError}</span>
          )}
        </div>

        <CardGrid
          cards={filteredCards}
          onCardClick={handleCardClick}
          selectedCards={deckCards}
        />
      </div>

      {/* Sidebar - Deck Builder */}
      <div className="w-full lg:w-96 space-y-4">
        <div className="panel">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-frame-gold/30 to-frame-bronze/20 flex items-center justify-center border border-frame-gold/40">
              <svg className="w-5 h-5 text-frame-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-fantasy font-bold text-frame-gold">YOUR DECK</h2>
              <p className="text-xs text-gray-500">Build your 8-card deck</p>
            </div>
          </div>

          {/* Deck Indicators */}
          <div className="flex items-center justify-between mb-4 px-1">
            {/* Card Slots */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(MAX_CARDS)].map((_, i) => (
                  <div
                    key={i}
                    className={`slot-indicator ${i < deckCards.length ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className={`text-sm font-bold ${deckCards.length === MAX_CARDS ? 'text-green-400' : 'text-gray-400'}`}>
                {deckCards.length}/{MAX_CARDS}
              </span>
            </div>

            {/* Cost Display */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${totalCost > MAX_COST ? 'text-red-400' : totalCost === MAX_COST ? 'text-yellow-400' : 'text-gray-400'}`}>
                {totalCost}/{MAX_COST}
              </span>
              <span className="star-cost text-lg">★</span>
            </div>
          </div>

          {/* Cost Progress Bar */}
          <div className="progress-bar mb-4">
            <div
              className={`progress-bar-fill ${totalCost > MAX_COST ? '!bg-red-500' : ''}`}
              style={{ width: `${Math.min((totalCost / MAX_COST) * 100, 100)}%` }}
            />
          </div>

          {/* Deck Name Input */}
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="input mb-4"
            placeholder="Deck Name"
          />

          {/* Deck Slots - Horizontal Scroll */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 px-1">
              {[...Array(MAX_CARDS)].map((_, i) => {
                const card = deckCardData[i];
                return (
                  <div key={i} className="flex-shrink-0 w-20 aspect-[2/3]">
                    {card ? (
                      <Card card={card} onClick={handleCardClick} small />
                    ) : (
                      <div className="deck-slot h-full">
                        <span className="text-frame-gold/40 text-sm font-bold">{i + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ornament-divider" />

          {/* Public Toggle */}
          <label className="flex items-center gap-3 mb-4 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only"
              />
              <div className={`
                w-10 h-6 rounded-full transition-all duration-200
                ${isPublic
                  ? 'bg-gradient-to-r from-green-600 to-green-500'
                  : 'bg-gray-700'
                }
              `}>
                <div className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200
                  ${isPublic ? 'left-5' : 'left-1'}
                `} />
              </div>
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Make deck public
            </span>
          </label>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleSave}
              disabled={loading || !isDeckComplete}
              className={`
                w-full py-3 rounded-lg font-semibold transition-all duration-200
                ${isDeckComplete
                  ? 'btn-fantasy'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Saving...' : editingId ? 'Update Deck' : 'Save Deck'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowImportExport(true)}
                className="btn-fantasy-secondary flex-1"
              >
                Import/Export
              </button>
              <button
                onClick={handleClear}
                className="btn-fantasy-danger flex-1"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <p className={`text-sm mt-3 text-center ${saveMessage.includes('Failed') || saveMessage.includes('Please') || saveMessage.includes('exceeds') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMessage}
            </p>
          )}
        </div>

        <DeckStats deckCards={deckCards} totalCost={totalCost} maxCost={MAX_COST} />
      </div>

      {showImportExport && (
        <ImportExport
          deckName={deckName}
          deckCards={deckCards}
          onImport={handleImport}
          onClose={() => setShowImportExport(false)}
        />
      )}
    </div>
  );
}
