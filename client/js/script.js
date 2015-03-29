$(document).ready(function(){

	// constant strings

	var FAVORITE = 'favorite';

	var SIDEBAR = [
		['Today', 'Tomorrow', 'In a few days', 'This week', 'This month', 'In a few months'],
		['Education', 'Recreation', 'Recruitment', 'Volunteering', 'Misc', 'New']
	];

	var SIDEBAR_TITLE = ['Timeline', 'Category'];

	// states
	var isTimeline = 0;


	// Cache the jQuery selectors.
	var $body = $('body');
	var $card = $('.card');
	var $venue = $('.card .venue');
	var $favimg = $('.card .fav-img');
	var $datepicker = $('#inputDate');
	var $navsidebarLink = $('#navsidebar .nav li a');
	var $sidebarArrow  = $('#sidebar-arrow');
	var $title = $('#title');

	function init() {
		initStates();
		initHTMLDivs();
	}

	function initStates() {

	}

	function initHTMLDivs() {
		initializeClicks();
	}

	function initializeClicks() {
		toggleDescription();
		handleFavoriteClick();

		handleSideBarArrowClick();
		
		initializeDatePicker();

		initializeParallax();
		initializeScrolling();
	}

	function toggleDescription() {
		$card.click(function() {
			var description = $(this).find('.description');
			description.toggle('slow');
		});
	}

	function handleFavoriteClick() {
		$favimg.click(function(){
			var src = $(this).attr('src');
			var cardID = $(this).parent().attr('id');

			if(src == "image/star.png") {
				$(this).attr('src', 'image/star-fav.png');
				postToServer(cardID, FAVORITE, 1);
			} else {
				$(this).attr('src', 'image/star.png');
				postToServer(cardID, FAVORITE, 0);
			}
		});
	}

	function handleSideBarArrowClick() {
		$sidebarArrow.click(function(){
			isTimeline = 1 - isTimeline;
			$title.html(SIDEBAR_TITLE[isTimeline]);

			for(i=0; i<SIDEBAR[isTimeline].length; i++) {
				$('#navsidebar ul li:nth(' + i + ') span').html(SIDEBAR[isTimeline][i]);
			}

			// change events sorting from timeline to category
		});
	}

	function initializeDatePicker() {
		$datepicker.datepicker();
	}

	function initializeParallax() {
		$navsidebarLink.bind('click',function(event){
	 		var $anchor = $(this);
	 
			$('html, body').stop().animate(
				{
					scrollTop: $($anchor.attr('href')).offset().top-100
				}, 1000,'easeInOutExpo');

 			event.preventDefault();
 		});
	}

	function initializeScrolling() {
		$body.scrollspy({ target: '#navsidebar', offset : 400 });
	}

	function postToServer(cardID, name, value) {

	}

 	init();


});

// <div class="card" id="card-1">
// 	<div class="row">
// 		<div class="col-md-10">
// 			<div class="card-title card-content">
// 				<div>
// 					<h1>Do You Believe In Love?</h1>
// 					<div class="organizer" >
// 						<i class="fa fa-university"></i>
// 						<p>NUS Centre For the Arts</p>
// 					</div>
// 				</div>
// 			</div>

// 			<div class="card-body card-content">
// 				<div class="datetime">
// 					<i class="fa fa-clock-o"></i>
// 					<p>
// 						<span class="time">7.30pm</span>
// 						|
// 						<span class="date">Thu, 26 Mar</span>
// 				</div>

// 				<div class="venue">
// 					<i class="fa fa-map-marker"></i>
// 					<p>Ngee Ann Kongsi Auditorium</p>
// 				</div>

// 				<div class="description disappear" style="display:none;">
// 					<hr/>
// 					<img src="http://www.nus.edu.sg/cfa/NAF_2015/images/pg/film/film_doyoubelieveinlove_indiv.jpg" class="img-responsive clearfix center description-img" />

// 					<div class="description-text">
// 						<p>DO YOU BELIEVE IN LOVE? </p>
						
// 						<p>Thu 26 Mar | 7.30pm | Ngee Ann Kongsi Auditorium </p>

// 						<p>Free admission with registration.</p>
// 						<p>Register</p>


// 						<p>Dan Wasserman | Israel | 2013</p>
// 						<p>50 mins | Rating to be advised | Hebrew with English subtitles</p>

// 						<p>Even though Tova does not believe in love, she has had remarkable success as a matchmaker. Tova, who is paralyzed, specializes in finding matches for people with disabilities. Her tough-love approach leads to a unique matchmaking style but her passion for the work and clients is undeniable. Do You Believe in Love? follows Tova over the course of a year and invites us to join in on her pain, humour, love, and enormous lust for life.</p>

// 						<p>Commemorate International Women’s Day at the post-film panel discussion, “A Life Beyond Limits”, where we applaud women overcoming physical adversity.</p>


// 						<p>Awards:</p>
// 						<p>§  Silver Horn Award, Krakow International Film Festival 2014, Poland</p>
// 						<p>§  Special Mention Award, BOSIFEST 2014, Serbia</p>


// 						<p>For more information and updates, please visit nusartsfestival.com or follow us on Facebook!
// 						Enquiries are welcome at nusartsfestival@nus.edu.sg. </p>
// 					</div>

// 				</div>
// 			</div>
// 		</div>

// 		<div class="col-md-2">	
// 			<div class="favorite">
// 				<img src="image/star.png" class="img-responsive center fav-img">
// 			</div>
// 		</div>
// 	</div>
	
// 	<hr/>

// 	<div class="card-footer card-content">
// 		<div class="social-media">
// 			<p>
// 				Share via
// 				<span>
// 					<a href="https://twitter.com/home?status=https://cp3101b.comp.nus.edu.sg/~sothearith/lab7/" title="Share on Twitter" target="_blank" class="btn btn-social btn-twitter text-center">
// 						<i class="fa fa-twitter"></i>
// 						Twitter
// 					</a>
// 					<a href="https://www.facebook.com/sharer/sharer.php?u=https://cp3101b.comp.nus.edu.sg/~sothearith/lab7/" target="_blank" class="btn btn-social btn-facebook">
// 						<i class="fa fa-facebook"></i>
// 						Facebook
// 					</a>
// 					<a href="https://plus.google.com/share?url=https://cp3101b.comp.nus.edu.sg/~sothearith/lab7/" target="_blank" class="btn btn-social btn-googleplus">
// 						<i class="fa fa-google-plus"></i>
// 						Google+
// 					</a>
// 				</span>
// 			</p>
// 		</div>
// 	</div>
// </div>

// var Card;
// var CardTitle;
// var CardBody;
// var FavoriteImage;
// var CardFooter;

// function createACard(cardData) {
// 	var Card = React.createClass({
// 		render: function() {
// 			return (

// 				<div className="row">
// 					<div className="col-md-10">
// 						<CardTitle />
// 						<CardBody />
// 					</div>

// 					<div className="col-md-2">
// 						<div className="favorite">
// 							<FavoriteImage />
// 						</div>
// 					</div>

// 				</div>

// 				<hr/>
				
// 				<CardFooter />

// 			);
// 		}

// 	});
// }

// function createCardTitle() {
// 	var Row = React.createClass({
// 		render: function() {
// 			return (
// 			);
// 		}
// 	});
// }

// function createCardBody() {

// }

// function createFavoriteImage() {

// }

// function createCardFooter() {

// }












