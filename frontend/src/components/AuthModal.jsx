import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="glass-panel p-6 w-full max-w-md mx-4 relative"
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
            {isLogin ? 'Welcome Back' : 'Join Elarion'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Choose a username"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-fantasy w-full py-3"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="ornament-divider my-5" />

        <p className="text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-frame-gold hover:text-yellow-300 font-medium transition-colors"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>

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
