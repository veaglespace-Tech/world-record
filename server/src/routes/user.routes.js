const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const multer = require('multer');
const ImageKit = require('imagekit');
const path = require('path');

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Multer memory storage configuration
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST /api/users/register — Public route (via referral link)
router.post(
  '/register',
  upload.fields([
    { name: 'aadharImage', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        address,
        referralCode,
        pathakId,
        dob,
        gender,
        bloodGroup,
        aadharNo,
      } = req.body;

      if (!fullName || !email || !phone || !referralCode || !pathakId || !dob || !gender || !bloodGroup || !aadharNo) {
        return res.status(400).json({
          error: 'All fields are required.',
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }

      const parsedPathakId = parseInt(pathakId);
      if (isNaN(parsedPathakId)) {
        return res.status(400).json({ error: 'Invalid pathak ID.' });
      }

      // Verify referral code belongs to an admin
      const admin = await prisma.admin.findUnique({
        where: { referralCode },
      });

      if (!admin) {
        return res.status(400).json({ error: 'Invalid referral code.' });
      }

      if (!req.files || !req.files['aadharImage'] || !req.files['passportPhoto']) {
         return res.status(400).json({ error: 'Aadhar image and Passport photo are required.' });
      }

      // Upload files to ImageKit
      let aadharImage, passportPhoto;
      try {
        const aadharUpload = await imagekit.upload({
          file: req.files['aadharImage'][0].buffer, // Pass buffer
          fileName: `aadhar-${Date.now()}-${req.files['aadharImage'][0].originalname}`,
        });

        const passportUpload = await imagekit.upload({
          file: req.files['passportPhoto'][0].buffer,
          fileName: `passport-${Date.now()}-${req.files['passportPhoto'][0].originalname}`,
        });

        aadharImage = aadharUpload.url;
        passportPhoto = passportUpload.url;
      } catch (uploadError) {
        return res.status(500).json({ error: 'Failed to upload images. Please check the files and try again.' });
      }

      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          phone,
          address: address || null,
          PathakId: parsedPathakId,
          dob,
          gender,
          bloodGroup,
          aadharNo,
          aadharImage,
          passportPhoto,
          referredBy: referralCode,
        },
      });

      res.status(201).json({ message: 'Registration successful!', user });
    } catch (error) {
      console.error('User registration error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// GET /api/users — Protected route (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', filter = '' } = req.query;
    
    let parsedPage = parseInt(page);
    let parsedLimit = parseInt(limit);
    
    if (isNaN(parsedPage) || parsedPage < 1) parsedPage = 1;
    if (isNaN(parsedLimit) || parsedLimit < 1) parsedLimit = 10;

    const skip = (parsedPage - 1) * parsedLimit;
    const take = parsedLimit;

    const where = {};
    const orConditions = [];

    if (search) {
      orConditions.push(
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      );
    }

    if (filter === 'no_address') {
      where.address = null;
    } else if (filter === 'has_address') {
      where.address = { not: null };
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { Pathak: true }, // Include organization details
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      data: users,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
