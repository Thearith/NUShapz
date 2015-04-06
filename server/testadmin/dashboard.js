$( document ).ready(function() {
	sup();
});

function sup() {
	$.get( "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php", { cmd: "muahahahaha"}, function(data) {
		console.log(data);
		console.log(data.Response);


		var table_data = 

		var array = ['Today', 'Tomorrow', 'InAFewDays', 'AndMore'];
		var timeline = data.Timeline;
		for(var i=0; i<array.length; ++i) {
			var categoryOfEvents = timeline[array[i]];
			for(var j=0; j<categoryOfEvents.length; ++j) {
				var eventlist = categoryOfEvents[i].Events;
				for(var k=0; k<eventlist.length; ++k) {
					console.log (eventlist[k].Title);



				}
			}
		}
	});
}