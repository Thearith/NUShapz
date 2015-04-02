<?php

require_once	'db.php';

function getNUSCOEdata() {
	$nusCoeAPI = "https://myaces.nus.edu.sg/CoE/jsp/coeGenRss.jsp?Cat=%s";
	$categoryIndex = array(
		"All" => "0",
		"Arts and Entertainment" => "1",
		"Lectures and Workshops" => "2",
		"Conferences and Seminars" => "3",
		"Fairs and Exhibitions" => "4",
		"Sports and Recreation" => "5",
		"Health and Wellness" => "6",
		"Social Events" => "7",
		"Others" => "8");

	// GUID
	$strToRemoveForEventId = "nus:coe:";
	$strToRemoveForDescription = "Event Description: ";

	$insert_query = "INSERT INTO NUSCOEEVENTS(ID, Title, Description, Venue, EventDateTime) VALUES ('%s', '%s', '%s', '%s', '%s') ON DUPLICATE KEY UPDATE ID=ID";

	$num_of_events = 0;

	foreach($categoryIndex as $key => $value) {
		$api = sprintf($nusCoeAPI, $value);
		$res = file_get_contents($api);
		$xml = simplexml_load_string($res);

		foreach ($xml->channel->item as $item) {
			$id = escapeChar(str_replace($strToRemoveForEventId,"",(string)$item->guid));
	    	$title = escapeChar((string)$item->title);
	    	$description = escapeChar(str_replace($strToRemoveForDescription,"",(string)$item->description));
	    	$venue = escapeChar((string)$item->venue);
	    	$eventdatetime = escapeChar((string)$item->eventdate);
	    	$query = sprintf($insert_query, $id, $title, $description, $venue, $eventdatetime);
	    	databaseQuery($query);
	    	++$num_of_events;
		}
	}

	echo "Added: ".$num_of_events." events\n";

}



getNUSCOEdata();
?>