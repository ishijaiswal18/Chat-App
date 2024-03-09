const express = require('express');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

const { sendMessage, fetchMessages } = require('../controller/messageController');

router.route('/').post(protect, sendMessage);
router.route("/:chatId").get(protect, fetchMessages);


module.exports = router;