<?php

require_once	'../db/db.php';

header("Access-Control-Allow-Origin: *");

date_default_timezone_set("UTC");

define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");


if(isset($_GET["cmd"])) {
	$cmd = $_GET["cmd"];
}
if(isset($_GET["cat"])) {
	$cat = $_GET["cat"];
}

header('Content-Type: application/json');

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
	/*case "post":
		postNew();
		break; 
	case "update_nuscoe":
		updateNUSCOE();
		break;
	case "update_ivle":
		updateIVLE();
		break;*/
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

function updateNUSCOE() {
	updateEventDB("NUSCOEEVENTS");
}

function updateNUSCOE() {
	updateEventDB("IVLEEVENTS");
}

function updateEventDB($table) {

	//Field(s) that NEED updating are Category, EventDateTime
	$query = "UPDATE $table SET "; 		// " Category = $eventCat, EventDateTime = $eventEDT, WHERE ID = $eventID";
	if(isset($_POST["eventCat"])) {
		$eventCat = $_POST["eventCat"];
		$query = $query . " Category = $eventCat, ";
	}
	if(isset($_POST["eventEDT"])) {
		$eventEDT = $_POST["eventEDT"];
		$eventEDT = strtotime($eventEDT);
		$query = $query . " EventDateTime = $eventEDT, ";
	}

	$eventID = $_POST["eventID"];
	$query = $query . " SET Flag = 1, WHERE ID = $eventID";		//Set Flag = 1;
	//$result = databaseQuery($query);
}*/

function getNUSCOE() {
	getEvents("NUSCOEEVENTS");
}

function getIVLE() {
	getEvents("IVLEEVENTS");
}

function getEvents($table) {
	$query = "SELECT ID, Title, Description, Category, Venue, EventDateTime AS DateAndTime, Price, NULL AS Organizer, NULL AS Contact FROM $table";
	$result = databaseQuery($query);

	$returnThis = array();
	while($row = $result->fetch_assoc()) {
		array_push($returnThis, $row);
	}

	foreach ($returnThis as $key => $value) {
		$returnThis[$key]['DateAndTime'] = date(DATEFORMAT, $event['DateAndTime']);
	}

	$data = array(
		"Response" => "Valid", 
		"Events" => $returnThis
	);

	$json = json_encode($data);
	echo $json;
}

function getInvalidData() {
	$invalid = file_get_contents("sample/sampleinvalid.json");
	return $invalid;
}

function getEventsByTimelineSAMPLE() {
	$sampletimeline = file_get_contents("sample/sampletimeline.json");
	return $sampletimeline;
}

function test() {
	$query = "SELECT ID, Title, Description, Category, Venue, EventDateTime AS DateAndTime, Price, NULL AS Organizer, NULL AS Contact FROM NUSCOEEVENTS ORDER BY EventDateTime ASC , Category ASC ";
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


	// $timeline = array(
	// 		"Today" => $listOfEventsToday,
	// 		"Tomorrow" => $listOfEventsTomorrow,
	// 		"InAFewDays" => $listOfEventsInAFewDays,
	// 		"AndMore" => $listOfEventsAfterAFewDays
	// 	);

	// $data = array(
	// 	"Response" => "Valid",
	// 	"Timeline" => $timeline
	// );


	$timeline = array(
			"Today" => array(),
			"Tomorrow" => array(),
			"InAFewDays" => array(),
			"AndMore" => array()
		);

	// Sort by Category
	$categoryList = array(
		"Arts and Entertainment",
		"Lectures and Workshops",
		"Conferences and Seminars",
		"Fairs and Exhibitions",
		"Sports and Recreation",
		"Health and Wellness",
		"Social Events",
		"Others");


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