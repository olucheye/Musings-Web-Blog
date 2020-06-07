//Dependencies
const router = require('express').Router();
const mongoose = require('mongoose');
const blogPost = require('../models/Posts.model');
//require moment for date formatting
const moment = require('moment');
//import user for validation
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Static files ---

const aboutContent = "Following months of training on using Google Cloud, my interest in the backend programming piqued. Subsequently, following a previous stint programming, I am back and here's my first complete web app with NodeJS, MongoDB & a template Engine";

const contactContent = "I can be reached via .......... ";

//Get Methods
router.route('/')
    .get((req, res) => {
        //blogPost.find({}, function (err, musings){
        blogPost.find({}).sort({time:-1}).exec(function(err, musings){
            if(!err){
                res.render("home", {blogContent : musings});
            }else{
                console.log("Cannot get posts at this time!")
            }
        })
    });

//@desc: renders compose page
router.route('/compose')
  .get( (req,res)=> {
    res.render("compose")
  })
  
//@desc: renders register page
router.route('/register')
    .get((req,res)=>{
        res.render('register');
    })

router.route('/about')
    .get((req,res) => {
        res.render("about", {aboutInfo : aboutContent, contactInfo : contactContent });
    });
  

//@desc: Get Specific posts
router.route("/posts/:id")
  .get((req,res)=> {
  
    let postId = req.params.id;
  
    blogPost.findOne({_id: postId}, function(err, musing){
      // console.log(musing); to verify data passed with each musing
      if(!err){
        res.render("post", {
          id : musing._id,
          title : musing.title, 
          content : musing.content,
          //date formatted below with moment before passing to ejs
          date: moment(musing.time).add(24, 'hours').format('LLL')
        });
      }else{
        console.log("Cannot find this post. Please use new search terms!")
        res.redirect('/');
      }
    });
  });
  

//=== Post Method ===
//@desc: Not available in Master that server as Prod

// router.route('/register')
//   .post((req,res)=>{
//       //values from body by destructuring
//       const {username, password} = req.body;
//       console.log(username, password);
//       //introduce passport
//       passport.use(new LocalStrategy(

//       ))

//   });

router.route('/compose') 
  .post((req,res)=> {
  
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
router.route('/delete') 
  .post((req,res) => {
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

module.exports = router;