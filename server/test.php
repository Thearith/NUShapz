<?php

require_once	'../db/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");

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



?>