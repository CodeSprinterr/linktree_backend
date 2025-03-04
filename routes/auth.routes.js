//auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch('/updateProfile', authMiddleware, authController.updateProfile);

router.use((req, res) => {
    res.status(404).json(
        { 
            status: 404,
            message: 'Page Not Found' 
        }
    );
});

module.exports = router;