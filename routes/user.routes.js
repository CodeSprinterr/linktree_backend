//users.routes.js
const express = require('express');
const router = express.Router();
const device = require("express-device");
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const shareProfileController = require('../controllers/shareProfile.controller');

router.use(device.capture());

router.post('/setusername', authMiddleware, userController.setusername);
router.get('/getUser', authMiddleware, userController.fetchUser);
router.post('/uploadDP', authMiddleware, userController.uploadDP);
router.get('/removeImage', authMiddleware, userController.removeImage);
router.post('/saveDataPage1', authMiddleware, userController.saveDataPage1);
router.get('/getUrls', authMiddleware, userController.getUrls);

router.get('/getUser/:username', shareProfileController.getUser);
router.patch('/updateClicks', shareProfileController.updateClicks);
router.get('/getAnalyticsData', authMiddleware, shareProfileController.getAnalyticsData);
router.patch('/updateApperance', authMiddleware, shareProfileController.updateApperance);
router.get('/getApperance', authMiddleware, shareProfileController.getApperance);

router.use((req, res) => {
    res.status(404).json(
        { 
            status: 404,
            message: 'Page Not Found' 
        }
    );
});

module.exports = router;