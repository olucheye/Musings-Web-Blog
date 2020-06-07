const express = require("express");
const ejs = require("ejs");
//const _ = require('lodash');
const mongoose = require("mongoose");
const env = require('dotenv').config();
const mongoDB = process.env.MONGO_URI;
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const app = express();// initiate Express App
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json())
//Enabling Express Session
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

//@DESC: initialize passport and pass session in succession
app.use(passport.initialize());
app.use(passport.session());

//database connection
mongoose.connect(mongoDB, {useNewUrlParser:true,  useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => console.log("Connection to Database successful"));

//routes
const posts = require('./routes/post');
//const postRouter = require('./models/Posts.model')
// const User = require('./models/User.model');

//Passport config
//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

//use routes
app.use('/', posts);


const port = (process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Server started on " + port );
});