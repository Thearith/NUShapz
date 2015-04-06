// json
var events;

// virtual doms
var Timeline; 

var Loading;
var TimelineSections; //contains timeline sections

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

//section
var TIMELINE = "Timeline";
var TODAY_INDEX = 0;
var TOMORROW_INDEX = 1;
var FEW_DAYS_INDEX = 2;
var MORE_INDEX = 3;
var TIMELINE_ARRAY = ["Today", "Tomorrow", "InAFewDays", "AndMore"];
var MONTHS = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var NON_IDENTIFIED = "N/A";

var TITLE_MAXIMUM_LENGTH = 40;

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


/*
 * Create Event doms 
*/

Timeline = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentWillMount: function() {
		console.log("Timeline is initialized");
	},
	componentDidMount: function() {
	    $.ajax({
			type: 'GET',
	     	url: this.props.url,
	      	dataType: 'json',
	      	success: function(data) {
	      		console.log(data);
	      		events = data;
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
					<TimelineSections timelines={this.state.data[TIMELINE]} /> : 
					<Loading /> 
				}
			</div>

		);
	}

});

Loading = React.createClass({
	render: function() {
		return (
			<div className="preloader-wrapper big active loading">
	    		<div className="spinner-layer spinner-blue-only">
	      			<div className="circle-clipper left">
	        			<div className="circle"></div>
	      			</div>
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
		console.log(this.props);
		return (
			<div>
				<div className="section scrollspy" id="section-1">
					<TimelineSection categories={this.props.timelines[TIMELINE_ARRAY[TODAY_INDEX]]}
						index={0} />
				</div>

				<div className="section scrollspy" id="section-2">
					<TimelineSection categories={this.props.timelines[TIMELINE_ARRAY[TOMORROW_INDEX]]} 
						index={1}/>
				</div>

				<div className="section scrollspy" id="section-3">
					<TimelineSection categories={this.props.timelines[TIMELINE_ARRAY[FEW_DAYS_INDEX]]}
						index={2} />
				</div>

				<div className="section" id="section-4">
					<TimelineSection categories={this.props.timelines[TIMELINE_ARRAY[MORE_INDEX]]} 
						index={3} />
				</div>
			</div>
		);
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
		var text;
		var day;

		switch(this.props.index) {
			case TODAY_INDEX:
				day = date.getDate();
				text = date.getDate() + " " + MONTHS[date.getMonth()];
				break;

			case TOMORROW_INDEX:
				var tmrDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
				day = tmrDate.getDate();
				text = tmrDate.getDate() + " " + MONTHS[tmrDate.getMonth()];
				break;

			case FEW_DAYS_INDEX:
				var fewDaysDate = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000);
				var weekDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
				day = fewDaysDate.getDate();
				text = fewDaysDate.getDate() + " " + MONTHS[fewDaysDate.getMonth()] + " - " +
					weekDate.getDate() + " " + MONTHS[weekDate.getMonth()];
				break;

			case MORE_INDEX:
				day = "+";
				text = "And More";
				break;
		}

		return (
			<div className="col s2 left-sidebar">
				<h4>{text}</h4>
				<div className="center img-responsive calendar">
					<span className="calendar-day">{day}</span>
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
			<div className="col s10 section-category cards">
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
		return (
			<div className="card-image waves-effect waves-block waves-light">
				<div className="category-title">{this.props.category}</div>
				<img className="activator" src={"http://materializecss.com/images/office.jpg"}/>
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
	render: function() {
		return (
			<div className="col s2 favorite-container">
				<a className="btn-floating btn-large waves-effect waves-light right favorite">
				 	<i className="mdi-action-stars"></i>
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
  <Timeline url={SERVER} />,
  document.getElementById('content')
);