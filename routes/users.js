var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Movie Search Page Render
router.get('/movie_search', function (req, res) {
	res.render('movie_search');
});

// Movie Info Page Render
router.get('/movie', function (req, res) {
	res.render('movie');
});

router.post('/favorite', function (req, res) {
	// console.log(res.locals.user.email);

	console.log(res.locals.user);

	var userId = res.locals.user._id;

	console.log(req.body.movieID);

	var movId = req.body.movieID;

	console.log(req.body.movieTitle);

	var movTitle = req.body.movieTitle;

	console.log(req.body.moviePoster);

	var movPoster = req.body.moviePoster;
	var movGenre = req.body.movieGenre;
	var movReleaseDate = req.body.movieReleaseDate;
	var movRating = req.body.movieRating;
	var movImdbRating = req.body.movieImdbRating;
	var movDirector = req.body.movieDirector;
	var movWriter = req.body.movieWriter;
	var movActors = req.body.movieActors;
	var movPlot = req.body.moviePlot;
	

	User.findOne({_id: userId}).then(function(record) {
		record.favorites.push({
			movieTitle: movTitle, 
			movieId: movId, 
			moviePoster: movPoster, 
			movieGenre: movGenre,
			movieReleaseDate: movReleaseDate, 
			movieRating: movRating,
			movieImdbRating: movImdbRating,
			movieDirector: movDirector,
			movieWriter: movWriter,
			movieActors: movActors,
			moviePlot: movPlot
		});
		record.save();
		
	});


});


// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		
		console.log(res);

		res.redirect('/');

	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;