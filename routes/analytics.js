const express = require('express');
const { getOverview, getWasteTrends, getDemandSupply } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('admin', 'analyst'));
router.get('/overview', getOverview);
router.get('/trends', getWasteTrends);
router.get('/demand-supply', getDemandSupply);

module.exports = router;
