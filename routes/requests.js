const express = require('express');
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/requestController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

const router = express.Router();

router.use(authMiddleware);
router.post('/', authorizeRoles('recipient'), createRequest);
router.get('/', getRequests);
router.patch('/:id', authorizeRoles('donor', 'admin'), updateRequestStatus);

module.exports = router;
