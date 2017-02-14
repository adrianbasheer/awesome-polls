// Again we are importing the libraries we are going to use
var express = require('express');
var passport = require('passport');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');

// We are going to want to share some data between our server and UI, so we'll be sure to pass that data in an env variable.
var env = {
};

// On our router variable, we'll be able to include various methods.
// For our app we'll only make use of GET requests, so the method router.get
// will handle that interaction. This method takes a string as its first
// parameter and that is the url path, so for the first route we are just
// giving it '/', which means the default route. Next we are defining a
// Node Js callback function, that takes three parameters, a request (req),
// a response (res), and an optional next (next) parameter. Finally,
// in our callback function, we are just send the message "You are on the homepage".
router.get('/', function(req, res, next) {
    // Now, rather then just sending the text "You are on the homepage",
    // we are going to actually render the view we created using the
    // res.render method. The second argument will allow us to pass
    // in data from the backend to our view dynamically.
    res.render('index', { env: env });
});

// We are going to do the same thing for the remaining routes.
router.get('/login',function(req, res){
    // Same thing for the login page.
    res.render('login', { env: env });
});

router.get('/logout', function(req, res){
    // For the logout page, we don't need to render a page,
    // we just want the user to be logged out when they hit this page.
    // We'll use the ExpressJS built in logout method,
    // and then we'll redirect the user back to the homepage.
    req.logout();
    res.redirect('/');
});

router.get('/polls', function(req, res){
    // You may have noticed that we included two new require files,
    // one of them being request. Request allows us to easily make
    // HTTP requests. In our instance here, we are using the Huffington
    // Post's API to pull the latest election results,
    // and then we're sending that data to our polls view.
    // The second require was the connect-ensure-loggedin library,
    // and from here we just required a method called ensureLoggedIn,
    // which will check and see if the current user is logged in before
    // rendering the page. If they are not, they will be redirected to
    // the login page. We are doing this in a middleware pattern, we first
    // call the ensureLoggedIn method, wait for the result of that action,
    // and finally execute our /polls controller.
    request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var polls = JSON.parse(body);
            // For this view, we are not only sending our environmental information, but the polls and user information as well.
            res.render('polls', {env: env, user: req.user, polls: polls});
        } else {
            res.render('error');
        }
    })
});

router.get('/user', ensureLoggedIn, function(req, res, next) {
    // Same thing for our
    res.render('user', { env: env, user: req.user });
});


// Finally, we export this module so that we can import it in our app.js file and
// gain access to the routes we defined.
module.exports = router;