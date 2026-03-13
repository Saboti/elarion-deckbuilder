import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import DeckBuilder from './components/DeckBuilder';
import PublicDecks from './components/PublicDecks';
import MyDecks from './components/MyDecks';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<DeckBuilder />} />
            <Route path="/decks" element={<PublicDecks />} />
            <Route path="/my-decks" element={<MyDecks />} />
            <Route path="/deck/:id" element={<DeckBuilder />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
