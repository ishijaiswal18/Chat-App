const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel.js');
const User = require('../models/userModel.js');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if(!userId) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    }).populate('users', '-password')
    .populate('latestMessage');

    isChat = await User.populate(isChat, { path: 'latestMessage.sender', select: 'name picture email' });

    if(isChat.length > 0) {
        res.status(200).json(isChat[0]);
    }
    else {
        var chatData = {
            isGroupChat: false,
            chatName : 'sender',
            users: [req.user._id, userId],
        }

        try {
            const createChat = await Chat.create(chatData);

            const fullChat = await Chat.findById(createChat._id).populate('users', '-password');

            res.status(200).json(fullChat);
        }
        catch(error) {
            res.status(400);
            throw new Error('Error while creating chat');
        }
    }

});


const fetchChats = asyncHandler(async (req, res) => {
    try{
        console.log("--------------------------------------------------------------------------------------------------")
        console.log("here comes the request with user id", req.user._id)
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        }).populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage').
        sort({ updatedAt: -1 })
        .then (async chats => {
            results = await User.populate(chats, { path: 'latestMessage.sender', select: 'name picture email' });
        });

        res.status(200).json(results);
    }
    catch(error) {
        res.status(400);
        throw new Error('Error while fetching chats');
    }
    

});

const createGroupChat = asyncHandler(async (req, res) => {
    var { chatName, users } = req.body;

    if(!chatName || !users) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    users = JSON.parse(users);

    users.push(req.user);

    if (users.length < 2) {
        res.status(400);
        throw new Error('Please add atleast 2 users');
    }


    var chatData = {
        isGroupChat: true,
        chatName : chatName,
        users: users,
        groupAdmin: req.user,
    }

    try {
        const createChat = await Chat.create(chatData);

        const fullChat = await Chat.findById(createChat._id).populate('users', '-password').populate('groupAdmin', '-password');

        res.status(200).json(fullChat);

    }
    catch(error) {
        res.status(400);
        throw new Error('Error while creating chat');
    }
});


const renameGroupChat = asyncHandler(async (req, res) => {
    var { chatId, chatName } = req.body;
    
    if(!chatId || !chatName) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        { new: true }
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');


    if (updatedChat) {
        res.status(200).json(updatedChat);
    }
    else {
        res.status(400);
        throw new Error('Error while updating chat');
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    var { chatId, userId} = req.body;

    if(!chatId || !userId) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    // users = JSON.parse(users);

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        { new: true }
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(updatedChat) {
        res.status(200).json(updatedChat);
    }

    else {
        res.status(400);
        throw new Error('Error while updating chat');
    }

});

const removeFromGroup = asyncHandler(async (req, res) => {
    var { chatId, userId } = req.body;

    console.log("chatId", chatId);
    console.log("userId", userId);

    if(!chatId || !userId) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    // users = JSON.parse(users);

    //  check if userId is group admin
    const isAdmin = await Chat.find({
        _id: chatId,
        groupAdmin: userId
    });

    if(isAdmin.length > 0) {
        res.status(400);
        throw new Error('Cannot remove group admin');
    }

    const updatedChat = await Chat.findByIdAndUpdate(

        chatId,
        {
            $pull: { users: userId },
        },
        { new: true }
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(updatedChat) {
        res.status(200).json(updatedChat);
    }
    else {
        res.status(400);
        throw new Error('Error while updating chat');
    }

});

const deleteChat = asyncHandler(async (req, res) => {
    var { chatId } = req.body;

    if(!chatId) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    //  if chat is group chat, check if user is group admin
    const isGroupChat = await Chat.find({
        _id: chatId,
        isGroupChat: true,
        groupAdmin: req.user._id
    });

    if(isGroupChat.length > 0) {
        const deletedChat = await Chat.findByIdAndDelete(chatId);

        if(deletedChat) {
            res.status(200).json(deletedChat);
        }
        else {
            res.status(400);
            throw new Error('Error while deleting chat');
        }
    }

    //  else check if user is in chat
    else {
        const isUserInChat = await Chat.find({
            _id: chatId,
            users: req.user._id,
            isGroupChat: false
        });

        if(isUserInChat.length > 0) {
            const deletedChat = await Chat.findByIdAndDelete(chatId);

            if(deletedChat) {
                res.status(200).json(deletedChat);
            }
            else {
                res.status(400);
                throw new Error('Error while deleting chat');
            }
        }
        else {
            res.status(400);
            throw new Error('You are not authorized to delete this chat');
        }
    }

});

const leaveChat = asyncHandler(async (req, res) => {
    var { chatId } = req.body;

    console.log("chatId", chatId);

    if(!chatId) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    //  if chat is group chat and user is member, remove user from chat
    const isGroupChat = await Chat.find({
        _id: chatId,
        isGroupChat: true,
        users: req.user._id
    });

    console.log("isGroupChat", isGroupChat);


    if(isGroupChat.length > 0) {

        // check if user is group admin
        const isAdmin = await Chat.find({
            _id: chatId,
            groupAdmin: req.user._id
        });

        if(isAdmin.length > 0) {
            console.log("user is group admin");
            //  change group admin to another random user 
            const users = await Chat.findById(chatId).select('users');
            console.log("users", users[0])

            if(users[0] !== req.user._id) {

                console.log("user is not first user in array")

                // change group admin
                const updatedChat = await Chat.findByIdAndUpdate(
                    chatId,
                    {
                        groupAdmin: users[0],
                        
                        $pull: { users: req.user._id },
                    },

                    { new: true }
                )
                .populate('users', '-password')
                .populate('groupAdmin', '-password');

                // remove user from chat
                


                if(updatedChat) {   
                    res.status(200).json(updatedChat);
                }
                else {
                    res.status(400);
                    throw new Error('Error while updating chat');
                }
            }
            else if(users.length > 1) {
                // change group admin
                console.log("there are more than 1 users in chat")
                const updatedChat2 = await Chat.findByIdAndUpdate(
                    chatId,
                    {
                        groupAdmin: users[1],
                        
                        $pull: { users: req.user._id },
                    },
                    { new: true }
                )
                .populate('users', '-password')
                .populate('groupAdmin', '-password');

                if(updatedChat2) {   
                    res.status(200).json(updatedChat2);
                }
                else {
                    res.status(400);
                    throw new Error('Error while updating chat');
                }
            } 
        }  
        else {
            console.log("HEre 2")
            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull: { users: req.user._id },
                },
                { new: true }
            )
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

            if(updatedChat) {
                res.status(200).json(updatedChat);
            }

            else {
                res.status(400);
                throw new Error('Error while updating chat');
            }
        }
        
    }


});







module.exports = { accessChat , fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup, deleteChat, leaveChat };