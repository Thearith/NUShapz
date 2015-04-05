<?php

require_once	'../db/db.php';
date_default_timezone_set("UTC");
define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");

	// Test for NUS COE
	// use this format
	// echo 'Now: (GMT8):'.date('j F Y, g:i a',time()+UTCtoGMT8)."\r\n";

	// $testtime = strtotime("Wed, 22 Apr 2015 09:00:00 +0800");
	// echo 'Test: '.date('j F Y, g:i a',$testtime+UTCtoGMT8)."\n";


	// $testtime = strtotime("Wed, 22 Apr 2015 09:00:00");
	// echo 'Test: '.date('j F Y, g:i a',$testtime)."\n";


//TIME
// $currentTime = time() + UTCtoGMT8;

// $beginOfDay = strtotime("midnight", $currentTime);
// $endOfDay = strtotime("tomorrow", $beginOfDay) - 1;

// $beginOfTomorrow = $endOfDay + 1;
// $endOfTomorrow = strtotime("tomorrow", $beginOfTomorrow) - 1;

// $beginOfDayAfterTomorrow = $endOfTomorrow + 1;
// $endOfThisWeek = strtotime("+7 days", $endOfDay);

// $afterThisWeek = $endOfThisWeek + 1;

// echo "beginOfDay: ".$beginOfDay."\n";
// echo "endOfDay: ".$endOfDay."\n";
// echo "beginOfTomorrow: ".$beginOfTomorrow."\n";
// echo "endOfTomorrow: ".$endOfTomorrow."\n";
// echo "beginOfDayAfterTomorrow: ".$beginOfDayAfterTomorrow."\n";
// echo "endOfThisWeek: ".$endOfThisWeek."\n";
// echo "afterThisWeek: ".$afterThisWeek."\n";

function test() {
	$query = "SELECT ID, Title, Description, Category, Venue, EventDateTime AS DateAndTime, NULL AS Price, NULL AS Organizer, NULL AS Contact FROM NUSCOEEVENTS";
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
		} else {
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
}

function dateCompare($a, $b) {
	return ($a['DateAndTime'] < $b['DateAndTime']) ? -1 : 1;
}

test();


?>