<?php

require_once	'db.php';
date_default_timezone_set("UTC");

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
	$gmtTimeToRemove = "+0800";

	$priceRegex = "/[$] ?[0-9]*[.][0-9]*[^A-Z(\\)]*/";

	$insert_query = "INSERT INTO NUSCOEEVENTS(ID, Title, Description, Category, Venue, DateAndTime, Price, Organizer, Contact, Agenda, Flag) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '-', '-', '-', 0) ON DUPLICATE KEY UPDATE ID=ID";

	$num_of_events = 0;

	foreach($categoryIndex as $key => $value) {
		if ($value == "0") {
			continue;	// Skip All Category
		}
		$api = sprintf($nusCoeAPI, $value);
		$res = file_get_contents($api);
		$xml = simplexml_load_string($res);

		// Map Category
		$category = "";
		switch($value) {
			case 1: // Arts and Entertainment
				$category = "Arts";
				break;
			case 2: // Lectures and Workshops
				$category = "Workshops";
				break;
			case 3: // Conferences and Seminars
				$category = "Conferences";
				break;
			case 4: // Fairs and Exhibitions
				$category = "Fairs";
				break;
			case 5: // Sports and Recreation
				$category = "Recreation";
				break;
			case 6: // Health and Wellness
				$category = "Wellness";
				break;
			case 7: // Social Events
				$category = "Social";
				break;
			case 8: // Others
				$category = "Others";
				break;
		}


		foreach ($xml->channel->item as $item) {
			$id = escapeChar(str_replace($strToRemoveForEventId,"",(string)$item->guid));
	    	$title = escapeChar((string)$item->title);
	    	$description = str_replace($gmtTimeToRemove,"",escapeChar(str_replace($strToRemoveForDescription,"",(string)$item->description)));
	    	$venue = escapeChar((string)$item->venue);
	    	

	    	// $eventdatetime = strtotime(str_replace($gmtTimeToRemove,"",escapeChar((string)$item->eventdate)));
	    	
	    	$eventdatetime = getDateAndTime($id);

	    	$price = '-';
    		if(preg_match($priceRegex, $description, $match) == 1) {
    			$price = $match[0];
	    	}
	    	$query = sprintf($insert_query, $id, $title, $description, $category, $venue, $eventdatetime, $price);
	    	databaseQuery($query);
	    	++$num_of_events;
		}
	}

	echo "Added: ".$num_of_events." events\n";
}

function getDateAndTime($id) {
	$nusCoeEventsAPI = "https://myaces.nus.edu.sg/CoE/COEMasterServlet?funId=SEARCHBYEVENTID&funParam=%s&fac=&queryText=&current_page=1&fromAction=null&fromParam=null";
	
	$dateRegex = "/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/";
	$timeRegex = "/[0-9]{2}:[0-9]{2} [A-Z]{2} - [0-9]{2}:[0-9]{2} [A-Z]{2}/";

	$api = sprintf($nusCoeEventsAPI, $id);
	$html = file_get_contents($api);

	$date = "";
	$startTime = "";
	$endTime = "";
	if(preg_match_all($dateRegex, $html, $match1) == 1) {
    	$date = str_replace('/','-',$match1[0][0]);
	}
	if(preg_match_all($timeRegex, $html, $match2) == 1) {
		$times = explode(" - ", $match2[0][0]);
    	$startTime = $times[0];
    	$endTime = $times[1];
	}
	
	$dateAndTime = array(
		"Start" => strtotime($date." ".$startTime),
		"End" => strtotime($date." ".$endTime)
		);
	
	return json_encode($dateAndTime);
}

// getDateAndTime("66562");
getNUSCOEdata();
?>