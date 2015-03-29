$(document).ready(function(){

	$(".card").click(function() {
		var description = $(this).find('.description');
		description.show('slow');
	});

	$(".card .fav-img").click(function(){
		var src = $(this).attr('src');
		if(src == "image/star.png")
			$(this).attr('src', 'image/star-fav.png');
		else
			$(this).attr('src', 'image/star.png');
	});
});