const express = require('express');
const { getAllUsers, updateUserStatus, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('admin'));
router.get('/', getAllUsers);
router.patch('/:id/block', updateUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
