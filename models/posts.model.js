const mongoose = require('mongoose');
const shortid = require('shortid');

//define database schema & model for posts
const postSchema = new mongoose.Schema({
    _id: {
        'type': String,
        'default': shortid.generate
    },
    title: {
      type: String,
      required: [true, "Enter a new title for the musing"],
      minlength: 5
    },
    content: {
        type: String,
        required: [true, 'Enter a musing'],
        minlength: 5
    },
    time:{
        type: Date,
        default: Date.now
    }
  });
  
  const blogPost = mongoose.model("Post", postSchema);

  module.exports = blogPost;