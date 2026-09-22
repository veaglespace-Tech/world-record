const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/referral-link — Protected
router.get('/referral-link', authMiddleware, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { referralCode: true },
    });

    const referralLink = `${process.env.CLIENT_URL}/register/${admin.referralCode}`;

    res.json({ referralCode: admin.referralCode, referralLink });
  } catch (error) {
    console.error('Referral link error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/admin/settings — Protected
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
    });

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (currentPassword && newPassword) {
      const isValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isValid) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: req.admin.id },
      data: updateData,
      select: { id: true, name: true, email: true, referralCode: true },
    });

    res.json({ message: 'Settings updated successfully.', admin: updatedAdmin });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
