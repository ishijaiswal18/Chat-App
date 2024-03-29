const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    picture: {
        type: String,
        trim: true,
        default: 'https://www.gravatar.co',
    },
},
{
    timestamps: true,

});


userModel.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userModel.pre('save', async function(next) {

    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model('User', userModel);

module.exports = User;