<?php

require_once	'db.php';

/**
  * Category Endpoint
  * Inputs: APIKey, AuthToken, IncludeEvents(bool) ,TitleOnly(bool)
  */
function getIVLEStudentEventByCategoryData() {
	$endpoint = "https://ivle.nus.edu.sg/api/Lapi.svc/StudentEvents_Categories?APIKey=%s&AuthToken=%s&IncludeEvents=%s&TitleOnly=%s";
	$req = sprintf($endpoint,IVLE_LAPI,IVLE_TOKEN,"true","false");
	$jsonData = file_get_contents($req);
	
	formatCategoryDataAndInsertIntoNewTable($jsonData);
}

/**
  * NOT IMPLEMENTED, FOR TESTING ONLY
  * All Events Endpoint
  * Inputs: APIKey, AuthToken, TitleOnly(bool)
  */
function getIVLEStudentEventData() {
	$endpoint = "https://ivle.nus.edu.sg/api/Lapi.svc/StudentEvents?APIKey=%s&AuthToken=%s&TitleOnly=%s";
	$req = sprintf($endpoint,IVLE_LAPI,IVLE_TOKEN,"false");
	$jsonData = file_get_contents($req);
	$data = json_decode($jsonData)->Results;
	echo "There are a total of ".count($data)." events\n";
}

/**
  * Insert data into NEW table
  */
function formatCategoryDataAndInsertIntoNewTable($jsonData) {
	$insert_query = "INSERT INTO IVLEEVENTS(ID, Title, Description, Category, DateAndTime, Organizer, Venue, Contact, Price, Agenda, Flag) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d') ON DUPLICATE KEY UPDATE ID=ID";

	$number_of_events = 0;
	$results = json_decode($jsonData)->Results;
	foreach($results as $category_of_events) {
		$cat_id = $category_of_events->ID;

		// Map Category
		$category = "Misc";
		switch($cat_id) {
			case 1: // Bashes
				$category = "Others";
				break;
			case 2: // Bazaars
				$category = "Fairs and Exhibitions";
				break;
			case 3: // Competitions/Tournament
				$category = "Competitions and Tournaments";
				break;
			case 4: // Sports And Recreation
				$category = "Sports and Recreation";
				break;
			case 5: // Performances
				$category = "Arts and Entertainment";
				break;
			case 6: // Announcements
				$category = "Others";
				break;
			case 7: // Excursions
				$category = "Courses and Workshops";
				break;
			case 8: // Exhibitions
				$category = "Fairs and Exhibitions";
				break;
			case 9: // Courses/Workshops
				$category = "Courses and Workshops";
				break;
			case 10: // Recruitment
				$category = "Recruitment";
				break;
			case 11: // Administration
				$category = "Others";
				break;
			case 12: // Charity
				$category = "Volunteering and Social";
				break;
			case 99: // Others
				$category = "Others";
		}

		$events = $category_of_events->Events;
		foreach($events as $event) {
			$title = escapeChar($event->Title);
			$description = escapeChar($event->Description);
			$edatetime = escapeChar($event->EventDateTime);
			$venue = escapeChar($event->Venue);
			$organizer = escapeChar($event->Organizer);
			$price = escapeChar($event->Price);
			$contact = escapeChar($event->Contact);
			$agenda = escapeChar($event->Agenda);
			$flag = 1;
			$query = sprintf($insert_query, $event->ID, $title, $description, $category, $edatetime, $organizer, $venue, $contact, $price, $agenda, $flag);

			databaseQuery($query);
			++$number_of_events;
		}
	}
	echo "Added ".$number_of_events." events\n";
}


getIVLEStudentEventByCategoryData();
// getIVLEStudentEventData();

?>