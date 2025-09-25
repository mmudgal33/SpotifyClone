const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/usercontroller');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/profile', UserController.getUserProfile);
router.put('/profile', UserController.updateUserProfile);

module.exports = router;
