(function(){

var NUSHAPZ_API = "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php";
var TEST_API = "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/test.php";
var app = angular.module('nushapz-app', ['ngRoute', 'ngResource', 'datatables']);

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
		if($routeParams.eventid != undefined) {
			$scope.event = eventService.getEvent();
			$scope.cancel = function() {
				$location.path('/eventdata/:'+eventService.getTable());
			};

			$scope.submit = function() {
				$.post(NUSHAPZ_API, {cmd:'update', event: JSON.stringify($scope.event)}, function(data){
					if (data.Response == "Valid") {
						alert("Updated Event " + $scope.event.ID + " - " + $scope.event.Title);
					}
				});
			};
		}
}]);

app.controller('homeController', ['$scope', 
	function($scope){
}])

app.controller('createEventController', ['$scope', 
	function($scope) {
}]);

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

