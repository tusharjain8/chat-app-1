'use strict';

// Chat application dependencies
var express 	= require('express');
var app  		= express();
var path 		=require('path')
var bodyParser 	= require('body-parser');
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var mongoose=require("mongoose");
var User=require("./models/user");

app.use(flash());

//db setup

mongoose.connect("mongodb://localhost/chat_app");

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"This app is going to be amazing",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

//require routes
var indexRoutes=require('./routes/index');
// Set the port number
var port = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


//routes setup
app.use("/",indexRoutes)


app.listen("3000","0.0.0.0", function(){
   console.log("Server Has Started!");
});