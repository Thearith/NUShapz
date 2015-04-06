$( document ).ready(function() {
	sup();
});

var table_data = "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{7}</td></tr>";
var nil = "-";

function sup() {
	$.get( "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php", { cmd: "muahahahaha"}, function(data) {		
		var array = ['Today', 'Tomorrow', 'InAFewDays', 'AndMore'];
		var timeline = data.Timeline;
		for(var i=0; i<array.length; ++i) {
			var categoryOfEvents = timeline[array[i]];
			for(var j=0; j<categoryOfEvents.length; ++j) {
				var eventlist = categoryOfEvents[j].Events;
				for(var k=0; k<eventlist.length; ++k) {
					var eventid = (eventlist[k].ID == null || eventlist[k].ID == "") ? nil : eventlist[k].ID;
					var eventtit = (eventlist[k].Title == null || eventlist[k].Title == "") ? nil : eventlist[k].Title;
					var eventdes = (eventlist[k].Description == null || eventlist[k].Description == "") ? nil : eventlist[k].Description;
					var eventcat = (eventlist[k].Category == null || eventlist[k].Category == "") ? nil : eventlist[k].Category;
					var eventdat = (eventlist[k].DateAndTime == null || eventlist[k].DateAndTime == "") ? nil : eventlist[k].DateAndTime;
					var eventven = (eventlist[k].Venue == null || eventlist[k].Venue == "") ? nil : eventlist[k].Venue;
					var eventpri = (eventlist[k].Price == null || eventlist[k].Price == "") ? nil : eventlist[k].Price;
					var eventorg = (eventlist[k].Organizer == null || eventlist[k].Organizer == "") ? nil : eventlist[k].Organizer;
					var eventcon = (eventlist[k].Contact == null || eventlist[k].Contact == "") ? nil : eventlist[k].Contact;

					$("#data-table").append(table_data.format(
						eventid, eventtit, eventdes, eventcat, eventdat,
						eventven, eventpri, eventorg, eventcon));
				}
			}
		}
		
	});
}

String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined' ? args[number]: match;
	});
};