const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const env = require('dotenv').config();
const mongoDB = process.env.MONGO_URI;

/*

const aboutContent = "Following months of training on using Google Cloud, my interest in the backend programming piqued. Subsequently, following a previous stint programming, I am back and here's my first complete web app with NodeJS, MongoDB & a template Engine";

const contactContent = "I can be reached via .......... ";

*/

//database connection and console confirmation
mongoose.connect(mongoDB, {useNewUrlParser:true,  useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => console.log("Connection to Database successful"));

//define database schema & model for posts
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Enter a new title for the musing"],
    minlength: 5
  },
  content: {
      type: String,
      required: [true, 'Enter a musing'],
      minlength: 5
  }
});

const blogPost = mongoose.model("Post", postSchema);


const app = express();// initiate Express App

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));


//Get Methods
app.get("/", (req, res) => {
  blogPost.find({}, function (err, musings){
    if(!err){
      res.render("home", {blogContent : musings});
    }else{
      console.log("Cannot get posts at this time!")
    }
  });
 
});


app.get("/about", (req,res) => {
  res.render("about", {aboutInfo : aboutContent, contactInfo : contactContent });
});

app.get("/compose", (req,res)=> {
  res.render("compose")
})


app.get("/posts/:id", (req,res)=> {

  let postId = req.params.id;

  blogPost.findOne({_id: postId}, function(err, musing){
    // console.log(musing); to verify data passed with each musing
    if(!err){
      res.render("post", {
        id : musing._id,
        title : musing.title, 
        content : musing.content
      });
    }else{
      console.log("Cannot find this post. Please use new search terms!")
      res.redirect('/');
    }
  });
});

//Post Method

app.post("/compose", (req,res)=> {

  let newBlogTitle = req.body.newContentTitile;
  let newBlogPost = req.body.newContentPost;

  const newPost = new blogPost({
    title: newBlogTitle,
    content: newBlogPost
  });

  newPost.save( function(err){ //catches error before saving
    setTimeout(() => {
      if(!err){
        res.redirect('/');
      }else{
        console.log(err);
        res.render("failure", {errorMsg: err});
      } 
    }, 3000);
  });
})

//DELETE METHOD
app.post('/delete', (req,res) => {
  let postId = req.body.deletePost;

  blogPost.findByIdAndDelete(postId, function(err){
    if (!err) {
     // console.log("Post was successfully deleted");
      setTimeout(() => {
        res.redirect('/');
      }, 3000);
    }
  });
});

const port = (process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Server started on " + port );
});