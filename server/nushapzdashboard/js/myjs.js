var NUSHAPZ_API = "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php?cmd=";

var app = angular.module('nushapz-app', ['ngRoute', 'ngResource']);

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
	['$scope', '$routeParams', 'EventGetAPI', '$location', 'eventService',
	function($scope, $routeParams, EventGetAPI, $location, eventService ){
		if ($routeParams.eventType != undefined) {
			$scope.eventType = $routeParams.eventType.substring(1);
			$scope.eventList = [];
			EventGetAPI.query({eventType: $scope.eventType}).
				$promise.then(function(data){
					$scope.eventList = data.Events;
			});

			$scope.eventform = function (event) {
				eventService.setEvent($scope.eventType, event);
				$location.path('/event/'+event.ID);
			};
		}
}]);

app.controller('eventFormController', ['$scope', '$routeParams', 'eventService',
	function($scope, $routeParams, eventService) {
		if($routeParams.eventid != undefined) {
			$scope.event = eventService.getEvent();
			console.log(eventService.getTable());
			$scope.cancel = function() {
				console.log('cancel');
			};

			$scope.submit = function() {
				console.log('submit');
			};
		}
}]);

app.controller('homeController', ['$scope', 
	function($scope){
}])

app.controller('createEventController', ['$scope', 
	function($scope) {
}]);

app.factory('EventGetAPI', ['$resource', function($resource){
	return $resource((NUSHAPZ_API+':eventType'), {eventType : '@eventType'}, 
		{'query':  {method:'GET', isArray:false}});
}]);

app.factory('EventPostAPI', ['$resource', function($resource){
	return $resource((NUSHAPZ_API+':eventType'), {eventType : '@eventType'}, 
		{'query':  {method:'POST', isArray:false}});
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
