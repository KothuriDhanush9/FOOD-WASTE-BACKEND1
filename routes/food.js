const express = require('express');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getDonorHistory,
} = require('../controllers/foodController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

const router = express.Router();

router.get('/', authMiddleware, getAllListings);
router.get('/donor/history', authMiddleware, authorizeRoles('donor'), getDonorHistory);
router.get('/:id', authMiddleware, getListingById);
router.post('/', authMiddleware, authorizeRoles('donor', 'admin'), createListing);
router.patch('/:id', authMiddleware, authorizeRoles('donor', 'admin'), updateListing);
router.delete('/:id', authMiddleware, authorizeRoles('donor', 'admin'), deleteListing);

module.exports = router;
