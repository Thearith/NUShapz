$(document).ready(function(){

	// Cache the jQuery selectors.
	var $card = $('.card');
	var $venue = $('.card .venue');
	var $favimg = $('.card .fav-img');

	$card.click(function() {
		var description = $(this).find('.description');
		description.toggle('slow');
	});

	$favimg.click(function(){
		var src = $(this).attr('src');
		if(src == "image/star.png")
			$(this).attr('src', 'image/star-fav.png');
		else
			$(this).attr('src', 'image/star.png');
	});

	$("#inputDate").datepicker();

	$('body').scrollspy({ target: '#navsidebar', offset : 100 });

 	$('#navsidebar .nav li a').bind('click',function(event){
 		var $anchor = $(this);
 
		$('html, body').stop().animate({
		scrollTop: $($anchor.attr('href')).offset().top-100
		}, 1000,'easeInOutExpo');

 	event.preventDefault();
 	});


});