const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const ImageKit = require('imagekit');

const router = express.Router();
const prisma = new PrismaClient();

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/pathak/public — Public route (for registration dropdown)
router.get('/public', async (req, res) => {
  try {
    const pathakList = await prisma.pathak.findMany({
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });
    res.json(pathakList);
  } catch (error) {
    console.error('Get public pathak error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/pathak — Protected (with logo upload)
router.post('/', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { name, description, adminName, adminEmail, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Pathak name is required.' });
    }

    let logoUrl = null;

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `Pathak-logo-${Date.now()}-${req.file.originalname}`,
        folder: '/Pathak-logos',
      });
      logoUrl = uploaded.url;
    }

    const pathakData = await prisma.pathak.create({
      data: {
        name,
        description: description || null,
        adminName: adminName || null,
        adminEmail: adminEmail || null,
        address: address || null,
        logoUrl,
      },
    });

    res.status(201).json(pathakData);
  } catch (error) {
    console.error('Create Pathak error:', error);
    require('fs').appendFileSync('error.log', (error.stack || error.toString()) + '\n');
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/pathak — Protected
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    let parsedPage = parseInt(page);
    let parsedLimit = parseInt(limit);
    if (isNaN(parsedPage) || parsedPage < 1) parsedPage = 1;
    if (isNaN(parsedLimit) || parsedLimit < 1) parsedLimit = 10;

    const skip = (parsedPage - 1) * parsedLimit;
    const take = parsedLimit;

    const where = search
      ? {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { adminName: { contains: search } },
          { adminEmail: { contains: search } },
          { address: { contains: search } },
        ],
      }
      : {};

    const [pathakList, total] = await Promise.all([
      prisma.pathak.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
        include: {
          _count: {
            select: { users: true }
          }
        }
      }),
      prisma.pathak.count({ where }),
    ]);

    res.json({
      data: pathakList,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error('Get pathak error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/pathak/:id — Protected (with logo upload)
router.put('/:id', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, adminName, adminEmail, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Pathak name is required.' });
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid pathak ID.' });
    }

    const updateData = {
      name,
      description: description || null,
      adminName: adminName || null,
      adminEmail: adminEmail || null,
      address: address || null,
    };

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `Pathak-logo-${Date.now()}-${req.file.originalname}`,
        folder: '/Pathak-logos',
      });
      updateData.logoUrl = uploaded.url;
    }

    const pathakData = await prisma.pathak.update({
      where: { id: parsedId },
      data: updateData,
    });

    res.json({ message: 'Pathak updated successfully', pathak: pathakData });
  } catch (error) {
    console.error('Update Pathak error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
