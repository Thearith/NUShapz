<?php

require_once	'../db/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json');

date_default_timezone_set("UTC");


define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");

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

		$eventarray = array();
		foreach($listOfEventsAfterAFewDays as $event) {
			if($event['Category'] == $cat) {
				array_push($catarray[Events], $event);
			}
		}
		// merge
		for($i=0; $i<count($catarray['Events']);++$i) {
			$added = false;
			for($j=$i+1; $j<count($catarray['Events']); ++$j) {
				if ($i != $j) {
					if ($catarray['Events'][$i]['Title'] == $catarray['Events'][$j]['Title']) {
						if(!$added) {
							$catarray['Events'][$i]['DateAndTime'] .= " (Recurring)";
							$catarray['Events'][$i]['Description'] .= "<br>".$catarray['Events'][$j]['DateAndTime'];
							$added = true;
						} else {
							$catarray['Events'][$i]['Description'] .= "<br>".$catarray['Events'][$j]['DateAndTime'];
						}
						array_splice($catarray['Events'], $j, 1);
						--$j;
					}
				}
			}
			$added = false;
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
echo getEventsByTimeline();

?>