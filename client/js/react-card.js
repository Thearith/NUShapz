// React components

var Body;

var App;
var Loading;

var Navbar;
var MainContainer;
var ModalForm;

var Logo;
var NavbarForm;

var Search;
var NewEvent;

var Content;
var Sidebar;

var Timeline;  //contains timeline sections

var TimelineSection; //contains categories within the same timeline section
var LeftSideBar;
var CategorySections;
var CategorySection; // contains events of the same category
var EventSection;
var Event;
var EventHeader;
var EventContent;
var EventReveal;

var EventTitle;
var EventOrganizer;
var EventBottom;

var EventInformation;
var EventStar;

var EventDateTime;
var EventVenue;

var Title;
var EventDescription;
var EventContact;


var SERVER = "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php?cmd=timeline";
//var SERVER = "timeline.json";

//Timeline
var TIMELINE = "Timeline";
var TODAY_INDEX = 0;
var TOMORROW_INDEX = 1;
var FEW_DAYS_INDEX = 2;
var MORE_INDEX = 3;
var TIMELINE_ARRAY = ["Today", "Tomorrow", "InAFewDays", "AndMore"];

//Category
var CATEGORY_ARRAY = ["Arts","Workshops","Conferences","Competitions","Fairs","Recreation","Wellness","Social","Volunteering","Recruitments","Others"];
var IMAGE_PATH = "../image/category/";

// constants
var TITLE_MAXIMUM_LENGTH = 40;
var NON_IDENTIFIED = "N/A";

// date
var MONTHS = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var DAY = "day";
var WEEKDAY = "weekday";
var MONTH = "month";

var MORE = "And more";
var PLUS = "+"; 

//section-category
var CATEGORY = 'Category';

// Events
var EVENTS = 'Events';

// Event
var EVENT_ID = 'ID';
var TITLE = 'Title';
var DESCRIPTION = 'Description';
var DATETIME = 'DateAndTime';
var ORGANIZER = 'Organizer';
var CONTACT = 'Contact'
var VENUE = 'Venue';

// check null objects
function isRealValue(obj){
	return obj && obj !== "null" && obj!== "undefined";
}

function getDateJSON(date) {
	if(date != null) {
		day = date.getDate();
		weekDay = WEEKDAYS[date.getDay()];
		month = MONTHS[date.getMonth()];
		return {
			"day" : day,
			"weekday" : weekDay,
			"month" : month
		};
	} else {
		return {
			"day" : PLUS,
			"weekday": MORE,
			"month" : ""
		};
	}
}


/*
 * Create React components 
*/

Body = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentWillMount: function() {
		console.log("Body is initialized");
	},
	componentDidMount: function() {
	    $.ajax({
			type: 'GET',
	     	url: this.props.url,
	      	dataType: 'json',
	      	success: function(data) {
	      		console.log(data);
	      		this.setState({data: data});
	      	}.bind(this),
	      	error: function(xhr, status, err) {
	        	console.error(this.props.url, status, err.toString());
	      	}.bind(this)
	    });
	},
	render: function() {
		console.log(Object.keys(this.state.data).length != 0);
		return (
			<div>
				{ Object.keys(this.state.data).length != 0 ?  
					<App data={this.state.data[TIMELINE]} /> : 
					<Loading /> 
				}
			</div>

		);
	}
});

Loading = React.createClass({
	render: function() {
		return (
			<div className="row loading">
				<div className="col s12 m12 center">
					<div className="preloader-wrapper big active">
		    			<div className="spinner-layer spinner-yellow-only">
		      				<div className="circle-clipper left">
		        				<div className="circle"></div>
		      				</div>
		      				<div className="gap-patch">
		        				<div className="circle"></div>
		      				</div>
		      				<div className="circle-clipper right">
		        				<div className="circle"></div>
		      				</div>
		    			</div>
		  			</div>
		  		</div>
		  	</div>
  		);
	}
});

App = React.createClass({
	componentWillMount: function() {
		console.log("App is initialized");
	},
	render: function() {
		return (
			<div>
				<Navbar data={this.props.data} />
				<ModalForm data={this.props.data} />
				<MainContainer data={this.props.data} />
			</div>
		);
	}
});

Navbar = React.createClass({
	componentWillMount: function() {
		console.log("Navbar is initialized");
	},
	render: function() {
		return (
			<div className="navbar-fixed">
				<nav>
    				<div className="nav-wrapper orange">
						<Logo />
						<NavbarForm data={this.props.data} />
					</div>
				</nav>
			</div>
		);
	}
});

Logo = React.createClass({
	componentWillMount: function() {
		console.log("Navbar is initialized");
	},
	render: function() {
		return (
			<a href="#" className="brand-logo logo-align">
				<img src={"image/logo.png"} id="logo" />
			</a>
		);
	}
});

NavbarForm = React.createClass({
	componentWillMount: function() {
		console.log("NavbarForm is initialized");
	},
	render: function() {
		return (
			<ul id="nav-mobile" className="right hide-on-small-only">
        		<li>
        			<Search data={this.props.data} />
        		</li>
        		<li>
        			<NewEvent />
        		</li>
        	</ul>
        );
	}
});

Search = React.createClass ({
	componentWillMount: function() {
		console.log("Search is initialized");
	}, 
	render: function() {
		return (
			<form>
	        	<div className="input-field search-outer left">
	          		<input id="search" type="text" placeholder="Search for events" />
	          		<label htmlFor="search">
	          			<i className="mdi-action-search search-icon"></i>
	          		</label>
	        	</div>
			</form>
		);
	}
});

NewEvent = React.createClass({
	componentWillMount: function() {
		console.log("NewEvent is initialized");
	},
	render: function() {
		return (
			<div className="new-event">
	        	<a className="modal-trigger" href={"#modal-newevent"}>
	        		<i className="mdi-content-add left newevent-icon"></i>
	        		<span className="newevent-text">NEW EVENT</span>
	        	</a>
			</div>
		);
	}
});

ModalForm = React.createClass({
	componentWillMount: function() {
		console.log("ModalForm is initialized");
	},
	componentDidMount: function() {
		$('.modal-trigger').leanModal();
		$('.datepicker').pickadate({
   			selectMonths: true, // Creates a dropdown to control month
    		selectYears: 3 // Creates a dropdown of 15 years to control year
  		});
	},
	render: function() {
		var redStyle = {
			color: 'red',
			fontSize: '14px'
		};

		var marginRightStyle = {
			marginRight: '10px'
		};
		return (
			<div id="modal-newevent" className="modal modal-fixed-footer">
	    		<div className="modal-content">
	      			<h4>Submit an Event</h4>
	      			<i style={redStyle}>This feature is not implemented yet. Stay tuned</i>

	  				<div className="row">
	    				<form className="col s12">
	      					<div className="row">
	        					<div className="input-field col s6">
	          						<i className="mdi-action-announcement prefix"></i>
	          						<input id="event_title" type="text" className="validate" />
	          						<label htmlFor="event_title">Event Title</label>
	        					</div>
	        					<div className="input-field col s6">
							        <i className="mdi-action-account-balance prefix"></i>
							        <input id="organisation" type="text" className="validate" />
							        <label htmlFor="organisation">Organisation</label>
	        					</div>
	      					</div>

	      					<div className="row">
	        					<div className="input-field col s12">
	          						<i className="mdi-action-subject prefix"></i>
	          						<textarea id="event_desc" className="materialize-textarea validate"></textarea>
	          						<label htmlFor="event_desc">Event Description</label>
	        					</div>
	      					</div>

	      					<div className="row">
	        					<div className="input-field col s4">
	          						<i className="mdi-notification-event-note prefix"></i>  						
	          						<input id="event_date" type="date" className="datepicker" />
	          						<label className="active" htmlFor="event_date">Event Date</label>
	        					</div>

	        					<div className="input-field col s4">
	          						<i className="mdi-device-access-time prefix"></i>
	          						<input id="event_time" type="text" className="validate" />
	          						<label htmlFor="event_time">Start Time</label>
	        					</div>
	        
	        					<div className="input-field col s4">
	          						<i className="mdi-maps-place prefix"></i>
	          						<input id="event_venue" type="text" className="validate" />
	          						<label htmlFor="event_venue">Event Venue</label>
	        					</div>
	      					</div>

	      					<div className="row">
	        					<div className="input-field col s4">
	          						<i className="mdi-maps-local-atm prefix"></i>
							        <input id="event_price" type="text" className="validate" />
							        <label htmlFor="event_price">Price</label>
	        					</div>
						        <div className="input-field col s8">
						          	<i className="mdi-content-mail prefix"></i>
						          	<input id="email" type="email" className="validate" />
						          	<label htmlFor="email">Email</label>
						        </div>
						    </div>
	    				</form>
	  				</div>  

	  				<p className="disclaimer">* Events that are submitted are not displayed immediately as events have to be verified.</p>  

	    		</div>

			    <div className="modal-footer">
			      	<button className=" modal-action modal-close btn red waves-effect waves-red">
			      		Cancel
			      		<i className="mdi-navigation-close right"></i>
			      	</button>
			      	<button className=" modal-action modal-close btn waves-effect waves-light" style={marginRightStyle}>
			      		Submit
			      		<i className="mdi-content-send right"></i>
			      	</button>
			    </div>
			</div>
		);
	}
});

MainContainer = React.createClass({
	componentWillMount: function() {
		console.log("MainContainer is initialized");
	},
	render: function() {
		return (
			<div className="container-fluid" id="main-container">
				<div className="row">
					<Timeline data={this.props.data} />
					<Sidebar />
				</div>
			</div>
		);
	}
});

Sidebar = React.createClass ({
	componentWillMount: function() {
		console.log("MainContainer is initialized");
	},
	render: function() {
		return (
			<div className="col l2 m3 hide-on-small-only">
				<div className="side-bar z-depth-1">
					<div className="side-content">
						<div className="browse-events">Browse Events</div>

			    		<a className="date" href={"#section-1"}>
			    			<div className="browse-date"><ul>Today</ul></div>
			    		</a>
			    		<a className="date" href={"#section-2"}>
			    			<div className="browse-date"><ul>Tomorrow</ul></div>
			    		</a>
			    		<a className="date" href={"#section-3"}>
			    			<div className="browse-date"><ul>In a few days</ul></div>
			    		</a>
			    		<a className="date" href={"#section-4"}>
			    			<div className="browse-date"><ul>And more</ul></div>
			    		</a>

					</div>
				</div>
			</div>
		);
	}
});


Timeline = React.createClass({
	componentWillMount: function() {
		console.log("Timeline is initialized");
	},
	componentDidMount: function() {
		$('.scrollspy').scrollSpy();
	},
	render: function() {
		return (	
			<div className="col l10 m9 s12" id="content">
				<div className="section scrollspy" id="section-1">
					<TimelineSection categories={this.props.data[TIMELINE_ARRAY[TODAY_INDEX]]}
						index={0} />
				</div>

				<div className="section scrollspy" id="section-2">
					<TimelineSection categories={this.props.data[TIMELINE_ARRAY[TOMORROW_INDEX]]} 
						index={1}/>
				</div>

				<div className="section scrollspy" id="section-3">
					<TimelineSection categories={this.props.data[TIMELINE_ARRAY[FEW_DAYS_INDEX]]}
						index={2} />
				</div>

				<div className="section scrollspy" id="section-4">
					<TimelineSection categories={this.props.data[TIMELINE_ARRAY[MORE_INDEX]]} 
						index={3} />
				</div>
			</div>
		);
	}

});
	
TimelineSections = React.createClass({
	componentWillMount: function() {
		console.log("TimelineSections is initialized");
	},
	
	render: function() {
		
	}
});

// contains a timeline with leftsidebar and a lot of categorysections
TimelineSection = React.createClass({
	componentWillMount: function() {
		console.log("TimelineSection is initialized");
	},
	render: function() {
		return (
			<div className="row">
				<LeftSideBar index = {this.props.index} />
				<CategorySections categories = {this.props.categories} />
			</div>
		);
	}
});


LeftSideBar = React.createClass({
	componentWillMount: function() {
		console.log("LeftSideBar is initialized");
	},
	render: function() {
		var date = new Date();
		var json;

		switch(this.props.index) {
			case TODAY_INDEX:
				json = getDateJSON(date);
				break;

			case TOMORROW_INDEX:
				var tmrDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
				json = getDateJSON(tmrDate);
				break;

			case FEW_DAYS_INDEX:
				var fewDaysDate = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000);
				json = getDateJSON(fewDaysDate);
				break;

			case MORE_INDEX:
				json = getDateJSON(null);
				break;
		}

		console.log(json);

		return (
			<div className="col l2 hide-on-med-and-down">
				<div className="date-content center">
					<div className="cal">
						<div className="cal-day">{json[WEEKDAY]}</div>
						<div className="cal-date">{json[DAY]}</div>
						<div className="cal-month">{json[MONTH]}</div>
					</div>
				</div>
			</div>
		);
	}
});

//contains a lot of categories
CategorySections = React.createClass({
	componentWillMount: function() {
		console.log("CategorySections is initialized");
	},
	render: function() {
		var CategorySectionNode = this.props.categories.map(function(category, index) {
      		return ( 
      			<CategorySection category={category} key={index} />
		    );
		});
		return (
			<div className="col l10 m12 section-category cards">
				{CategorySectionNode}
			</div>
		);
	}
});

// contains a lot of events
CategorySection = React.createClass({
	componentWillMount: function() {
		console.log("CategorySection is initialized");
	},
	render: function(){
		return (
			<EventSection events={this.props.category[EVENTS]} />
		);
	}
});

EventSection = React.createClass({
	componentWillMount: function() {
		console.log("EventSection is initialized");
	},
	render: function() {
		var EventNode = this.props.events.map(function(data, index) {
			return (
				<Event data={data} key={index}/>
			);
		});

		return (
			<div>
				{EventNode}
			</div>
		);
	}
});

Event = React.createClass({
	componentWillMount: function() {
		console.log("Event is initialized");
	},
	render: function() {
		return (
			<div className="card small" id={this.props.data[EVENT_ID]} >
				<EventHeader category={this.props.data[CATEGORY]} />
				<EventContent data={this.props.data} />
				<EventReveal data={this.props.data} />
			</div>
		);
	}
});

EventHeader = React.createClass({
	componentWillMount: function() {
		console.log("EventHeader is initialized");
	},
	render: function() {
		var src = IMAGE_PATH + this.props.category + ".jpg";
		return (
			<div className="card-image waves-effect waves-block waves-light">
				<div className="activator category-title resize-on-medium resize-on-xs">{this.props.category}</div>
				<img className="activator" src={src}/>
			</div>
		);
	}
});

EventContent = React.createClass({
	componentWillMount: function() {
		console.log("EventContent is initialized");
	},
	render: function() {
		return (
			<div className="card-content">
				<EventTitle title={this.props.data[TITLE]} />
				<EventOrganizer organizer={this.props.data[ORGANIZER]} />
				<EventBottom data={this.props.data} />
			</div>
		);
	}
});

EventTitle = React.createClass({
	componentWillMount: function() {
		console.log("EventTitle is initialized");
	},
	render: function() {
		var title = this.props.title.length <= TITLE_MAXIMUM_LENGTH ?
					this.props.title : this.props.title.substring(0, TITLE_MAXIMUM_LENGTH) + "...";
		return (
			<span className="card-title activator grey-text text-darken-4">
				{title} 
				<i className="mdi-navigation-more-vert right"></i>
			</span>
		);
	}

});

EventOrganizer = React.createClass({
	componentWillMount: function() {
		console.log("EventOrganizer is initialized");
	},
	render: function() {
		var organizer = isRealValue(this.props.organizer) ?
			this.props.organizer : NON_IDENTIFIED;
		return (
			<div className="organizer">
				<i className="fa fa-university"></i>
				<p className="organizer-title">{organizer}</p>
			</div>
		);
	}
});

EventBottom = React.createClass({
	componentWillMount: function() {
		console.log("EventBottom is initialized");
	},
	render: function() {
		return (
			<div className="row">
				<EventInformation date={this.props.data[DATETIME]} venue={this.props.data[VENUE]}/>
				<EventStar />
			</div>
		);
	}
});

EventInformation = React.createClass({
	render: function() {
		return (
			<div className="col s10 information">
				<EventDateTime date={this.props.date} />
				<EventVenue venue = {this.props.venue} />
			</div>
		);
	}
});

EventDateTime = React.createClass({
	render: function() {
		return (
			<div className="datetime">
				<i className="fa fa-clock-o"></i>
				{this.props.date}			
			</div>
		);
	}
});

EventVenue = React.createClass({
	render: function() {
		return (
			<div className="venue">
				<i className="fa fa-map-marker"></i>
				<p>{this.props.venue}</p>
			</div>
		);
	}
});

EventStar = React.createClass({
	getInitialState: function() {
		return {liked : false};
	},
	handleClick: function(e) {
		this.setState({liked: !this.state.liked});
	},
	render: function() {
		var c = this.state.liked ?
			" amber lighten-1" : " grey lighten-1";
		return (
			<div className="col s2 favorite-container" onClick={this.handleClick}>
				<a className={"btn-floating btn-large waves-effect waves-light right favorite" + c}>
				 	<i className="mdi-action-grade"></i>
				</a>
			</div>
		);
	}
});

EventReveal = React.createClass({
	componentWillMount: function() {
		console.log("EventReveal is initialized");
	},
	render: function() {
		return (
			<div className="card-reveal">
				<Title title={this.props.data[TITLE]} />
				<hr />

				<EventDescription description={this.props.data[DESCRIPTION]} />
				<hr />

				<EventContact contact={this.props.data[CONTACT]} />
			</div>
		);
	}
});

Title = React.createClass({
	componentWillMount: function() {
		console.log("Title is initialized");
	},
	render: function() {
		return (
			<span className="card-title grey-text text-darken-4">
				{this.props.title}
				<i className="mdi-navigation-close right"></i>
			</span>
		);
	}
});

var converter = new Showdown.converter();

EventDescription = React.createClass({
	componentWillMount: function() {
		console.log("EventDescription is initialized");
	},
	render: function() {
		 var rawMarkup = converter.makeHtml(this.props.description.toString());
		return (
			<div className="description">
				<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
			</div>
		);
	}
});

EventContact = React.createClass({
	componentWillMount: function() {
		console.log("EventContact is initialized");
	},
	render: function() {
		var contact = isRealValue(this.props.contact) ?
				this.props.contact : NON_IDENTIFIED;
		return (
			<div className="contact">
				<i className="fa fa-envelope"></i>
				{contact}
			</div>
		);
	}
});

React.render(
  <Body url={SERVER} />,
  document.body
);