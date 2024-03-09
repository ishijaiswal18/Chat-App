const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel.js');
const Chat = require('../models/chatModel.js');
const User = require('../models/userModel.js');

const fetchMessages = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            res.status(404);
            throw new Error('Chat not found');
        }
        const messages = await Message
            .find({ chat: chatId })
            .populate('sender', 'name pic email')
            .sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error('Error in fetching messages');
    }

    
}
);

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content) {
        res.status(400);
        throw new Error('Content is required');
    }

    if (!chatId) {
        res.status(400);
        throw new Error('Chat ID is required');
    }

    const chat = await Chat.findById(chatId);
    const user = await User.findById(req.user._id);
    console.log(content);
    const newMessage = {
        context: content,
        sender: req.user._id,
        timestamp: new Date(),
        chat : chatId,
    };

    console.log(newMessage)
    try {
        var message = await Message.create(newMessage);

        console.log(message);

        message = await message.populate('sender', "name pic");
        message = await message.populate('chat');
        message = await User.populate(message, {path: 'chat.users', select: 'name pic email'});

        await Chat.findByIdAndUpdate (chatId, {
            latestMessage: message,
        });

        res.json(message)

    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error('Error in creating message');
    }

    chat.messages.push(newMessage);
    await chat.save();
    res.json(newMessage);
}
);












module.exports = {fetchMessages, sendMessage };