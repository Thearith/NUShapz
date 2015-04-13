<?php

require_once	'../db/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

header('Content-Type: application/json');

date_default_timezone_set("UTC");

define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");


if(isset($_GET["cmd"])) {
	$cmd = $_GET["cmd"];
}
if(isset($_POST["cmd"])) {
	$cmd = $_POST["cmd"];
}


switch($cmd) {
	case "timeline":
		echo getEventsByTimeline();
		break;
	case "categories":
		echo getEventsByCategorySAMPLE($cat);
		break;
	case "hapz":
		echo getHAPZ();
		break;
	case "nuscoe":
		echo getNUSCOE();
		break;
	case "ivle";
		echo getIVLE();
		break;
	case "new";
		echo getNewEvents();
		break;
	case "all";
		echo getAllEvents();
		break;
	case "adminlogin":
		echo dashboardLogin($_POST['login']);
		break;
	case "update":
		echo updateEventDB($_POST["event"]);
		break;
	case "post":	//create event for dashboard
		echo postNew($_POST["event"]);
		break;
	case "createnewevent": //create event for main page
		echo createNew($_POST["event"]);
		break;
	case "delete":
		echo deleteEvent($_POST["eventid"]);
		break;
	default:
		break;
}

function deleteEvent($eventid) {
	if(!isset($eventid)) {
		return invalidData();
	}
	$table;
	switch (strlen($eventid)) {
		case 1:
		case 2:
		case 3:
			$table = "HAPZEVENTS";
			break;
		case 4:
		case 5:
		case 6:
		case 7:
			$table = "NUSCOEEVENTS";
			break;
		case 36:
			$table = "IVLEEVENTS";
			break;
		default:
			return invalidData();
	}

	$query = "DELETE FROM %s WHERE ID = '%s'";
	$query = sprintf($query, $table, $eventid);
	$result = databaseQuery($query);
	return convertToOutputData($result);
}

function createNew($event) {
	if(!isset($event)) {
		return invalidData();
	}

	$event = json_decode($event);
	
	$table = "HAPZEVENTS";

	$id_query = "SELECT * FROM HAPZEVENTS ORDER BY ID DESC";
	$id_result = databaseQuery($id_query);
	$row = $id_result->fetch_assoc();
	$eventID;
	if($row) $eventID = $row['ID'] + 1;
	else $eventID = 100;

	// Convert time to unix timestamp
	$startDate = $event->Start_DateAndTime;
	$endDate = $event->End_DateAndTime;
	$date = array();
	$date['Start'] = strtotime($startDate);
	$date['End'] = strtotime($endDate);
	$dateAndTime = json_encode($date);

	//echo "$event";
	// ID - Title - Category - Description - DateAndTime - StartDate - StartTime - EndDate - EndTime - Price - Organizer - Venue - Contact - Flag(0)
	// ID - Title - Description - Category - Venue - DateAndTime - Price - Organizer - Contact - Agenda - Flag(0)
	$new_query = "INSERT INTO HAPZEVENTS (ID, Title, Description, Category, Venue, DateAndTime, Price, Organizer, Contact, Agenda, Flag) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')";
	$final_query = sprintf($new_query, $eventID, escapeChar($event->Title), escapeChar($event->Description), 
		escapeChar($event->Category), escapeChar($event->Venue), $dateAndTime, 
		escapeChar($event->Price), escapeChar($event->Organizer), escapeChar($event->Contact),
		"-", "1");
	$result = databaseQuery($final_query);

	return convertToOutputData($result);
}

function postNew($event) {
	if(!isset($event)) {
		return invalidData();
	}

	$event = json_decode($event);
	
	$table = "HAPZEVENTS";

	$id_query = "SELECT * FROM HAPZEVENTS ORDER BY ID DESC";
	$id_result = databaseQuery($id_query);
	$row = $id_result->fetch_assoc();
	$eventID;
	if($row) $eventID = $row['ID'] + 1;
	else $eventID = 100;

	// Convert time to unix timestamp if possible
	$dateAndTime = escapeChar($event->DateAndTime);
	$dates = explode(" - ", $dateAndTime);
	if (count($dates) > 0) {
		$dateArray = array();
		$dateArray['Start'] = strtotime($dates[0]); 
		$dateArray['End'] = strtotime($dates[1]); 
		$dateAndTime = json_encode($dateArray);
	}

	//echo "$event";
	// ID - Title - Category - Description - DateAndTime - StartDate - StartTime - EndDate - EndTime - Price - Organizer - Venue - Contact - Flag(0)
	// ID - Title - Description - Category - Venue - DateAndTime - Price - Organizer - Contact - Agenda - Flag(0)
	$new_query = "INSERT INTO HAPZEVENTS (ID, Title, Description, Category, Venue, DateAndTime, Price, Organizer, Contact, Agenda, Flag) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')";
	$final_query = sprintf($new_query, $eventID, escapeChar($event->Title), escapeChar($event->Description), 
		escapeChar($event->Category), escapeChar($event->Venue), $dateAndTime, 
		escapeChar($event->Price), escapeChar($event->Organizer), escapeChar($event->Contact),
		escapeChar($event->Agenda), $event->Flag);
	$result = databaseQuery($final_query);

	return convertToOutputData($result);
}


function dashboardLogin($login) {
	if(isset($login)) {
		$login = json_decode($login);
		if($login->id == 'root' && $login->pw == 'nushapzadmin') {
			session_start();
			$_SESSION['login'] = "hapzadmin";
			return convertToOutputData(array());
		}
	}
	return invalidData();
}

function updateEventDB($event) {
	if(!isset($event)) {
		return invalidData();
	}

	$event = json_decode($event);
	$table = "";
	switch (strlen($event->ID)) {
		case 1:
		case 2:
		case 3:
			$table = "HAPZEVENTS";
			break;
		case 4:
		case 5:
		case 6:
		case 7:
			$table = "NUSCOEEVENTS";
			break;
		case 36:
			$table = "IVLEEVENTS";
			break;
		default:
			return invalidData();
	}

	// Convert time to unix timestamp if possible
	$dateAndTime = escapeChar($event->DateAndTime);
	$dates = explode(" - ", $dateAndTime);
	if (count($dates) > 0) {
		$dateArray = array();
		$dateArray['Start'] = strtotime($dates[0]); 
		$dateArray['End'] = strtotime($dates[1]); 
		$dateAndTime = json_encode($dateArray);
	}

	// Assume all fields can be updated
	$update_query = "UPDATE %s SET Title = '%s', Description = '%s', Category = '%s', Venue = '%s', DateAndTime = '%s', Price = '%s', Organizer = '%s', Contact = '%s', Agenda = '%s', Flag = %s WHERE ID = '%s'";
	
	$query = sprintf($update_query, $table, escapeChar($event->Title), escapeChar($event->Description), 
		escapeChar($event->Category), escapeChar($event->Venue), $dateAndTime, 
		escapeChar($event->Price), escapeChar($event->Organizer), escapeChar($event->Contact),
		escapeChar($event->Agenda), $event->Flag, $event->ID);


	$result = databaseQuery($query);

	return convertToOutputData($result);
}

function getAllEvents() {
	$query = "(SELECT * FROM NUSCOEEVENTS) UNION (SELECT * FROM IVLEEVENTS) UNION (SELECT * FROM HAPZEVENTS) ";
	$result = databaseQuery($query);
	$returnThis = array();
	while($row = $result->fetch_assoc()) {
		array_push($returnThis, $row);
	}
	foreach ($returnThis as $key => $value) {
		$dateJSON = json_decode($returnThis[$key]['DateAndTime']);
		if($dateJSON != null) {
			$convertStartDate = date(DATEFORMAT, $dateJSON->Start);
			$convertEndDate = date(DATEFORMAT, $dateJSON->End);
			if ($convertStartDate !== false) {
				$returnThis[$key]['DateAndTime'] = $convertStartDate." - ".$convertEndDate;
			}
		}
	}
	return convertToOutputData($returnThis);
}

function getNewEvents() {
	$query = "(SELECT * FROM NUSCOEEVENTS WHERE Flag = 1) UNION (SELECT * FROM IVLEEVENTS WHERE Flag = 1) UNION (SELECT * FROM HAPZEVENTS WHERE Flag = 1) ";
	$result = databaseQuery($query);
	$returnThis = array();
	while($row = $result->fetch_assoc()) {
		array_push($returnThis, $row);
	}
	return convertToOutputData($returnThis);
}

function getHAPZ() {
	$selection = "SELECT *";
	return convertToOutputData(getEvents($selection, "HAPZEVENTS", null));
}

function getNUSCOE() {
	$selection = "SELECT *";
	return convertToOutputData(getEvents($selection, "NUSCOEEVENTS", null));
}

function getIVLE() {
	$selection = "SELECT *";
	return convertToOutputData(getEvents($selection, "IVLEEVENTS", null));
}

function getEvents($selection, $table, $clause) {
	$query = $selection." FROM ".$table;
	if($clause != null) {
		$query = $query." WHERE ".$clause;
	}
	$result = databaseQuery($query);

	$returnThis = array();
	while($row = $result->fetch_assoc()) {
		array_push($returnThis, $row);
	}

	foreach ($returnThis as $key => $value) {
		$dateJSON = json_decode($returnThis[$key]['DateAndTime']);
		if($dateJSON != null) {
			$convertStartDate = date(DATEFORMAT, $dateJSON->Start);
			$convertEndDate = date(DATEFORMAT, $dateJSON->End);
			if ($convertStartDate !== false) {
				$returnThis[$key]['DateAndTime'] = $convertStartDate." - ".$convertEndDate;
			}
		}
	}

	return $returnThis;
}

function convertToOutputData($events) {
	$data = array(
		"Response" => "Valid", 
		"Events" => $events
	);
	$json = json_encode($data);
	return $json;
}

function invalidData() {
	$data = array(
		"Response" => "Invalid"
	);
	$json = json_encode($data);
	return $json;
}

function getEventsByTimeline() {
	$query = "(SELECT * FROM NUSCOEEVENTS WHERE Flag = 0) UNION (SELECT * FROM IVLEEVENTS WHERE Flag = 0) UNION (SELECT * FROM HAPZEVENTS WHERE Flag = 0) ORDER BY DateAndTime ASC , Category ASC ";
	$result = databaseQuery($query);

	// TIMINGS
	$currentTime = time() + UTCtoGMT8;

	$beginOfDay = strtotime("midnight", $currentTime);
	$endOfDay = strtotime("tomorrow", $beginOfDay) - 1;

	$beginOfTomorrow = $endOfDay + 1;
	$endOfTomorrow = strtotime("tomorrow", $beginOfTomorrow) - 1;

	$beginOfDayAfterTomorrow = $endOfTomorrow + 1;
	$endOfThisWeek = strtotime("+7 days", $endOfDay);

	$afterThisWeek = $endOfThisWeek + 1;

	$listOfEventsToday = array();
	$listOfEventsTomorrow = array();
	$listOfEventsInAFewDays = array();
	$listOfEventsAfterAFewDays = array();
	$listOfEventsOngoing = array();

	// Sort by date categories
	while($row = $result->fetch_assoc()) {
		// Sort by date categories
		$eventdatajson = json_decode($row['DateAndTime']);
		$eventstartdate = $eventdatajson->Start;
		$eventenddate = $eventdatajson->End;
		// startdate today
		if ($eventstartdate >= $beginOfDay && $eventstartdate <= $endOfDay) {
			array_push($listOfEventsToday, $row);
		} 
		// startdate tomorrow
		else if ($eventstartdate >= $beginOfTomorrow && $eventstartdate <= $endOfTomorrow) {
			array_push($listOfEventsTomorrow, $row);
		}
		// startdate from day after tomorrow to end of the week
		else if ($eventstartdate >= $beginOfDayAfterTomorrow && $eventstartdate <= $endOfThisWeek) {
			array_push($listOfEventsInAFewDays, $row);
		}
		// startdate after end of the week
		else if ($eventstartdate >= $afterThisWeek){
			array_push($listOfEventsAfterAFewDays, $row);
		} 
		// ongoing
		else if ($eventstartdate < $beginOfDay && $eventenddate > $currentTime) {
			array_push($listOfEventsOngoing, $row);
		}
	}

	// More sorting by date and time
	usort($listOfEventsToday, "dateCompare");
	usort($listOfEventsTomorrow, "dateCompare");
	usort($listOfEventsInAFewDays, "dateCompare");
	usort($listOfEventsAfterAFewDays, "dateCompare");

	usort($listOfEventsOngoing, "titleCompare");

	// Convert to normal time format
	foreach($listOfEventsToday as $key => $event) {
		$datejson = json_decode($event['DateAndTime']);
		$listOfEventsToday[$key]['DateAndTime'] = date(DATEFORMAT, $datejson->Start)." - ".date(DATEFORMAT, $datejson->End);
	}
	foreach($listOfEventsTomorrow as $key => $event) {
		$datejson = json_decode($event['DateAndTime']);
		$listOfEventsTomorrow[$key]['DateAndTime'] = date(DATEFORMAT, $datejson->Start)." - ".date(DATEFORMAT, $datejson->End);
	}
	foreach($listOfEventsInAFewDays as $key => $event) {
		$datejson = json_decode($event['DateAndTime']);
		$listOfEventsInAFewDays[$key]['DateAndTime'] = date(DATEFORMAT, $datejson->Start)." - ".date(DATEFORMAT, $datejson->End);
	}
	foreach($listOfEventsAfterAFewDays as $key => $event) {
		$datejson = json_decode($event['DateAndTime']);
		$listOfEventsAfterAFewDays[$key]['DateAndTime'] = date(DATEFORMAT, $datejson->Start)." - ".date(DATEFORMAT, $datejson->End);
	}
	foreach($listOfEventsOngoing as $key => $event) {
		$datejson = json_decode($event['DateAndTime']);
		$listOfEventsOngoing[$key]['DateAndTime'] = date(DATEFORMAT, $datejson->Start)." - ".date(DATEFORMAT, $datejson->End);
	}

	$timeline = array(
			"Today" => array(),
			"Tomorrow" => array(),
			"InAFewDays" => array(),
			"AndMore" => array(),
			"Ongoing" => array()
		);

	// Sort by Category
	$categoryList = array(
		"Arts", "Workshops", "Conferences",
		"Competitions", "Fairs", "Recreation",
		"Wellness", "Social", "Volunteering",
		// "Recruitments", 
		"Others");

	// Sort Today by cat
	foreach($categoryList as $cat) {
		$catarray = array(
			'Category' => $cat,
			'Events' => array());

		foreach($listOfEventsToday as $event) {
			if($event['Category'] == $cat) {
				array_push($catarray[Events], $event);
			}
		}
		array_push($timeline["Today"],$catarray);
	}
	// Sort Tomorrow by cat
	foreach($categoryList as $cat) {
		$catarray = array(
			'Category' => $cat,
			'Events' => array());

		foreach($listOfEventsTomorrow as $event) {
			if($event['Category'] == $cat) {
				array_push($catarray[Events], $event);
			}
		}
		array_push($timeline["Tomorrow"],$catarray);
	}
	// Sort In a few days by cat
	foreach($categoryList as $cat) {
		$catarray = array(
			'Category' => $cat,
			'Events' => array());

		foreach($listOfEventsInAFewDays as $event) {
			if($event['Category'] == $cat) {
				array_push($catarray[Events], $event);
			}
		}
		array_push($timeline["InAFewDays"],$catarray);
	}
	// Sort And More by cat
	foreach($categoryList as $cat) {
		$catarray = array(
			'Category' => $cat,
			'Events' => array());

		foreach($listOfEventsAfterAFewDays as $event) {
			if($event['Category'] == $cat) {
				array_push($catarray[Events], $event);
			}
		}
		array_push($timeline["AndMore"],$catarray);
	}
	// Sort Ongoing by cat
	foreach($categoryList as $cat) {
		$catarray = array(
			'Category' => $cat,
			'Events' => array());

		foreach($listOfEventsOngoing as $event) {
			if($event['Category'] == $cat) {
				array_push($catarray[Events], $event);
			}
		}
		array_push($timeline["Ongoing"],$catarray);
	}

	$data = array(
		"Response" => "Valid",
		"Timeline" => $timeline
	);
	$json = json_encode($data);
	return $json;

	function dateCompare($a, $b) {
		return ($a['DateAndTime'] < $b['DateAndTime']) ? -1 : 1;
	}
	function titleCompare($a, $b) {
		return substr($a['Title'],0,1) < substr($b['Title'],0,1) ? -1 : 1;
	}
}


function getEventsByCategory() {
	return "Not done";
}


?>