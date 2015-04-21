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
		postToServer();
	}

	function initStates() {
		isTimeline = TIMELINE;
	}

	function initHTMLDivs() {		
		initializeForm();
		initializeScrollspy();
		initializeClicks();
	}

	function initializeClicks() {
		handleFavoriteClick();
	}

	function initializeForm() {
		$('.modal-trigger').leanModal();
		$('.datepicker').pickadate({
   			selectMonths: true, // Creates a dropdown to control month
    		selectYears: 3 // Creates a dropdown of 15 years to control year
  		});
	}

	function initializeScrollspy() {
		$('.scrollspy').scrollSpy();
	}

	function handleFavoriteClick() {
		
	}

	function postToServer(cardID, name, value) {

	}

 	init();


});












