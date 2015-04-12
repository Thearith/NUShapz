<?php

require_once	'../db/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");

function test() {
	$query = "(SELECT * FROM NUSCOEEVENTS2 WHERE Flag = 0) UNION (SELECT * FROM IVLEEVENTS WHERE Flag = 0) ORDER BY DateAndTime ASC , Category ASC ";
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

	$listOfUniqueEventTitle = array();


	// Sort by date categories
	while($row = $result->fetch_assoc()) {
		// Sort by date categories
		$eventdatajson = json_decode($row['DateAndTime']);
		$eventstartdate = $eventdatajson->Start;
		if ($eventstartdate >= $beginOfDay && $eventstartdate <= $endOfDay) {
			array_push($listOfEventsToday, $row);
		} else if ($eventstartdate >= $beginOfTomorrow && $eventstartdate <= $endOfTomorrow) {
			array_push($listOfEventsTomorrow, $row);
		} else if ($eventstartdate >= $beginOfDayAfterTomorrow && $eventstartdate <= $endOfThisWeek) {
			array_push($listOfEventsInAFewDays, $row);
		} else if ($eventstartdate >= $afterThisWeek){
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

	$timeline = array(
			"Today" => array(),
			"Tomorrow" => array(),
			"InAFewDays" => array(),
			"AndMore" => array()
		);

	// Sort by Category
	$categoryList = array(
		"Arts", "Workshops", "Conferences",
		"Competitions", "Fairs", "Recreation",
		"Wellness", "Social", "Volunteering",
		"Recruitments", "Others");


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

test();


?>