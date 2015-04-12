(function(){

var NUSHAPZ_API = "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php";
var TEST_API = "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/test.php";

var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"];

var DATE_DELIMITER = " - ";

var app = angular.module('nushapz-app', ['ngRoute', 'ngResource', 'datatables', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/createevent', {
			templateUrl: 'createevent.html'
		}).
		when('/eventdata/:eventType', {
			templateUrl: 'table.html'
		}).
		when('/event/:eventid', {
			templateUrl: 'event.html'
		}).
		when('/home', {
			templateUrl: 'home.html'
		}).
		when('/', {
			templateUrl: 'home.html'
		}).
		otherwise({
			redirectTo: '/home'
		});
}]);

app.controller('tableController', 
	['$scope', '$routeParams', 'EventAPI', '$location', 'eventService',
	function($scope, $routeParams, EventGetAPI, $location, eventService ){
		if ($routeParams.eventType != undefined) {
			$scope.eventType = $routeParams.eventType.substring(1);
			$scope.eventList = [];

			EventGetAPI.query({cmd: $scope.eventType}).
				$promise.then(function(data){
					$scope.eventList = data.Events;
			});

			$scope.eventform = function (event) {
				eventService.setEvent($scope.eventType, event);
				$location.path('/event/'+event.ID);
			};
		}
}]);

app.controller('eventFormController', ['$scope', '$routeParams', 'eventService', '$location', 
	function($scope, $routeParams, eventService, $location) {
		$scope.cancel = function() {
			$location.path('/eventdata/:'+eventService.getTable());
		};
		$scope.submit = function() {
			$scope.event.DateAndTime = $scope.event.CurrentDateAndTime;
			$.post(NUSHAPZ_API, {cmd:'update', event: JSON.stringify($scope.event)}, function(data){
				if (data.Response == "Valid") {
					alert("Updated Event " + $scope.event.ID + " - " + $scope.event.Title);
				}
			});
		};
		$scope.submitnewevent = function() {
			$scope.event.DateAndTime = $scope.event.CurrentDateAndTime;
			$.post(NUSHAPZ_API, {cmd:'post', event: JSON.stringify($scope.event)}, function(data){
				if (data.Response == "Valid") {
					alert("Created Event " + $scope.event.ID + " - " + $scope.event.Title);
				}
			});
		};
		$scope.setdate = function() {
			if(!($scope.EndTime <= $scope.StartTime && $("#startdate").val() >= $("#enddate").val())) {
				var st = new Date($scope.StartTime);
				st = formatIntegerToLength(st.getHours(),2)+":"+formatIntegerToLength(st.getMinutes(),2);
				var et = new Date($scope.EndTime);
				et = formatIntegerToLength(et.getHours(),2)+":"+formatIntegerToLength(et.getMinutes(),2);
				$scope.event.PreviousDateAndTime = $scope.event.DateAndTime;
				$scope.event.CurrentDateAndTime = $("#startdate").val()+" "+st+DATE_DELIMITER+$("#enddate").val()+" "+et;
			}
		};
		$scope.resetdate = function() {
			if($scope.event.PreviousDateAndTime) {
				$scope.event.CurrentDateAndTime = $scope.event.PreviousDateAndTime;
			}
		};
		// Datepicker UI
		$scope.today = function() {
			var now = new Date();
			now.setMinutes(0);
			now.setMilliseconds(0);
			var datenow = now.getDate()+"-"+monthNames[now.getMonth()]+"-"+now.getFullYear();
			$scope.StartDate = $scope.EndDate = datenow;
			$scope.StartTime = $scope.EndTime =  now;
		};
		
		$scope.clear = function () {
			$scope.StartDate = datenow;
			$scope.EndDate = datenow;
			$scope.StartTime = datenow;
			$scope.dt = null;
		};

		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();

		$scope.openStartDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.startdateopened = true;
		};
		$scope.openEndDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.enddateopened = true;
		};
		
		$scope.initdate = function() {
			$scope.event.CurrentDateAndTime = $scope.event.DateAndTime;
			if($scope.event.Flag == 0) {
				var split = $scope.event.CurrentDateAndTime.split(" - ");
				$scope.StartDate = split[0].split(",")[0];
				$scope.StartTime = split[0];
				$scope.EndDate = split[1].split(",")[0];
				$scope.EndTime = split[1];
			} else {
				$scope.today();
			}
		};
		$scope.delete = function() {
			var deletepopup = confirm("Delete Event "+$scope.event.ID+" - "+$scope.event.Title+"?");
			if(deletepopup) {
				$.post(NUSHAPZ_API, {cmd:'delete', eventid: $scope.event.ID}, function(data){
					if(data.Response == "Valid") {
						alert("Deleted event");
					} else {
						alert("Error deleting event");
					}
				});
			}
		} 

		$scope.formats = ['dd MMMM yyyy'];
		$scope.format = $scope.formats[0];

		$scope.event = eventService.getEvent();
		$scope.initdate();
		
}]);

app.controller('createEventController', ['$scope', '$routeParams', 'eventService', '$location', 
	function($scope, $routeParams, eventService, $location) {
		$scope.clearform = function() {
			$scope.event = {ID: "New"};
		};
		$scope.submitnewevent = function() {
			$scope.setdate();
			$scope.event.DateAndTime = $scope.event.CurrentDateAndTime;
			$.post(NUSHAPZ_API, {cmd:'post', event: JSON.stringify($scope.event)}, function(data){
				if (data.Response == "Valid") {
					alert("Created New Event - " + $scope.event.Title);
				}
			});
		};
		$scope.setdate = function() {
			if(!($scope.EndTime <= $scope.StartTime && $("#startdate").val() >= $("#enddate").val())) {
				var st = new Date($scope.StartTime);
				st = formatIntegerToLength(st.getHours(),2)+":"+formatIntegerToLength(st.getMinutes(),2);
				var et = new Date($scope.EndTime);
				et = formatIntegerToLength(et.getHours(),2)+":"+formatIntegerToLength(et.getMinutes(),2);
				$scope.event.PreviousDateAndTime = $scope.event.DateAndTime;
				$scope.event.CurrentDateAndTime = $("#startdate").val()+" "+st+DATE_DELIMITER+$("#enddate").val()+" "+et;
			}
		};
		// Datepicker UI
		$scope.today = function() {
			var now = new Date();
			now.setMinutes(0);
			now.setMilliseconds(0);
			var datenow = now.getDate()+"-"+monthNames[now.getMonth()]+"-"+now.getFullYear();
			$scope.StartDate = $scope.EndDate = datenow;
			$scope.StartTime = $scope.EndTime =  now;
		};
		
		$scope.clear = function () {
			$scope.StartDate = datenow;
			$scope.EndDate = datenow;
			$scope.StartTime = datenow;
			$scope.dt = null;
		};

		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();

		$scope.openStartDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.startdateopened = true;
		};
		$scope.openEndDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.enddateopened = true;
		};
		$scope.formats = ['dd MMMM yyyy'];
		$scope.format = $scope.formats[0];
		$scope.event = {};
		$scope.today();
}]);

app.controller('homeController', ['$scope', 
	function($scope){
}])


app.factory('EventAPI', ['$resource', function($resource){
	return $resource((NUSHAPZ_API+'?cmd=:cmd'), {cmd : '@cmd'}, {
		'query':  {method:'GET', isArray:false}
	});
}]);


app.service('eventService', function() {
	this.event = {};
	this.table = "";

	this.setEvent = function(table, event) {
		this.table = table;
		this.event = event;


	}

	this.getEvent = function() {
		return this.event;
	}

	this.getTable = function() {
		return this.table;
	}
});

// Utility functions
function formatIntegerToLength(int, length) {
	var s = int.toString();
	while(s.length < length) {
		s = "0"+s;
	}
	return s;
}


// Built-in JS
$(function() {
    $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});

})();

