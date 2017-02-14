var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');

dotenv.load();

var routes = require("./routes/index");
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"shhhhhhhh",
    resave: true,
    saveUninitialized: true
}));

app.use("/", routes);
app.use(express.static(path.join(__dirname, "views")));
app.use(function(req,res,next){
    console.log("xPage not found.");
    var error = new Error("Not Found error message");
    console.log("1");
    error.status = 404;
    console.log("2");
    next(error);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.send(err)
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.listen(3000);
console.log("Listening to port 3000...");
