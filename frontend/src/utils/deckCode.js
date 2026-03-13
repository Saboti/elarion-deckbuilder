// Encode deck to game-compatible format
export function encodeDeck(deck) {
  const data = {
    n: deck.name,
    c: deck.cards,
    v: 1,
    b: deck.cardBack || 'cardback_default'
  };
  return btoa(JSON.stringify(data));
}

// Decode deck from game format
export function decodeDeck(code) {
  try {
    const data = JSON.parse(atob(code));
    return {
      name: data.n || 'Imported Deck',
      cards: data.c || [],
      cardBack: data.b || 'cardback_default',
      version: data.v || 1
    };
  } catch (error) {
    console.error('Failed to decode deck:', error);
    return null;
  }
}

// Validate deck has exactly 8 cards
export function validateDeck(cards) {
  return cards.length === 8;
}

// Calculate faction distribution
export function getFactionDistribution(cards, cardData) {
  const distribution = {};
  cards.forEach(cardId => {
    const card = cardData.find(c => c.cardId === cardId);
    if (card) {
      distribution[card.faction] = (distribution[card.faction] || 0) + 1;
    }
  });
  return distribution;
}

// Get clan bonus info
export function getClanBonus(distribution) {
  const bonuses = [];
  Object.entries(distribution).forEach(([faction, count]) => {
    if (count >= 4) {
      bonuses.push({ faction, count, bonus: 'Major' });
    } else if (count >= 2) {
      bonuses.push({ faction, count, bonus: 'Minor' });
    }
  });
  return bonuses;
}

// Calculate deck stats
export function calculateDeckStats(cards, cardData) {
  if (cards.length === 0) return null;

  const deckCards = cards
    .map(cardId => cardData.find(c => c.cardId === cardId))
    .filter(Boolean);

  if (deckCards.length === 0) return null;

  const totalCost = deckCards.reduce((sum, c) => sum + c.rankCost, 0);
  const totalPower = deckCards.reduce((sum, c) => sum + c.power, 0);
  const totalDamage = deckCards.reduce((sum, c) => sum + c.damage, 0);

  return {
    avgCost: (totalCost / deckCards.length).toFixed(1),
    avgPower: (totalPower / deckCards.length).toFixed(1),
    avgDamage: (totalDamage / deckCards.length).toFixed(1),
    totalCost,
    totalPower,
    totalDamage,
    costCurve: getCostCurve(deckCards)
  };
}

// Get cost distribution for curve display
function getCostCurve(cards) {
  const curve = { 2: 0, 3: 0, 4: 0, 5: 0 };
  cards.forEach(card => {
    if (curve[card.rankCost] !== undefined) {
      curve[card.rankCost]++;
    }
  });
  return curve;
}
