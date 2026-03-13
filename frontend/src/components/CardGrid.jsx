import Card from './Card';

export default function CardGrid({ cards, onCardClick, selectedCards }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
      {cards.map((card) => (
        <Card
          key={card.cardId}
          card={card}
          onClick={onCardClick}
          selected={selectedCards.includes(card.cardId)}
          showAbility
        />
      ))}
    </div>
  );
}
