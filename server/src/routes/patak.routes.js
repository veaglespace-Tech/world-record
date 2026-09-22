const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/pataks/public — Public route (for registration dropdown)
router.get('/public', async (req, res) => {
  try {
    const pataks = await prisma.patak.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    res.json(pataks);
  } catch (error) {
    console.error('Get public pataks error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/pataks — Protected
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Patak name is required.' });
    }

    const patak = await prisma.patak.create({
      data: {
        name,
        description: description || null,
      },
    });

    res.status(201).json(patak);
  } catch (error) {
    console.error('Create patak error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/pataks — Protected
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [pataks, total] = await Promise.all([
      prisma.patak.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patak.count({ where }),
    ]);

    res.json({
      data: pataks,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error('Get pataks error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/pataks/:id — Protected
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Patak name is required.' });
    }

    const patak = await prisma.patak.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    res.json({ message: 'Patak updated successfully', patak });
  } catch (error) {
    console.error('Update patak error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
