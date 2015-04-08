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
		echo test();
		// echo getEventsByTimelineSAMPLE();
		break;
	case "categories":
		echo getEventsByCategorySAMPLE($cat);
		break;
	case "muahahahaha":
		// echo test();
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
	default:
		break;
}

/*function postNew() {
	if(isset($_POST["eventTitle"])) {
		$eventTitle = $_POST["eventTitle"];
	}
	if(isset($_POST["eventCat"])) {
		$eventCat = $_POST["eventCat"];
	}
	if(isset($_POST["eventDes"])) {
		$eventDes = $_POST["eventDes"];
	}
	if(isset($_POST["eventEDT"])) {
		$eventEDT = $_POST["eventEDT"];
		$eventEDT = strtotime($eventEDT);
	}
	if(isset($_POST["eventOrg"])) {
		$eventOrg = $_POST["eventOrg"];
	}
	if(isset($_POST["eventVen"])) {
		$eventVen = $_POST["eventVen"];
	}
	if(isset($_POST["eventCont"])) {
		$eventCont = $_POST["eventCont"];
	}
	if(isset($_POST["eventPrice"])) {
		$eventPrice = $_POST["eventPrice"];
	}

	//@todo - randomise ID and Table??
	$table;
	$assigID;

	// ID - Title - Category - Description - EventDateTime - Organizer - Venue - Contact - Price - Flag
	//$query = "INSERT INTO $table VALUES ('$assigID', '$eventTitle', '$eventDes', '$eventCat',
	//		 '$eventVen', '$eventEDT', '$eventPrice', '$eventOrg', '$eventCont', '0') ";
	//$result = databaseQuery($query);
}
*/
// function updateNUSCOE() {
// 	updateEventDB("NUSCOEEVENTS");
// }

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
		case 4:
		case 5:
			$table = "HAPZEVENTS";
			break;
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
	return convertToOutputData($table);
	// Assume all fields can be updated
	$update_query = "UPDATE %s SET Title = '%s', Description = '%s', Category = '%s', Venue = '%s', DateAndTime = '%s', Price = '%s', Organizer = '%s', Contact = '%s', Agenda = '%s', Flag = %d WHERE ID = '%s'";
	
	$query = sprintf($update_query, $table, escapeChar($event->Title), escapeChar($event->Description), 
		escapeChar($event->Category), escapeChar($event->Venue), escapeChar($event->DateAndTime), 
		escapeChar($event->Price), escapeChar($event->Organizer), escapeChar($event->Contact),
		escapeChar($event->Agenda), escapeChar($event->Flag), $event->ID);


	$result = databaseQuery($query);

	// return convertToOutputData($result);
}

function getAllEvents() {
	$coeselection = "SELECT *";
	$coeevents = getEvents($coeselection, "NUSCOEEVENTS", null);

	$ivleselection = "SELECT *";
	$ivleevents = getEvents($ivleselection, "IVLEEVENTS", null);
	
	$returnThis = array_merge($coeevents, $ivleevents);
	return convertToOutputData($returnThis);
}

function getNewEvents() {
	$coeselection = "SELECT *";
	$clause = "Flag = 1";
	$coeevents = getEvents($coeselection, "NUSCOEEVENTS", $clause);

	$ivleselection = "SELECT *";
	$ivleevents = getEvents($ivleselection, "IVLEEVENTS", $clause);
	
	$returnThis = array_merge($coeevents, $ivleevents);
	return convertToOutputData($returnThis);
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
		$convertDate = date(DATEFORMAT, $returnThis[$key]['DateAndTime']);
		if ($convertDate !== false) {
			$returnThis[$key]['DateAndTime'] = $convertDate;
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

function test() {
	$query = "SELECT * FROM NUSCOEEVENTS ORDER BY DateAndTime ASC , Category ASC ";
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

	// Sort by date categories
	while($row = $result->fetch_assoc()) {
		$eventdate = $row['DateAndTime'];
		if ($eventdate >= $beginOfDay && $eventdate <= $endOfDay) {
			array_push($listOfEventsToday, $row);
		} else if ($eventdate >= $beginOfTomorrow && $eventdate <= $endOfTomorrow) {
			array_push($listOfEventsTomorrow, $row);
		} else if ($eventdate >= $beginOfDayAfterTomorrow && $eventdate <= $endOfThisWeek) {
			array_push($listOfEventsInAFewDays, $row);
		} else if ($eventdate >= $afterThisWeek){
			array_push($listOfEventsAfterAFewDays, $row);
		}
	}

	// More sorting by date and time
	usort($listOfEventsToday, "dateCompare");
	usort($listOfEventsTomorrow, "dateCompare");
	usort($listOfEventsInAFewDays, "dateCompare");
	usort($listOfEventsAfterAFewDays, "dateCompare");

	// Convert to normal time format
	foreach($listOfEventsToday as $key => $event) {
		$listOfEventsToday[$key]['DateAndTime'] = date(DATEFORMAT, $event['DateAndTime']);
	}
	foreach($listOfEventsTomorrow as $key => $event) {
		$listOfEventsTomorrow[$key]['DateAndTime'] = date(DATEFORMAT, $event['DateAndTime']);
	}
	foreach($listOfEventsInAFewDays as $key => $event) {
		$listOfEventsInAFewDays[$key]['DateAndTime'] = date(DATEFORMAT, $event['DateAndTime']);
	}
	foreach($listOfEventsAfterAFewDays as $key => $event) {
		$listOfEventsAfterAFewDays[$key]['DateAndTime'] = date(DATEFORMAT, $event['DateAndTime']);
	}

	$timeline = array(
			"Today" => array(),
			"Tomorrow" => array(),
			"InAFewDays" => array(),
			"AndMore" => array()
		);

	// Sort by Category
	$categoryList = array(
		"Education",
		"Recreation",
		"Recruitment",
		"Volunteering",
		"Misc");


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

	$data = array(
		"Response" => "Valid",
		"Timeline" => $timeline
	);
	$json = json_encode($data);
	echo $json;

	function dateCompare($a, $b) {
		return ($a['DateAndTime'] < $b['DateAndTime']) ? -1 : 1;
	}
}





function getEventsByCategorySAMPLE($cat) {
	switch($cat) {
		case "0":
			echo "hehe";
			break;
		case "1":
			echo "hoho";
			break;
		case "2":
			echo "haha";
			break;
		default:
			return getInvalidData();
	}
}

function getEventsByTimeline() {
	return "Not done";
}
function getEventsByCategory() {
	return "Not done";
}


?>