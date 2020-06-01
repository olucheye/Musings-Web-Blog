const mongoose = require('mongoose');
const shortid = require('shortid');

const userSchema = new mongoose.Schema({
    _id: { type: String, default: shortid.generate},
    // name: { 
    //     type: String,
    //     required: [true, 'Please enter a name'],
    //     minlength: 5,
    //     trim: true
    // },
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        minlength: 5,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 5,
        trim: true 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;