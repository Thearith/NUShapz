$(document).ready(function(){

	// constant strings

	var FAVORITE = 'favorite';

	var SIDEBAR = [
		['Today', 'Tomorrow', 'In a few days', 'This week', 'This month', 'In a few months'],
		['Education', 'Recreation', 'Recruitment', 'Volunteering', 'Misc', 'New']
	];

	var SIDEBAR_TITLE = ['Timeline', 'Category'];

	var CARD_DESCRIPTION_SHOW = "description-show";

	// constant integers
	var TIMELINE = 0;
	var CATEGORY = 1;

	// states
	var isTimeline = 0;


	// Cache the jQuery selectors.
	var $body = $('body');
	var $cardTitle = $('.card-title');
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
		isTimeline = TIMELINE;
	}

	function initHTMLDivs() {		
		initializeForm();
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

	function initializeForm() {
		$('.modal-trigger').leanModal();
		$('.datepicker').pickadate({
   			selectMonths: true, // Creates a dropdown to control month
    		selectYears: 3 // Creates a dropdown of 15 years to control year
  		});
	}

	function toggleDescription() {
		$cardTitle.click(function() {
			var parent = $(this).parent('.card');
			var description = parent.find('.description');
			description.toggle('slow');
			
			if($cardTitle.hasClass(CARD_DESCRIPTION_SHOW)) {
				$cardTitle.removeClass(CARD_DESCRIPTION_SHOW);
				$('html, body').stop().animate(
				{
					scrollTop: $(this).offset().top-100
				}, 1000,'easeInOutExpo');

			} else {
				$cardTitle.addClass(CARD_DESCRIPTION_SHOW);
			}
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
			// $('.card .' + CARD_DESCRIPTION_SHOW).hide();

	 		var $anchor = $(this);
	 
			$('html, body').stop().animate(
				{
					scrollTop: $($anchor.attr('href')).offset().top + 400
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












