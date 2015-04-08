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
	$insert_query = "INSERT INTO IVLEEVENTS(ID, Title, Description, Category, EventDateTime, Organizer, Venue, Contact, Price, Agenda, Flag) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d') ON DUPLICATE KEY UPDATE ID=ID";

	$number_of_events = 0;
	$results = json_decode($jsonData)->Results;
	foreach($results as $category_of_events) {
		$cat_title = $category_of_events->Title;
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
			$query = sprintf($insert_query, $event->ID, $title, $description, $cat_title, $edatetime, $organizer, $venue, $contact, $price, $agenda, $flag);

			databaseQuery($query);
			++$number_of_events;
		}
	}
	echo "Added ".$number_of_events." events\n";
}


getIVLEStudentEventByCategoryData();
// getIVLEStudentEventData();

?>