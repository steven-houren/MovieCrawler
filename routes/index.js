var express = require('express');
var router = express.Router();

var axiosInclude = require('axios');
var jq = require('jquery');

var User = require('../models/user');

// var mainJS = require('../public/js/main.js');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){

		var userId = res.locals.user._id;
	
		User.findOne({_id: userId}).then(function(response) {
			console.log(response);

			var favoriteList = response.favorites;

			console.log('List of favorites: ' + favoriteList);

			res.render('index', {
				content: favoriteList
			});



			// let output = '';
			// $.each(favoriteList, (index, favorite) => {
			// 	output += `
			// 		<div class="col-md-3">
			// 			<div class="well text-center">
			// 				<img src="jq.${favorite.Poster}">
			// 				<p>jq.${favorite.Title}</p>
			// 				<a onclick="movieSelected('jq.${favorite.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
			// 			</div>
			// 		</div>
			// 	`;
			// });
			// $('#favorites').html(output);
			
		}).catch((err) => {
			console.log(err);
		});

		
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;