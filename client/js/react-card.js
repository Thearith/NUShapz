// json
var events;

// virtual doms
var Timeline; //contains timeline sections
var TimelineSection; //contains categories within the same timeline section
var CategorySection; // contains events of the same category
var Event;
var EventTitle;
var EventBody;
var FavoriteImage;
var EventFooter;
var EventDateTime;
var	EventVenue;
var EventDescriptionText;
var EventContact;

var SERVER = "http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php?cmd=muahahahaha";
// outer
var DATA = "data";

//section
var TIMELINE = "Timeline";
var TIMELINE_INDEX = ["Today", "Tomorrow", "In a few days" "And more"];

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

/*
 * Create Event doms 
*/

//create title doms
createEventTitle();

// create body doms
createEventDateTime();
createEventVenue();
createEventDescriptionText();
createEventContact();
createEventDescription();

createEventBody();

//create Footer
createEventFooter();

//create Favorite Image
createFavoriteImage();

createEvent();

createCategorySection();

createTimelineSection();

createTimeline();

React.render(
  <Timeline url={SERVER} />,
  document.getElementById('content')
);


function createTimeline() {
	Timeline = React.createClass({
		getInitialState: function() {
    		return {data: []};
  		},
  		componentDidMount: function() {
		    $.ajax({
		     	url: this.props.url,
		      	dataType: 'json',
		      	success: function(data) {
		      		events = data;
		      		this.setState({data: data});
		      	}.bind(this),
		      	error: function(xhr, status, err) {
		        	console.error(this.props.url, status, err.toString());
		      	}.bind(this)
		    });
  		},

  		render: function() {
  			<div>
  				<TimelineSection data={this.state.data}/>
  			</div>
  		}

	});
}

function createTimelineSection() {
	TimelineSection = React.createClass({
		render: function() {
			var timeline
		}
	});
}

function createCategorySection() {

}
<div id="section-1" class="section">
	<div class="section-category row">
		<div class="col-md-2 left-sidebar">
			<h4>March 30th</h4>
			<img src="image/calendar.png" class="center img-responsive"/>
		</div>

		<div class="col-md-10 cards">
			<div class="card z-depth-2" id="1">
				<div class="row">
					<div class="col-md-10">
						<div class="card-title card-content">
							<div>
								<h1>Do You Believe In Love?</h1>
								<div class="organizer" >
									<i class="fa fa-university"></i>
									<p>NUS Centre For the Arts</p>
								</div>
							</div>
						</div>

						<div class="card-body card-content">

							<div class="category">
								<i class="fa fa-globe"></i>
								Social
							</div>

							<div class="datetime">
								<i class="fa fa-clock-o"></i>
								Mon, 30th March 1.30pm
									
							</div>

							<div class="venue">
								<i class="fa fa-map-marker"></i>
								<p>Ngee Ann Kongsi Auditorium</p>
							</div>

							<div class="description disappear" style="display:none;">
								<hr/>
								<img src="http://www.nus.edu.sg/cfa/NAF_2015/images/pg/film/film_doyoubelieveinlove_indiv.jpg" class="img-responsive clearfix center description-img" />

								<div class="description-text">
									<p>DO YOU BELIEVE IN LOVE? </p>
									
									<p>Thu 26 Mar | 7.30pm | Ngee Ann Kongsi Auditorium </p>

									<p>Free admission with registration.</p>
									<p>Register</p>


									<p>Dan Wasserman | Israel | 2013</p>
									<p>50 mins | Rating to be advised | Hebrew with English subtitles</p>

									<p>Even though Tova does not believe in love, she has had remarkable success as a matchmaker. Tova, who is paralyzed, specializes in finding matches for people with disabilities. Her tough-love approach leads to a unique matchmaking style but her passion for the work and clients is undeniable. Do You Believe in Love? follows Tova over the course of a year and invites us to join in on her pain, humour, love, and enormous lust for life.</p>

									<p>Commemorate International Women’s Day at the post-film panel discussion, “A Life Beyond Limits”, where we applaud women overcoming physical adversity.</p>


									<p>Awards:</p>
									<p>§  Silver Horn Award, Krakow International Film Festival 2014, Poland</p>
									<p>§  Special Mention Award, BOSIFEST 2014, Serbia</p>


									<p>For more information and updates, please visit nusartsfestival.com or follow us on Facebook!
									Enquiries are welcome at nusartsfestival@nus.edu.sg. </p>
								</div>

								<hr/>

								<div class="contact">

									<div>
										<i class="fa fa-envelope"></i>
										nusartsfestival@nus.edu.sg
									</div>
								</div>

							</div>
						</div>

					</div>
					<div class="col-md-2">	
						<div class="favorite">
							<img src="image/star.png" class="img-responsive center fav-img">
						</div>
					</div>
				</div>
				<hr/>

				<div class="card-footer card-content">
					<div class="social-media">
						<p>
							Share via
							<span class="social-media-btns">
								<a href="https://twitter.com/home?status=https://cp3101b.comp.nus.edu.sg/~sothearith/lab7/" title="Share on Twitter" target="_blank" class="btn btn-social btn-twitter text-center waves-effect waves-light">
									<i class="fa fa-twitter"></i>
									Twitter
								</a>
								<a href="https://www.facebook.com/sharer/sharer.php?u=https://cp3101b.comp.nus.edu.sg/~sothearith/lab7/" target="_blank" class="btn btn-social btn-facebook waves-effect waves-light">
									<i class="fa fa-facebook"></i>
									Facebook
								</a>
								<a href="https://plus.google.com/share?url=https://cp3101b.comp.nus.edu.sg/~sothearith/lab7/" target="_blank" class="btn btn-social btn-googleplus waves-effect waves-light">
									<i class="fa fa-google-plus"></i>
									Google+
								</a>
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div

function createEvent() {
	Event = React.createClass({
		render: function() {
			return (

				<div className="row">
					<div className="col-md-10">
						<EventTitle/>
						<EventBody />
					</div>

					<div className="col-md-2">
						<div className="favorite">
							<FavoriteImage />
						</div>
					</div>

				</div>

				<hr/>
				
				<EventFooter />

			);
		}

	});
}

function createEventTitle() {
	EventTitle = React.createClass({
		render: function() {
			return (
				<div className="card-title card-content">
					<h1>{data[TITLE]}</h1>
					<div className="organizer">
						<i className="fa fa-university"></i>
						<p>{data[ORGANIZER]}</p>
					</div>
				</div>
			);
		}
	});
}

function createEventBody() {
	EventBody = React.createClass({
		render: function() {
			return (
				<div className="card-body card-content">
					<EventDateTime />
					<EventVenue />
					<EventDescription />
				</div>
			);
		}
	});
}

function createEventDateTime() {
	EventDateTime = React.createClass({
		render: function() {
			<div className="datetime">
				<i className="fa fa-clock-o"></i>
				<p>{data[DATETIME]}</p>
			</div>
		}
	});
}

function createEventVenue() {
	EventVenue = React.createClass({
		render: function() {
			<div className="venue">
				<i className="fa fa-map-marker"></i>
				<p>{data[VENUE]}</p>
			</div>
		}
	});
}

function createEventDescription(){
	EventDescription = React.createClass({
		render: function() {
			var style = {
				display: 'none'
			};

			return (
				<div className="description" style={style}>
					<hr/>
					<EventDescriptionText />
					<hr/>
					<EventContact />
				</div>
			);
		}
	});
}

function createEventDescriptionText() {
	EventDescriptionText = React.createClass({
		render: function() {
			<div className="description-text">
				{data[DESCRIPTION_TEXT]}
			</div>
		}
	});
}

function createEventContact() {
	EventContact = React.createClass({
		return (
			<div className="contact">
				{data[CONTACT]}
			</div>
		);
	});
}

function createFavoriteImage() {
	var FavoriteImage = React.createClass({
		render: function() {
			var img_src = "image/star.png";
			return (
				<div className="favorite">
					<img src={img_src} className="img-responsive center fav-img">
				</div>
			);
		}
	});
}

function createEventFooter() {
	var EventFooter = React.createClass({
		render: function() {
			var EventPage = HOMEPAGE + "/" + EVENT_ID + "=" + data[EventID];
			var facebookLink = "https://www.facebook.com/sharer/sharer.php?u=" + EventPage;
			var twitterLink = "https://twitter.com/home?status=" + EventPage;
			var googleLink = "https://plus.google.com/share?url=" + EventPage;

			return (
				<div className="card-footer card-content">
					<div className="social-media">
						<p>
							Share via
							<span>
								<a href={twitterLink} title="Share on Twitter" target="_blank" className="btn btn-social btn-twitter text-center waves-effect waves-light">
									<i className="fa fa-twitter"></i>
									Twitter
								</a>
								<a href={facebookLink} target="_blank" className="btn btn-social btn-facebook waves-effect waves-light">
									<i className="fa fa-facebook"></i>
									Facebook
								</a>
								<a href={googleLink} target="_blank" className="btn btn-social btn-googleplus waves-effect waves-light">
									<i className="fa fa-google-plus"></i>
									Google+
								</a>
							</span>
						</p>
					</div>
				</div>
			);
		}
	});
}