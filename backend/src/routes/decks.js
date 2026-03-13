import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional auth (for public decks)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
    }
  } catch (error) {
    // Ignore invalid tokens for optional auth
  }
  next();
};

// Get public decks
router.get('/public', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'createdAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orderBy = sort === 'likes' ? { likes: 'desc' } :
                    sort === 'views' ? { views: 'desc' } :
                    { createdAt: 'desc' };

    const [decks, total] = await Promise.all([
      prisma.deck.findMany({
        where: { isPublic: true },
        include: { user: { select: { username: true } } },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.deck.count({ where: { isPublic: true } })
    ]);

    // Add isLikedByUser for logged-in users
    let decksWithLikeStatus = decks;
    if (req.userId) {
      const userLikes = await prisma.deckLike.findMany({
        where: {
          userId: req.userId,
          deckId: { in: decks.map(d => d.id) }
        },
        select: { deckId: true }
      });
      const likedDeckIds = new Set(userLikes.map(l => l.deckId));
      decksWithLikeStatus = decks.map(deck => ({
        ...deck,
        isLikedByUser: likedDeckIds.has(deck.id)
      }));
    } else {
      decksWithLikeStatus = decks.map(deck => ({
        ...deck,
        isLikedByUser: false
      }));
    }

    res.json({ decks: decksWithLikeStatus, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// Get my decks
router.get('/my', auth, async (req, res) => {
  try {
    const decks = await prisma.deck.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(decks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// Get single deck
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { username: true } } }
    });

    if (!deck) return res.status(404).json({ error: 'Deck not found' });

    // Check access
    if (!deck.isPublic && deck.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Increment views
    if (deck.isPublic) {
      await prisma.deck.update({
        where: { id: req.params.id },
        data: { views: { increment: 1 } }
      });
    }

    // Check if user has liked this deck
    let isLikedByUser = false;
    if (req.userId) {
      const existingLike = await prisma.deckLike.findUnique({
        where: { userId_deckId: { userId: req.userId, deckId: deck.id } }
      });
      isLikedByUser = !!existingLike;
    }

    res.json({ ...deck, isLikedByUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
});

// Create deck
router.post('/', auth, async (req, res) => {
  try {
    const { name, cards, cardBack = 'cardback_default', isPublic = false } = req.body;

    if (!name || !cards || cards.length !== 8) {
      return res.status(400).json({ error: 'Deck must have a name and exactly 8 cards' });
    }

    const deck = await prisma.deck.create({
      data: {
        name,
        cards,
        cardBack,
        isPublic,
        userId: req.userId
      }
    });

    res.status(201).json(deck);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create deck' });
  }
});

// Update deck
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, cards, cardBack, isPublic } = req.body;

    const existing = await prisma.deck.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Deck not found' });
    if (existing.userId !== req.userId) return res.status(403).json({ error: 'Access denied' });

    if (cards && cards.length !== 8) {
      return res.status(400).json({ error: 'Deck must have exactly 8 cards' });
    }

    const deck = await prisma.deck.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(cards && { cards }),
        ...(cardBack && { cardBack }),
        ...(typeof isPublic === 'boolean' && { isPublic })
      }
    });

    res.json(deck);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update deck' });
  }
});

// Delete deck
router.delete('/:id', auth, async (req, res) => {
  try {
    const existing = await prisma.deck.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Deck not found' });
    if (existing.userId !== req.userId) return res.status(403).json({ error: 'Access denied' });

    await prisma.deck.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

// Like/Unlike deck (toggle)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const deckId = req.params.id;
    const userId = req.userId;

    // Check if deck exists and is public
    const deck = await prisma.deck.findUnique({ where: { id: deckId } });
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    if (!deck.isPublic) return res.status(400).json({ error: 'Cannot like private deck' });

    // Check if user already liked this deck
    const existingLike = await prisma.deckLike.findUnique({
      where: { userId_deckId: { userId, deckId } }
    });

    let action;
    let updatedDeck;

    if (existingLike) {
      // Unlike: delete the like and decrement counter
      await prisma.deckLike.delete({
        where: { userId_deckId: { userId, deckId } }
      });
      updatedDeck = await prisma.deck.update({
        where: { id: deckId },
        data: { likes: { decrement: 1 } }
      });
      action = 'unliked';
    } else {
      // Like: create the like and increment counter
      await prisma.deckLike.create({
        data: { userId, deckId }
      });
      updatedDeck = await prisma.deck.update({
        where: { id: deckId },
        data: { likes: { increment: 1 } }
      });
      action = 'liked';
    }

    res.json({
      likes: updatedDeck.likes,
      isLikedByUser: action === 'liked',
      action
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

export default router;
