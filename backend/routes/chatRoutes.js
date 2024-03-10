const express = require('express');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

const { accessChat , fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup, deleteChat, leaveChat } = require('../controller/chatController');

router.route('/').post(protect, accessChat)
.get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/delete").delete(protect, deleteChat);
router.route("/leave").put(protect, leaveChat);

module.exports = router;