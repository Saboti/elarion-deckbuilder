import { useState } from 'react';
import { encodeDeck, decodeDeck } from '../utils/deckCode';

export default function ImportExport({ deckName, deckCards, onImport, onClose }) {
  const [importCode, setImportCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const exportCode = encodeDeck({
    name: deckName || 'My Deck',
    cards: deckCards,
    cardBack: 'cardback_default'
  });

  function handleImport() {
    setError('');
    const deck = decodeDeck(importCode.trim());
    if (!deck) {
      setError('Invalid deck code');
      return;
    }
    if (deck.cards.length !== 8) {
      setError('Deck must have exactly 8 cards');
      return;
    }
    onImport(deck);
    onClose();
  }

  function handleCopy() {
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="glass-panel p-6 w-full max-w-lg mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-frame-gold/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-frame-gold/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-frame-gold/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-frame-gold/50 rounded-br-lg" />

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-fantasy text-2xl font-bold bg-gradient-to-r from-frame-gold to-yellow-300 bg-clip-text text-transparent">
            Import / Export
          </h2>
          <p className="text-gray-500 text-sm mt-1">Share your deck with others</p>
        </div>

        {/* Export Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h3 className="text-lg font-semibold text-white">Export Deck</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Copy this code to share your deck or import it into the game.
          </p>
          {deckCards.length === 8 ? (
            <>
              <div className="bg-surface-card rounded-lg p-4 font-mono text-sm break-all border border-frame-gold/20 mb-3">
                <code className="text-gray-300">{exportCode}</code>
              </div>
              <button
                onClick={handleCopy}
                className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'btn-fantasy'
                }`}
              >
                {copied ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : 'Copy to Clipboard'}
              </button>
            </>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3">
              <p className="text-yellow-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                You need exactly 8 cards to export ({deckCards.length}/8)
              </p>
            </div>
          )}
        </div>

        <div className="ornament-divider" />

        {/* Import Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <h3 className="text-lg font-semibold text-white">Import Deck</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Paste a deck code from the game or another player.
          </p>
          <textarea
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
            placeholder="Paste deck code here..."
            className="input h-24 font-mono text-sm resize-none mb-3"
          />
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 mb-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={handleImport}
            disabled={!importCode.trim()}
            className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              importCode.trim()
                ? 'btn-fantasy-secondary'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Import Deck
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
