const express = require('express');
const router = express.Router();
const { registerUser, loginUser, allUsers, registerFakeUsers} = require('../controller/userControllers');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, allUsers)
router.route('/login').post(loginUser);
router.route('/fake').post(registerFakeUsers);


module.exports = router;