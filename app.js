const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const env = require('dotenv').config();
const mongoDB = process.env.MONGO_URI;


//database connection and console confirmation
mongoose.connect(mongoDB, {useNewUrlParser:true,  useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => console.log("Connection to Database successful"));


const app = express();// initiate Express App

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

//routing files through 
const posts = require('./routes/post');

app.use('/', posts);


const port = (process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Server started on " + port );
});