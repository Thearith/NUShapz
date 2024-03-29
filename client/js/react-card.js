/*
*	Using React.js
*
*/

// Server links
var SERVER_SHARE_SINGLE_EVENT = "http://hapz.nusmods.com/event/?id="; 
var SERVER_GET_EVENTS = "http://hapz.nusmods.com/api.php?cmd=timeline";
var SERVER_POST_EVENT = "http://hapz.nusmods.com/api.php";

//Timeline
var TIMELINE = "Timeline";
var TODAY_INDEX = 0;
var TOMORROW_INDEX = 1;
var FEW_DAYS_INDEX = 2;
var ONGOING_INDEX = 3;
var MORE_INDEX = 4;
var TIMELINE_ARRAY = ["Today", "Tomorrow", "InAFewDays", "Ongoing", "AndMore"];

//Category
var CATEGORY_ARRAY = ["Arts","Workshops","Conferences","Competitions","Fairs","Recreation","Wellness","Social","Volunteering","Recruitments","Others"];
var IMAGE_PATH = "../image/category/";
var CATEGORY_BG_COLORS =  ["red", "pink", "purple", "indigo", "blue", "light-blue", "teal", "green", "light-green", "brown", "deep-orange"];


// constants
var TITLE_MAXIMUM_LENGTH = 30;
var NON_IDENTIFIED = "-";
var NUM_EVENTS_ALLOWED = 5;

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

//Event source
var EVENT_SOURCE = ["IVLE", "HAPZ", "NUS CAL"];

var IVLE_SOURCE_INDEX = 0;
var HAPZ_SOURCE_INDEX = 1;
var NUS_CAL_SOURCE_INDEX = 2;

var IVLE_ID_LENGTH = 36;
var HAPZ_ID_LENGTH = 3;
var NUS_CAL_ID_LENGTH = 5;


// check null objects
function isRealValue(obj){
	return obj && obj !== "null" && obj!== "undefined" && obj !== "-";
}

function getDateJSON(date, isLeftSidebar, index) {
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
		if(isLeftSidebar) {
			if(index == MORE_INDEX) {
				return {
					"day" : PLUS,
					"weekday": MORE,
					"month" : ""
				};
			} else if(index == ONGOING_INDEX) {
				return {
					"day" : "~",
					"weekday" : "Ongoing" ,
					"month" : ""
				};
			}
		} else {
			if(index == MORE_INDEX) {
				return {
					"day": "\"More",
					"weekday": '',
					"month": "Events\""
				};
			} else if(index == ONGOING_INDEX) {
				return {
					"day" : "\"Ongoing",
					"weekday" : "" ,
					"month" : "Events\""
				};
			}
		}
	}
}

function getDate(index, isLeftSidebar) {
	var date = new Date();
	var json;

	switch(index) {
		case TODAY_INDEX:
			json = getDateJSON(date, isLeftSidebar, TODAY_INDEX);
			break;

		case TOMORROW_INDEX:
			var tmrDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
			json = getDateJSON(tmrDate, isLeftSidebar, TOMORROW_INDEX);
			break;

		case FEW_DAYS_INDEX:
			var fewDaysDate = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000);
			json = getDateJSON(fewDaysDate, isLeftSidebar, FEW_DAYS_INDEX);
			break;

		case ONGOING_INDEX:
			json = getDateJSON(null, isLeftSidebar, ONGOING_INDEX);
			break;

		case MORE_INDEX:
			json = getDateJSON(null, isLeftSidebar, MORE_INDEX);
			break;
	}

	return json;
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
		return {data: []};
	},
	componentDidMount: function() {
	    $.ajax({
			type: 'GET',
	     	url: this.props.url,
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
		return (
			<div>
				{ Object.keys(this.state.data).length != 0 ?  
					<App data={this.state.data[TIMELINE]} urlPost={this.props.urlPost}/> : 
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
	 getInitialState:function(){
        return{
            query:'',
            filteredData: this.props.data,
            isSearch: false,
            isSwitch: false
        }
    },

    componentDidMount: function() {
    	$('.collapsible').collapsible({
      		accordion : false 
    	});
    },

    componentDidUpdate: function() {
    	$('.collapsible').collapsible({
      		accordion : false 
    	});
    },

	doSearch:function(queryText){
        
		var queryResult = [];

		if(queryText === '') {
			this.setState({
	            query:'',
	            filteredData: this.props.data,
	            isSearch: false,
	            isSwitch: false,
	        });
			return;
		}
			

        for(i=0; i<TIMELINE_ARRAY.length; i++) {
	        
	        this.props.data[TIMELINE_ARRAY[i]].forEach(function(category){
	        	category[EVENTS].forEach(function(event) {
	        		if(event[TITLE].toLowerCase().indexOf(queryText.toLowerCase())!=-1 ||
	        		   event[ORGANIZER].toLowerCase().indexOf(queryText.toLowerCase()) != -1 ||
	        		   event[CATEGORY].toLowerCase().indexOf(queryText.toLowerCase()) != -1 ||
	        		   event[DESCRIPTION].toLowerCase().indexOf(queryText.toLowerCase()) != -1 ||
	        		   event[DATETIME].toLowerCase().indexOf(queryText.toLowerCase()) != -1) 
	        			queryResult.push(event);
	        	});
	        });
	    }
 
        this.setState({
            query:queryText,
            filteredData: queryResult,
            isSearch: true,
            isSwitch: false
        });
        
		console.log("searching------");
    },

    doSwitch: function(val) {

    	var queryResult = [];

    	if(val == false) {
    		this.setState({
    			query:'',
	            filteredData: this.props.data,
	            isSearch: false,
	            isSwitch: false,
    		});
    		return;

    	} else {
    		for(i=0; i<TIMELINE_ARRAY.length; i++) {
    			this.props.data[TIMELINE_ARRAY[i]].forEach(function(category){
		        	category[EVENTS].forEach(function(event) {
		        		for(j=0; j<localStorage.length; j++) {
		        			if(localStorage.key(j) === event[EVENT_ID])
		        				queryResult.push(event);
		        		}
		        	});
	        	});
    		}

    		this.setState({
	            query: '',
	            filteredData: queryResult,
	            isSearch: false,
	            isSwitch: true
        	});
    	}

    },

	render: function() {
		return (
			<div>
				<Navbar query={this.state.query} doSearch={this.doSearch} doSwitch={this.doSwitch} isSearch={this.state.isSearch}/>
				<div className="searchbar-mobile-offset hide-on-med-and-up"></div>
				<ModalForm urlPost={this.props.urlPost}/>
				<MainContainer data={this.state.filteredData} isSearch={this.state.isSearch} query={this.state.query} isSwitch={this.state.isSwitch} />
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
						<NewEvent data={this.props.data} doSwitch={this.props.doSwitch} isSearch={this.props.isSearch}/>
						<Search query={this.props.query} doSearch={this.props.doSearch} />
						<MobileNav data={this.props.data} />
					</div>
					<SearchMobile query={this.props.query} doSearch={this.props.doSearch} />
				</nav>
			</div>
		);
	}
});

Logo = React.createClass({
	render: function() {
		return (
			<a href="http://hapz.nusmods.com" className="brand-logo logo-align">
				<img src={"image/logo.png"} id="logo" />
			</a>
		);
	}
});

SearchMobile = React.createClass({
	doSearch:function(){
        var query=this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.doSearch(query);
    },
    componentDidMount: function() {
    	$('#search').on('keydown', this.handleKeyDown);
    },
    handleKeyDown: function(e) {
    	var ENTER = 13;
        if( e.keyCode == ENTER ) {
            e.preventDefault();
            return false;
        }
    },
	render:function() {
		return (
			<div className="searchbar-mobile input-field hide-on-med-and-up">
				<div className="searchbar-mobile-size"> 
					<div className="input-field">
						<input id="search" type="text" placeholder="Search for events" ref="searchInput" value={this.props.query} onChange={this.doSearch} />
						<label htmlFor="search">
							<i className="mdi-action-search search-icon"></i>
						</label>
					</div>
				</div>
			</div>
		);
	}
});

Search = React.createClass ({
	doSearch:function(){
        var query=this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.doSearch(query);
    },
    componentDidMount: function() {
    	$('#search').on('keydown', this.handleKeyDown);
    },
    handleKeyDown: function(e) {
    	var ENTER = 13;
        if( e.keyCode == ENTER ) {
            e.preventDefault();
            return false;
        }
    },
	render: function() {
		return (
			<form>
	        	<div className="input-field search-outer hide-on-small-only">    		
	          		<input id="search" type="text" placeholder="Search for events" ref="searchInput" value={this.props.query} onChange={this.doSearch} />
	          		<label htmlFor="search">
	          			<i className="mdi-action-search search-icon"></i>
	          		</label>
	        	</div>
	        </form>
		);
	}
});


NewEvent = React.createClass({
	render: function() {
		return (
			<ul id="nav-mobile" className="right hide-on-small-only">
				<li>
					<ToggleSwitch doSwitch={this.props.doSwitch} isSearch={this.props.isSearch}/>
				</li>
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

ToggleSwitch = React.createClass({
	doSwitch: function() {
		var switched = this.refs.switchInput.getDOMNode().checked;
		this.props.doSwitch(switched);
	},

	render: function() {
		return (
			<div className="switch">
			    <label>
			    	{ !this.props.isSearch ? 
						<input type="checkbox" ref="switchInput" onChange={this.doSwitch} /> :
						<input disabled type="checkbox" checked="false" ref="switchInput" onChange={this.doSwitch} />
					}
					<span className="lever">
					</span>
			    </label>
		  	</div>
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

    	if(isError)
    		return;

    	this.verifyDate();
    	

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
				{this.props.isSearch || this.props.isSwitch ?
					<SearchTimeline data={this.props.data} query={this.props.query} isSearch={this.props.isSearch} isSwitch={this.props.isSwitch} /> :
					<NoSearchTimeline data={this.props.data} />
				}
			</div>
		);
	}
});

SearchTimeline = React.createClass({

	render: function() {
		return (
			<div className="row">
				<div className="col l10 m9 s12 section cards search-timeline">
					<div className="col l10 m9 s12 offset-l2">
						{	this.props.data.length != 0 ?
							<EventSection events={this.props.data} isSearchTimeline={true}/> :
							<EmptyQuery query={this.props.query} isSearch={this.props.isSearch} isSwitch={this.props.isSwitch} />
						}
					</div>
				</div>
				<div className="col l2 m3 hide-on-small-only"></div>
			</div>
		);
	}
});

EmptyQuery = React.createClass({
	render: function() {
		return (
			<div>
				{ 	this.props.isSearch ?
					<EmptySearch query={this.props.query} /> :
					<EmptySwitch />
				}
			</div>
		);
	}
});

EmptySearch = React.createClass({

	render: function() {
		return (
			<div className="no-events">
				No Search Result for "{this.props.query}"
			</div>
		);
	}
});

EmptySwitch = React.createClass({
	render: function() {
		return (
			<div className="no-events">
				No Favorite Events
			</div>
		);
	}
});

NoSearchTimeline = React.createClass({

	render: function() {
		return (
			<div className="row">
				<Timeline data={this.props.data} />
				<Sidebar />
			</div>
		);
	}
});

Sidebar = React.createClass ({
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
			    			<div className="browse-date"><ul>Ongoing</ul></div>
			    		</a>

			    		<a className="date" href={"#section-5"}>
			    			<div className="browse-date"><ul>And more</ul></div>
			    		</a>

					</div>
				</div>
			</div>
		);
	}
});


Timeline = React.createClass({
	componentDidMount: function() {
		$('.scrollspy').scrollSpy();
	},
	render: function() {
		var style = {
			paddingTop: "2px",
			paddingLeft: "3px"
		}
		return (	
			<div className="col l10 m9 s12" id="content">

				<div className="row">
					<div className="col l2 hide-on-med-and-down"><div className="logoleft"></div></div>
					<div className="col l10 m12 s12">
						<div className="card small">
							<a href="https://www.facebook.com/NUSHappenings" target="_blank">
				            <div className="card-image">
				              <img src="image/bg.jpg"></img>
				              <div className="intro-msg">
				              <div className="intro-title">Discover</div>

				              <div className="intro-content">the latest happenings / events as a community.</div>
				              <div className="fb-iconsmall"><img src="image/facebook.png" style={style} /></div><div className="intro-likefb">Like NUSHapz on Facebook</div>

				              </div>
				            </div>
				            </a>
				        </div>
					</div>
				</div>

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
					<TimelineSection categories={this.props.data[TIMELINE_ARRAY[ONGOING_INDEX]]}
						index={3} />
				</div>

				<div className="section scrollspy" id="section-5">
					<TimelineSection categories={this.props.data[TIMELINE_ARRAY[MORE_INDEX]]} 
						index={4} />
				</div>
			</div>
		);
	}

});

// contains a timeline with leftsidebar and a lot of categorysections
TimelineSection = React.createClass({
	render: function() {
		return (
			<div className="row">
				<LeftSideBar index = {this.props.index} />
				<CategoriesContainer categories = {this.props.categories} index={this.props.index} />
			</div>
		);
	}
});


LeftSideBar = React.createClass({

	render: function() {
		var json = getDate(this.props.index, true);

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

CategoriesContainer = React.createClass({
	hasEvents: function(categories) {
		for(i in categories) {
			if(categories[i][EVENTS].length > 0)
				return true;
		}

		return false;
	},
	render: function() {
		return (
			<div>
				{ this.hasEvents(this.props.categories) ?
				  <CategorySections categories = {this.props.categories} /> :
				  <NoEvents index={this.props.index}/>
				}
			</div>
		);
	}
});

NoEvents = React.createClass({

	render: function() {
		var json = getDate(this.props.index, false);
		var date = json[DAY] + " " + json[MONTH];
		return (
			<div className="col l10 m12 s12 cards no-events">
				No Events on {date}
			</div>
		);
	}
});

//contains a lot of categories
CategorySections = React.createClass({

	getInitialState: function() {
		return {
			numEventsLimit : NUM_EVENTS_ALLOWED
		};
	},
	
	numberOfEvents : function(categories) {
		sum = 0;
		for(i in categories)
			sum += categories[i][EVENTS].length;

		return sum;
	},

	componentDidUpdate: function() {
		$('.collapsible').collapsible({
      		accordion : false 
    	});
	},

	hasMoreEvents: function(categories) {
		return this.numberOfEvents(categories) > this.state.numEventsLimit;
	},

	handleClick: function(e) {
		var numEventsLimit = this.state.numEventsLimit;
		numEventsLimit += NUM_EVENTS_ALLOWED;
		numberOfEvents = this.numberOfEvents(this.props.categories);
		numEventsLimit = numEventsLimit < numberOfEvents ?
					numEventsLimit : numberOfEvents;

		this.setState({
			numEventsLimit: numEventsLimit
		});
	},

	render: function() {
		
		numEvents = 0;
		prevNumEvents = 0;
		numLimit = this.state.numEventsLimit;
		
		var CategorySectionNode = this.props.categories.map(function(category, index) {
			numEvents += prevNumEvents;
			prevNumEvents = category[EVENTS].length; 
			return (
      			<EventSection events={category[EVENTS]} key={index} numEvents={numEvents} numEventsLimit={numLimit} isSearchTimeline={false} />
		    );
			
		});

		return (
			<div className="col l10 m12 s12 cards">
				{CategorySectionNode}
				{ this.hasMoreEvents(this.props.categories) ?
					<div className="brown lighten-1 waves-effect waves-light btn load-more" onClick={this.handleClick}><i className="mdi-action-autorenew"></i><div className="loadmore-text">Load More</div></div>:
					<div></div>
				}
			</div>
		);
	}
});

EventSection = React.createClass({

	render: function() {
		var num = this.props.numEvents;
		var limit = this.props.numEventsLimit;
		var isSearchTimeline = this.props.isSearchTimeline;
		var EventNode = this.props.events.map(function(data, index) {
			num++;
			if(num <= limit || isSearchTimeline)
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

var converter = new Showdown.converter();

Event = React.createClass({

	getInitialState: function() {
		var like = false;
		console.log(this.props.data[EVENT_ID]);
		if(localStorage.getItem(this.props.data[EVENT_ID]))
			like = true;

		return {liked: like};
	},

	doClick: function() {
		this.setState({liked: !this.state.liked});

		var eventID = this.props.data[EVENT_ID];
		if(localStorage.getItem(eventID)) {
			localStorage.removeItem(eventID);
		} else {
			localStorage.setItem(eventID, true);
		}
	},

	render: function() {

		var bgColorIndex = 0;
		var eventCategory = this.props.data[CATEGORY];
		for(i=0; i<CATEGORY_ARRAY.length; i++)
			if(eventCategory == CATEGORY_ARRAY[i]) {
				bgColorIndex = i;
				break;
			}

		var rawMarkup = converter.makeHtml(this.props.data[DESCRIPTION]);

		var blueBorder = this.state.liked ?
			" blue-border" : "";
		
		return (
			<div className={"collapsible" + blueBorder} data-collapsible="accordion">
				<li>
					<div className="collapsible-header" >
						<EventFavourite color={CATEGORY_BG_COLORS[bgColorIndex]} liked={this.state.liked} doClick={this.doClick}/>
						<div className="card-content">
							<EventDate datetime={this.props.data[DATETIME]}/>
							<EventCategory category={this.props.data[CATEGORY]} color={CATEGORY_BG_COLORS[bgColorIndex]}/>
							<EventTitle title={this.props.data[TITLE]} />
							<EventSynopsis description={this.props.data[DESCRIPTION]} />
							<EventFooter location={this.props.data[VENUE]} id={this.props.data[EVENT_ID]} />
						</div>
					</div>
					<div className="collapsible-body">
						<EventDescription description={this.props.data[DESCRIPTION]} />
						<div className="row contact-footer">
							<div className="col s9">
								<EventContact contact={this.props.data[CONTACT]} organizer={this.props.data[ORGANIZER]}/>
							</div>
							<div className="col s3">
								<EventSocialMedia cardID = {this.props.data[EVENT_ID]} 
								 title={this.props.data[TITLE]}
								 description={this.props.data[DESCRIPTION]}	/>
							</div>
						</div>
					</div>
				</li>
			</div>
		);
	}
});

EventFavourite = React.createClass({
	
	doClick: function(e) {
		this.props.doClick();
	},
	render: function() {
		var height = this.props.liked ?
			" card-left-column-favorited " : " ";
		var lighten = this.props.liked ?
			"lighten-1" : "lighten-2";
		return (
			<div className={"card-left-column " + this.props.color + height + lighten} onClick={this.doClick}>
				<i className="mdi-navigation-arrow-drop-up bookmark"></i>
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

EventSynopsis = React.createClass({
	render: function() {
		var removeHTML = this.props.description.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi,'').replace(/&#39;/gi,'').replace(/&ndash;/gi,''); 
		return (
			<div className="card-summary">
				{removeHTML}
			</div>
		);
	}
});

EventFooter = React.createClass({
	render: function() {
		return (
			<div className="card-venue">
				<EventSource id={this.props.id} />
				<EventLocation location={this.props.location} />
			</div>
		);
	}
});

EventLocation = React.createClass({
	render: function() {
		return (
			<div>
				<i className="tiny mdi-action-room"></i>
				<div className="venue-text">{this.props.location} </div>
			</div>
		);
	}
});

EventSource = React.createClass({
	render: function() {
		var source = EVENT_SOURCE[HAPZ_SOURCE_INDEX];
		var idLength = this.props.id.length;
		
		if(idLength == HAPZ_ID_LENGTH) {
			source = EVENT_SOURCE[HAPZ_SOURCE_INDEX];
		} else if(idLength == NUS_CAL_ID_LENGTH) {
			source = EVENT_SOURCE[NUS_CAL_SOURCE_INDEX]
		} else if(idLength == IVLE_ID_LENGTH) {
			source = EVENT_SOURCE[IVLE_SOURCE_INDEX];
		} else {
			console.log("ERROR WITH EVENT ID LENGTH");
		} 

		return (
			<div className="event-source-outer">
				<div className="event-source-styling">
					<div className="event-source-text">{source}</div>
				</div>
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
			<div>
				<div className="organizer">
					<i className="icon-width organizer-icon mdi-social-person"></i>
					<div className="organizer-text">{this.props.organizer}</div>
				</div>
				<div className="contact">
					<span className="contact-text" dangerouslySetInnerHTML={{__html: rawMarkup}} />
				</div>
			</div>
		);
	}
});

EventSocialMedia = React.createClass({
	render: function() {
		var url = SERVER_SHARE_SINGLE_EVENT + this.props.cardID;
		
		var twitterURL = "https://twitter.com/intent/tweet?text=" + this.props.title + "&url=" + url + "&hashtags=NUSHapz";
		var facebookURL = "https://www.facebook.com/dialog/feed?"
			+ "app_id=1609950215915876" 
			+ "&name=" + this.props.title
			+ "&description=" + this.props.description
			+ "&display=popup"
			+ "&caption=" + "Hosted on NUSHapz" 
			+ "&picture=http://hapz.nusmods.com/image/nice_logo.png"
			+ "&redirect_uri=http://hapz.nusmods.com"
			+ "&link=" + url;
		var googleURL = "https://plus.google.com/share?url=" + url;

		return (
			<div className="socialmed">
				<a href={twitterURL} title="Share on Twitter" target="_blank"  className="btn-floating waves-effect waves-light blue lighten-1 social-icons">
					<img src="image/twitter.png" className="responsive-img center-align socialbtn"/>
				</a>
				<a href={facebookURL} target="_blank" className="btn-floating waves-effect waves-light indigo lighten-1 social-icons">
					<img src="image/facebook.png" className="responsive-img center-align socialbtn"/>
				</a>
				<a href={googleURL} target="_blank" className="btn-floating waves-effect waves-light red lighten-1 social-icons">
					<img src="image/google-plus.png" className="responsive-img center-align socialbtn"/>
				</a>
			</div>
		);
	}
});

React.render(
	<Body url={SERVER_GET_EVENTS} urlPost={SERVER_POST_EVENT}/>,
	document.body
);