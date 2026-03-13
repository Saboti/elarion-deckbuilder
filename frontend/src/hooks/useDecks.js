import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useDecks() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }), [token]);

  async function fetchMyDecks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/decks/my`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to fetch decks');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function fetchPublicDecks(page = 1, sort = 'createdAt') {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/decks/public?page=${page}&sort=${sort}`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to fetch decks');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return { decks: [], total: 0, page: 1, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  }

  async function fetchDeck(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/decks/${id}`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to fetch deck');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function createDeck(deck) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/decks`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(deck)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function updateDeck(id, deck) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/decks/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(deck)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function deleteDeck(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/decks/${id}`, {
        method: 'DELETE',
        headers: headers()
      });
      if (!res.ok) throw new Error('Failed to delete deck');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function likeDeck(id) {
    try {
      const res = await fetch(`${API_URL}/api/decks/${id}/like`, {
        method: 'POST',
        headers: headers()
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to toggle like');
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }

  return {
    loading,
    error,
    fetchMyDecks,
    fetchPublicDecks,
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    likeDeck
  };
}
