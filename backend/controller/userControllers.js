const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");

const User = require('../models/userModel.js');

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);

    const { name, email, password, picture} = req.body;

    if(!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }
    
    // check if user exists

    userExists = await User.findOne({email});
   

    if(userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        picture,
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(user);
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');

    }

});

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or:[
            {name: {$regex: req.query.search, $options: 'i'}},
            {email: {$regex: req.query.search, $options: 'i'}},
        ],
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id }});

    res.send(users);
});


const registerFakeUsers = asyncHandler(async (req, res) => {
    // email = name@gmail.com
    const users = await User.insertMany([
        {
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        },
        {
            name: 'Jane Doe',
            email: 'janedoe@gmail.com',
            password: '123456',

        },
        {
            name: 'John Smith',
            email: 'johnsmith@gmail.com',
            password: '123456',
        },
        {
            name: 'Jane Smith',
            email: 'Janesmith@gmail.com',
            password: '123456',
        },
        {
            name: 'John Wick',
            email: 'johnwick@gmail.com',
            password: '123456',
        },
        {
            name: 'Jane Wick',
            email: 'janewick@gmail.com',
            password: '123456',
        }
    ]);

    
    res.send(users);
});




module.exports = { registerUser, loginUser, allUsers, registerFakeUsers};