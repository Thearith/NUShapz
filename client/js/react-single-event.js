// React components

var Body;

var App;

var Navbar;
var MainContainer;
var ModalForm;

var Logo;
var NavbarForm;

var NewEvent;
var NewEventMobile;

var Content;

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

var SERVER_SHARE_SINGLE_EVENT = "http://hapz.nusmods.com/event/?id="; 
var SERVER_POST_EVENT = "http://hapz.nusmods.com/api.php";
var SERVER_GET_SINGLE_EVENT = "http://hapz.nusmods.com/api.php?cmd=singleEvent&eventid="; 
var QUERY = "id";

// constants
var NON_IDENTIFIED = "-";

var CATEGORY_ARRAY = ["Arts","Workshops","Conferences","Competitions","Fairs","Recreation","Wellness","Social","Volunteering","Recruitments","Others"];
var CATEGORY_BG_COLORS =  ["red", "pink", "purple", "indigo", "blue", "light-blue", "teal", "green", "light-green", "brown", "deep-orange"];

// date
var MONTHS = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var DAY = "day";
var WEEKDAY = "weekday";
var MONTH = "month";

var CATEGORY_ARRAY = [
	"Arts",
	"Competitions",
	"Conferences",
	"Fairs",
	"Recreation",
	"Recruitment",
	"Social",
	"Volunteering",
	"Wellness",
	"Workshops",
	"Others"
];

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
	return obj && obj !== "null" && obj!== "undefined" && obj !== "-";
}

function replaceTxtNotInA(html, regex, replace) {

	html = '>' + html + '<';

	//parse txt between > and < but not follow with</a
	html = html.replace(/>([^<>]+)(?!<\/a)</g, function(match, txt) {

		//now replace the txt
		return '>' + txt.replace(regex, replace) + '<';
	});

	//remove the head > and tail <
	return html.substring(1, html.length - 1);
}

function urlify(html) {

	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&amp;&@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;&@#\/%=~_|])/ig;
	html = replaceTxtNotInA(html, exp, "<a href='$1' target='_blank'>$1</a>");

	//URLs starting with "www."
	var exp2 = /\b(www\.[\S]+)\b/gi;
	html = replaceTxtNotInA(html, exp2, '<a href="http://$1" target="_blank">$1</a>');

	return html;
}


/*
 * Create React components 
*/

Body = React.createClass({
	getInitialState: function() {
		return {
			data: ""
		};
	},
	getUrlParameter: function(sParam) {
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
        		return sParameterName[1];
	    }
	},
	componentDidMount: function() {
		var id = this.getUrlParameter(QUERY);
	    $.ajax({
			type: 'GET',
	     	url: this.props.url + id,
	      	dataType: 'json',
	      	success: function(data) {
	      		this.setState({data: data});
	      	}.bind(this),
	      	error: function(xhr, status, err) {
	        	console.error(this.props.url, status, err.toString());
	      	}.bind(this)
	    });
	},
	render: function() {
		var id = this.getUrlParameter(QUERY);
		return (
			<div>
				{ this.state.data ?  
					<App data={this.state.data} urlPost={this.props.urlPost}/> : 
					<NoData id={id}/> 
				}
			</div>
		);
	}
});

NoData = React.createClass({
	render: function() {
		var style = {
			marginTop: "120px"
		};
		return (
			<div className="row">
				<div className="col s12 center" style={style}>
					<h3>Event with id {this.props.id} is not found</h3>
				</div>
		  	</div>
  		);
	}
});

App = React.createClass({
	render: function() {
		return (
			<div>
				<Navbar />
				<div className="searchbar-mobile-offset hide-on-med-and-up"></div>
				<ModalForm urlPost={this.props.urlPost}/>
				<MainContainer data={this.props.data}/>
			</div>
		);
	}
});

Navbar = React.createClass({
	render: function() {
		return (
			<div className="navbar-fixed">
				<nav>
    				<div className="nav-wrapper orange">
						<Logo />
						<NewEvent data={this.props.data} />
						<MobileNav data={this.props.data} />
					</div>
				</nav>
			</div>
		);
	}
});

Logo = React.createClass({
	render: function() {
		return (
			<a href="#" className="brand-logo logo-align">
				<img src={"../image/logo.png"} id="logo" />
			</a>
		);
	}
});

NewEvent = React.createClass({
	render: function() {
		return (
			<ul id="nav-mobile" className="right hide-on-small-only">
        		<li>
					<div className="new-event right">
			        	<a className="modal-trigger" href={"#modal-newevent"}>
			        		<i className="mdi-content-add left newevent-icon"></i>
			        		<span className="newevent-text">CREATE EVENT</span>
			        	</a>
					</div>
				</li>
        	</ul>
		);
	}
});

MobileNav = React.createClass({
	render: function() {
		return (
			<div className="new-event newevent-padding-mobile right hide-on-med-and-up">
				<a className="modal-trigger" href={"#modal-newevent"}>
					<i className="mdi-content-add left newevent-icon"></i>
				</a>
 			</div>
		);
	}
});

ModalForm = React.createClass({

	getInitialState: function() {
		return {
			errorTitle : '',
			errorOrganizer: '',
			errorCategory: '',
			errorDescription: '',
			errorStartDate: '',
			errorStartTime: '',
			errorEndDate: '',
			errorEndTime: '',
			errorContact: '',
			errorPrice: '',
			errorVenue: ''
		};
	},

	handleClick: function(e) {
		React.findDOMNode(this.refs.title).value = '';
    	React.findDOMNode(this.refs.organizer).value = '';
    	React.findDOMNode(this.refs.category).value = '';
    	React.findDOMNode(this.refs.description).value = '';
    	React.findDOMNode(this.refs.start_date).value = '';
    	React.findDOMNode(this.refs.start_time).value = '';
    	React.findDOMNode(this.refs.end_date).value = '';
    	React.findDOMNode(this.refs.end_time).value = '';
    	React.findDOMNode(this.refs.contact).value = '';
    	React.findDOMNode(this.refs.price).value = '';

    	this.setState({
    		errorTitle : '',
			errorOrganizer: '',
			errorCategory: '',
			errorVenue: '',
			errorDescription: '',
			errorContact: '',
			errorPrice: '',
			errorStartDate: '',
			errorStartTime: '',
			errorEndDate: '',
			errorEndTime: ''
    	});

    	$('#modal-newevent').closeModal();
	},

	verifyDate: function() {

		var startDate  		= React.findDOMNode(this.refs.start_date).value.trim();
    	var startTime 		= React.findDOMNode(this.refs.start_time).value.trim();
    	var endDate 		= React.findDOMNode(this.refs.end_date).value.trim();
    	var endTime         = React.findDOMNode(this.refs.end_time).value.trim();

    	if(startDate && startTime) {
    		var startDateTime = startDate.trim() + " " + startTime.trim();
			var startD = new Date(startDateTime).getTime();
			var today = new Date().getTime();

			console.log(startD + " " + today);

			if(startD < today) {
				this.setState({errorStartDate: "Start Date < Today"});
			} else {
				this.setState({errorStartDate: ""});
			}
    	}

    	if(endDate && endTime) {
    		var endDateTime   = endDate.trim() + " " + endTime.trim();
    		var endD = new Date(endDateTime).getTime();
    		var today = new Date().getTime();

			if(endD < today) {
				this.setState({errorEndDate: "End Date < Today"});
			} else {
				this.setState({errorEndDate: ""});
			}
    	}

		// compare date
    	var startDateTime = startDate.trim() + " " + "00:00:00";
    	var endDateTime   = endDate.trim() + " " + "00:00:00";

    	var startD = new Date(startDateTime).getTime();
    	var endD = new Date(endDateTime).getTime();

    	if(startD > endD) {
    		this.setState({errorEndDate: "End Date < Start Date"});
	    } else {
	    	this.setState({errorEndDate: ""});
	    	
	    	if(startD == endD) {
	    		if(!startTime || !endTime)
	    			return;

	    		var startDateTime = startDate.trim() + " " + startTime.trim();
    			var endDateTime   = endDate.trim() + " " + endTime.trim();

    			var startD = new Date(startDateTime).getTime();
    			var endD = new Date(endDateTime).getTime();

    			if(startD > endD) 
    				this.setState({errorEndTime: "End Time < Start Time"});
    			else 
    				this.setState({errorEndTime: ""});
	    	}
	    }
	},
	
	handleSubmit: function(e) {
		e.preventDefault();
  		
  		var title 			= React.findDOMNode(this.refs.title).value.trim();
    	var organizer 		= React.findDOMNode(this.refs.organizer).value.trim();
    	var startDate  		= React.findDOMNode(this.refs.start_date).value.trim();
    	var startTime 		= React.findDOMNode(this.refs.start_time).value.trim();
    	var endDate 		= React.findDOMNode(this.refs.end_date).value.trim();
    	var endTime         = React.findDOMNode(this.refs.end_time).value.trim();
    	var description 	= React.findDOMNode(this.refs.description).value.trim();
    	var venue  			= React.findDOMNode(this.refs.venue).value.trim();
    	var contact 		=   React.findDOMNode(this.refs.contact).value.trim();
    	var price 			= React.findDOMNode(this.refs.price).value.trim();

    	var isError = false;

    	if(!title) {
    		this.setState({errorTitle: "Title field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorTitle: ""});
    	}

    	if(!organizer) {
    		this.setState({errorOrganizer: "Organizer field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorOrganizer: ""});
    	}

    	if(!React.findDOMNode(this.refs.category).value) {
    		this.setState({errorCategory: "Category field is not picked"});
    		isError = true;
    	} else {
    		this.setState({errorCategory: ""});
    	}

    	if(!description) {
    		this.setState({errorDescription: "Description field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorDescription: ""});
    	}

    	if(!venue) {
    		this.setState({errorVenue: "Venue field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorVenue: ""});
    	}

    	if(!contact) {
    		this.setState({errorContact: "Contact field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorContact: ""});
    	}

    	if(!price) {
    		this.setState({errorPrice: "Price field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorPrice: ""});
    	}


    	if(!startDate) {
    		this.setState({errorStartDate: "Start Date field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorStartDate: ""});
    	}

    	if(!startTime) {
    		this.setState({errorStartTime: "Start Time field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorStartTime: ""});
    	}

    	if(!endDate) {
    		this.setState({errorEndDate: "End Date field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorEndDate: ""});
    	}

    	if(!endTime) {
    		this.setState({errorEndTime: "End Time field is empty"});
    		isError = true;
    	} else {
    		this.setState({errorEndTime: ""});
    	}

    	this.verifyDate();

    	if(isError)
    		return;

    	var category = CATEGORY_ARRAY[React.findDOMNode(this.refs.category).value];
    	var startDateTime 	= startDate.replace(",", "") + ", " + startTime;
    	var endDateTime 	= endDate.replace(",", "") + ", " + endTime;

    	var post = {
  			"Title": title,
  			"Organizer": organizer,
  			"Description": description,
  			"Category": category,
  			"Venue": venue,
  			"Start_DateAndTime": startDateTime,
  			"End_DateAndTime": endDateTime,
  			"Contact": contact,
  			"Price": price
		};

		console.log(post);

  		$.ajax({
        	url: this.props.urlPost,
        	dataType: 'json',
        	type: 'POST',
        	data: {
        		"cmd": "createnewevent",
        		"event": JSON.stringify(post)
        	},
        	success: function(data) {
        		console.log("success post" + post);
        		alert("Your event has been submitted to NUSHapz for approval. Thank you!");
        	}.bind(this),
        	error: function(xhr, status, err) {
          		console.error(this.props.urlPost, status, err.toString());
        	}.bind(this)
      	});

      	React.findDOMNode(this.refs.title).value = '';
    	React.findDOMNode(this.refs.organizer).value = '';
    	React.findDOMNode(this.refs.category).value = '';
    	React.findDOMNode(this.refs.description).value = '';
    	React.findDOMNode(this.refs.start_date).value = '';
    	React.findDOMNode(this.refs.venue).value = '';
    	React.findDOMNode(this.refs.start_time).value = '';
    	React.findDOMNode(this.refs.end_date).value = '';
    	React.findDOMNode(this.refs.end_time).value = '';
    	React.findDOMNode(this.refs.contact).value = '';
    	React.findDOMNode(this.refs.price).value = '';

    	$('#modal-newevent').closeModal();
  
	},
	componentDidMount: function() {
		$('.modal-trigger').leanModal();
		$('.datepicker').pickadate({
   			selectMonths: true, // Creates a dropdown to control month
    		selectYears: 3 // Creates a dropdown of 15 years to control year
  		});

  		$('select').material_select();
	},
	
	render: function() {
		
		var redStyle = {
			color: 'red',
			fontSize: '14px'
		};
		
		var marginRightStyle = {
			marginRight: '10px'
		};

		var none = {
			display: 'none'
		};

		var title = {
			fontWeight: '700'
		};

		return (
			<div>
				<div id="modal-newevent" className="modal modal-fixed-footer">
		    		<div className="modal-content">
		      			<div className="row">
		      				<div className="col s10">
		      					<h4>Create an Event</h4>
		      				</div>
		      				<div className="col s2" style={title}>
		      					<i className="mdi-navigation-close modal-close right closeSign" onClick={this.handleClick}></i>
		      				</div>
		      			</div>
		      			<p>NUSHapz syncs events from IVLE and NUS Calendar of Events. Events created through NUSHapz will not be reflected on other portals, and will appear only on NUSHapz. Creating an event on NUSHapz will be faster compared to creating in IVLE due to the shorter approval times.</p>


		  				<div className="row">
		    				<form className="col s12" onSubmit={this.handleSubmit}>
		      					<div className="row">
		        					<div className="input-field col m6 s12">
		          						<i className="mdi-action-announcement prefix"></i>
		          						<input id="event_title" type="text" className="validate" ref="title"/>
		          						<label htmlFor="event_title">Title</label>
		          						<i style={redStyle} className="errorText">{this.state.errorTitle}</i>
		        					</div>
		        					<div className="input-field col m6 s12">
								        <i className="mdi-action-account-balance prefix"></i>
								        <input id="organisation" type="text" className="validate" ref="organizer" />
								        <label htmlFor="organisation">Organisation</label>
								        <i style={redStyle} className="errorText">{this.state.errorOrganizer}</i>
		        					</div>
		      					</div>

							    <div className="row">
							        <div className="input-field col s12">
										<i className="mdi-action-subject prefix"></i>
										<textarea id="description" className="materialize-textarea" ref="description"></textarea>
										<label htmlFor="description">Description</label>
										<i style={redStyle} className="errorText">{this.state.errorDescription}</i>
							        </div>
							    </div>

		      					<div className="row">
		        					<div className="input-field col m6 s12">
		          						<i className="mdi-maps-place prefix"></i>
		          						<input id="event_venue" type="text" className="validate" ref="venue" />
		          						<label htmlFor="event_venue">Venue</label>
		          						<i style={redStyle} className="errorText">{this.state.errorVenue}</i>
		        					</div>

		        					<div className="input-field col m1 s2">
	        						    <i className="mdi-action-view-agenda prefix"></i>
	        							<label htmlFor="category"> </label>
	        						</div>

		        					<div className="input-field col m5 s10">
									    <select className="browser-default" ref="category">
											<option value="" disabled selected>Category</option>
											<option value="0">Arts</option>
											<option value="1">Competitions</option>
											<option value="2">Conferences</option>
											<option value="3">Fairs</option>
											<option value="4">Recreation</option>
											<option value="5">Recruitment</option>
											<option value="6">Social</option>
											<option value="7">Volunteering</option>
											<option value="8">Wellness</option>
											<option value="9">Workshops</option>
											<option value="10">Others</option>
									    </select>
									    <i style={redStyle}>{this.state.errorCategory}</i>
		        					</div>

		      					</div>

		      					<div className="row">
		      						<div className="input-field col m6 s12">
		          						<i className="mdi-notification-event-note prefix"></i>  						
		          						<input id="event_startdate" type="date" className="datepicker" ref="start_date" onChange={this.verifyDate} />
		          						<label className="active" htmlFor="event_startdate">Start Date</label>
		          						<i style={redStyle} className="errorText">{this.state.errorStartDate}</i>
		          					</div>

		          					<div className="input-field col m3 s6">
		          						<i className="mdi-device-access-time prefix"></i>
		          						<label htmlFor="event_starttime">Start Time</label>
		        					</div>
		        					<div className="input-field col m3 s6">
		        						<input id="event_starttime" type="time" className="validate" ref="start_time" onChange={this.verifyDate} />
		          					</div>	

		          					<i style={redStyle} className="errorTime">{this.state.errorStartTime}</i>
		      					</div>

		      					<div className="row">
		      						<div className="input-field col m6 s12">
		          						<i className="mdi-notification-event-note prefix"></i>  						
		          						<input id="event_enddate" type="date" className="datepicker" ref="end_date" onChange={this.verifyDate} />
		          						<label className="active" htmlFor="event_enddate">End Date</label>
		          						<i style={redStyle} className="errorText">{this.state.errorEndDate}</i>
		          					</div>

		        					<div className="input-field col m3 s6">
		          						<i className="mdi-device-access-time prefix"></i>
		          						<label htmlFor="event_endtime">End Time</label>
		        					</div>
		        					<div className="input-field col m3 s6">
		        						<input id="event_endtime" type="time" className="validate" ref="end_time" onChange={this.verifyDate} />
		        					</div>

		          					<i style={redStyle} className="errorTime">{this.state.errorEndTime}</i>
		      					</div>

		      					<div className="row">
		        					<div className="input-field col m6 s12">
		          						<i className="mdi-maps-local-atm prefix"></i>
								        <input id="event_price" type="number" className="validate" ref="price"/>
								        <label htmlFor="event_price">Price</label>
								        <i style={redStyle} className="errorText">{this.state.errorPrice}</i>
		        					</div>

							        <div className="input-field col m6 s12">
							          	<i className="mdi-content-mail prefix"></i>
							          	<input id="email" type="email" className="validate" ref="contact" />
							          	<label htmlFor="email">Email</label>
							          	<i style={redStyle} className="errorText">{this.state.errorContact}</i>
							        </div>
							    </div>

							    <p className="disclaimer">* Events submitted will not be displayed immediately as they have to be approved by our NUSHapz admins first. The approval time takes between 2-3 working days.</p>

							    <div className="button-container">

							      	<button className="modal-action btn orange lighten-2 waves-effect waves-light right" style={marginRightStyle} value="Post">
							      		Submit
							      		<i className="mdi-content-send right"></i>
							      	</button>
							    </div>

		    				</form>
		  				</div>    
		    		</div>  
				</div>
				<div className='toast' style={none} id="toast">Your event has been submitted for approval. Thank you</div>
			</div>
		);
	}
});

MainContainer = React.createClass({
	render: function() {
		return (
			<div className="container-fluid" id="main-container">
				<Timeline data={this.props.data} />
			</div>
		);
	}
});

Timeline = React.createClass({
	render: function() {
		return (
			<div className="row">
				<div className="col l10 m9 s12 section cards search-timeline">
					<div className="col l10 m9 s12 offset-l2">
						<Event data={this.props.data} />
					</div>
				</div>
				<div className="col l2 m3 hide-on-small-only"></div>
			</div>
		);
	}
});

Event = React.createClass({
	componentDidMount: function() {
	    $('.collapsible').collapsible({
	    	accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	    });
	},

	render: function() {

		var bgColorIndex = 0;
		var eventCategory = this.props.data[CATEGORY];
		for(i=0; i<CATEGORY_ARRAY.length; i++)
			if(eventCategory == CATEGORY_ARRAY[i]) {
				bgColorIndex = i;
				break;
			}
		
		return (
			<div className="container single-card z-depth-1 white" data-collapsible="accordion">
				<li>
					<div className="row" id={this.props.data[EVENT_ID]} >
						<EventFavourite data={this.props.data} color={CATEGORY_BG_COLORS[bgColorIndex]} />
						<div className="card-content">
							<EventDate datetime={this.props.data[DATETIME]}/>
							<EventCategory category={this.props.data[CATEGORY]} color={CATEGORY_BG_COLORS[bgColorIndex]}/>
							<EventTitle title={this.props.data[TITLE]} />
							<EventLocation location={this.props.data[VENUE]} />
						</div>
					</div>
					<div className="row">
						<EventDescription description={this.props.data[DESCRIPTION]} />
						<EventContact contact={this.props.data[CONTACT]} />
						<EventSocialMedia cardID = {this.props.data[EVENT_ID]} />
					</div>
				</li>
			</div>

		);
	}
});

EventFavourite = React.createClass({
	getInitialState: function() {
		return {liked : false};
	},
	handleClick: function(e) {
		this.setState({liked: !this.state.liked});
	},
	render: function() {
		var c = this.state.liked ?
		" yellow-text lighten-4" : " white-text" ;
		return (
			<div className={"card-left-column " + this.props.color + " lighten-2"}>
			</div>
		);
	}
});

EventDate = React.createClass({
	render: function() {
		var tokens = this.props.datetime.split(" ", 5);
		var begin_date = tokens[0].concat(" ",tokens[1]," ",tokens[2]," ",tokens[3]," ",tokens[4]);
		return (
			<div className="card-date">
				{begin_date} 
			</div>
		);
	}
});

EventCategory = React.createClass({
	render: function() {
		return (
			<div className={"card-category " + this.props.color + "-text " + "darken-2"}>
				{this.props.category} 
			</div>
		);
	}
});


EventTitle = React.createClass({
	render: function() {
		return (
			<div className="card-title">
				{this.props.title} 
			</div>
		);
	}
});

EventLocation = React.createClass({
	render: function() {
		return (
			<div className="card-venue">
				<i className="tiny mdi-action-room"></i><div className="venue-text">{this.props.location} </div>
			</div>
		);
	}
});

EventInformation = React.createClass({
	render: function() {
		return (
			<div className="col s10">
				<div className="information">
					<EventOrganizer organizer={this.props.organizer} />
					<EventDateTime date={this.props.date} />
					<EventVenue venue = {this.props.venue} />
				</div>
			</div>
		);
	}
});

EventOrganizer = React.createClass({
	render: function() {
		var organizer = isRealValue(this.props.organizer) ?
			this.props.organizer : NON_IDENTIFIED;
		return (
			<div className="organizer row">
				<div className="col s11"><div className="showicon"><i className="fa fa-user"></i></div>
				<div className="inline"><p className="organizer-title">{organizer}</p></div></div>
			</div>
		);
	}
});

EventDateTime = React.createClass({
	render: function() {
		return (
			<div className="datetime row">
				<div className="col s11"><div className="showicon"><i className="fa fa-clock-o"></i></div>
				<div className="inline">{this.props.date}</div></div>	
			</div>
		);
	}
});

EventVenue = React.createClass({
		
	render: function() {
		var venue = isRealValue(this.props.venue) ?
				this.props.venue : NON_IDENTIFIED;
		return (
			<div className="venue row">
				<div className="col s11"><div className="showicon"><i className="fa fa-map-marker"></i></div>
				<div className="inline"><p>{venue}</p></div></div>
			</div>
		);
	}
});

var converter = new Showdown.converter();

EventDescription = React.createClass({
	render: function() {
		
		var linkified = isRealValue(this.props.description) ?
			urlify(this.props.description.toString()) : "No information given";
		var rawMarkup = converter.makeHtml(linkified);

		return (
			<div className="description">
				<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
			</div>
		);
	}
});

EventContact = React.createClass({
	render: function() {
		var contact = isRealValue(this.props.contact) ?
				urlify(this.props.contact) : NON_IDENTIFIED;
		var rawMarkup = converter.makeHtml(contact);
		return (
			<div className="contact">
				<div className="row">
					<i className="icon-width organizer-icon mdi-social-person"></i>
					<span className="contact-text"> {this.props.organizer} </span>
				</div>
				<div className="row">
					<i className="icon-width contact-icon mdi-communication-email"></i>
					<span className="contact-text" dangerouslySetInnerHTML={{__html: rawMarkup}} />
				</div>
			</div>
		);
	}
});

EventSocialMedia = React.createClass({
	render: function() {
		var url = SERVER_SHARE_SINGLE_EVENT + this.props.cardID;
		var twitterURL = "https://twitter.com/home?status=" + url;
		var facebookURL = "https://www.facebook.com/sharer/sharer.php?u=" + url;
		var googleURL = "https://plus.google.com/share?url=" + url;
		return (
			<div className="socialmed">
				<a href={twitterURL} title="Share on Twitter" target="_blank"  className="btn-floating waves-effect waves-light blue lighten-1 social-icons"><i className="fa fa-twitter"></i></a>
				<a href={facebookURL} target="_blank" className="btn-floating waves-effect waves-light indigo lighten-1 social-icons"><i className="fa fa-facebook"></i></a>
				<a href={googleURL} target="_blank" className="btn-floating waves-effect waves-light red lighten-1 social-icons"><i className="fa fa-google-plus"></i></a>
			</div>
		);
	}
});

React.render(
  	<Body url={SERVER_GET_SINGLE_EVENT} urlPost={SERVER_POST_EVENT}/>,
  	document.body
);