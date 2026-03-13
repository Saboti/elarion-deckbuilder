import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

export default function Header() {
  const { user, logout, showAuthModal, closeAuthModal, openAuthModal } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="relative border-b border-frame-gold/20">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-card to-surface-panel" />

        {/* Ornamental top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-frame-gold/50 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <span className="font-fantasy text-2xl font-bold bg-gradient-to-r from-frame-gold via-yellow-300 to-frame-gold bg-clip-text text-transparent">
                  Elarion
                </span>
                <span className="text-gray-400 text-sm font-medium">Deck Builder</span>
              </Link>

              <nav className="hidden md:flex gap-1">
                <NavLink to="/" active={isActive('/')}>
                  Builder
                </NavLink>
                <NavLink to="/decks" active={isActive('/decks')}>
                  Public Decks
                </NavLink>
                {user && (
                  <NavLink to="/my-decks" active={isActive('/my-decks')}>
                    My Decks
                  </NavLink>
                )}
              </nav>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-frame-gold/30 to-frame-bronze/30 flex items-center justify-center border border-frame-gold/40">
                      <span className="text-frame-gold text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm hidden sm:block">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="btn-fantasy-secondary text-sm px-4 py-1.5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="btn-fantasy text-sm"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ornamental bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-frame-gold/30 to-transparent" />
      </header>

      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
    </>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-gradient-to-r from-frame-gold/20 to-frame-bronze/10 text-frame-gold border border-frame-gold/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {children}
    </Link>
  );
}
