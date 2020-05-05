const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

//database connection and console confirmation
mongoose.connect("mongodb://localhost:27017/musings", {useNewUrlParser:true,  useUnifiedTopology: true});

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
app.use(express.urlencoded());
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

/*
app.get("/about", (req,res) => {
  res.render("about", {aboutInfo : aboutContent });
});

app.get("/contact", (req,res) => {
  res.render("contact", {contactInfo : contactContent });
})
*/

app.get("/compose", (req,res)=> {
  res.render("compose")
})


app.get("/posts/:id", (req,res)=> {

  let postId = req.params.id;

  blogPost.findOne({_id: postId}, function(err, musing){
    if(!err){
      res.render("post", {
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
    if(!err){
      res.redirect('/');
    }else{
      res.render("failure");
      console.log("There was an issue saving the post. Please try again")
    }
  });
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
