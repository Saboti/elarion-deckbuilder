import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

export default function Header() {
  const { user, logout, showAuthModal, closeAuthModal, openAuthModal } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

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

            {/* Hamburger Button - Mobile only */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* User Section - Hidden on mobile (available in hamburger menu) */}
            <div className="hidden md:flex items-center gap-4">
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full w-64 bg-surface-card z-50 md:hidden shadow-xl border-r border-frame-gold/20">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-frame-gold/20">
              <span className="font-fantasy text-xl font-bold bg-gradient-to-r from-frame-gold via-yellow-300 to-frame-gold bg-clip-text text-transparent">
                Elarion
              </span>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 flex flex-col gap-2">
              <MobileNavLink to="/" active={isActive('/')} onClick={closeMobileMenu}>
                Builder
              </MobileNavLink>
              <MobileNavLink to="/decks" active={isActive('/decks')} onClick={closeMobileMenu}>
                Public Decks
              </MobileNavLink>
              {user && (
                <MobileNavLink to="/my-decks" active={isActive('/my-decks')} onClick={closeMobileMenu}>
                  My Decks
                </MobileNavLink>
              )}
            </nav>

            {/* User Section in Drawer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-frame-gold/20">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-frame-gold/30 to-frame-bronze/30 flex items-center justify-center border border-frame-gold/40">
                      <span className="text-frame-gold text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm">{user.username}</span>
                  </div>
                  <button
                    onClick={() => { logout(); closeMobileMenu(); }}
                    className="btn-fantasy-secondary text-sm w-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { openAuthModal(); closeMobileMenu(); }}
                  className="btn-fantasy text-sm w-full"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </>
      )}
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

function MobileNavLink({ to, active, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
        ${active
          ? 'bg-gradient-to-r from-frame-gold/20 to-frame-bronze/10 text-frame-gold border border-frame-gold/30'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {children}
    </Link>
  );
}
