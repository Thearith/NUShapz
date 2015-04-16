<?php

require_once	'config.php';

/**
  * Initiate connection to mysql db
  */
function connectToDB() {
	$db = new mysqli(db_host, db_uid, db_password, db_name);
	if ($db->connect_errno)
		exit("Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error);
	return $db;
}

/**
  * Query database and returns result
  */
function databaseQuery($query) {
	$db = connectToDB();
	$result = $db->query($query);

	if (is_object($result) && $result->num_rows >= 0) {
		return $result;
	}

	if ($result !== TRUE) {
		$result = "Error: " . $db->error . "\n";
		echo $result;
	}

	$db->close();
	return $result;
}

function insertToHapzTableWithSanitize($event) {
	$db = connectToDB();

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
	$date['Start'] = strtotime(str_replace(',', '', $startDate));
	$date['End'] = strtotime(str_replace(',', '', $endDate));
	$dateAndTime = json_encode($date);

	//echo "$event";
	// ID - Title - Category - Description - DateAndTime - StartDate - StartTime - EndDate - EndTime - Price - Organizer - Venue - Contact - Flag(0)
	// ID - Title - Description - Category - Venue - DateAndTime - Price - Organizer - Contact - Agenda - Flag(0)
	$new_query = "INSERT INTO HAPZEVENTS (ID, Title, Description, Category, Venue, DateAndTime, Price, Organizer, Contact, Agenda, Flag) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')";
	$final_query = sprintf($new_query, $eventID, $db->real_escape_string($event->Title), $db->real_escape_string($event->Description), 
		$db->real_escape_string($event->Category), $db->real_escape_string($event->Venue), $dateAndTime, 
		$db->real_escape_string($event->Price), $db->real_escape_string($event->Organizer), $db->real_escape_string($event->Contact),
		"-", "1");
	$result = databaseQuery($final_query);

	return $result;
}

/**
  * Creates IVLEEvents table
  */
function createIVLEEventsTable() {
	$create_new_events_table 
	= "CREATE TABLE IVLEEVENTS(
		ID VARCHAR(36) PRIMARY KEY,
		Title TEXT,
		Description TEXT,
		Category TEXT,
		Venue TEXT,
		DateAndTime TEXT,
		Price TEXT,
		Organizer TEXT,
		Contact TEXT,
		Agenda TEXT,
		Flag TINYINT(1) )";

	databaseQuery($create_new_events_table);
}

/**
  * Creates HapzEvents table
  */
function createHapzEventTable() {
	$create_events_table
	= "CREATE TABLE HAPZEVENTS(
		ID VARCHAR(36) PRIMARY KEY,
		Title TEXT NOT NULL,
		Category TEXT,
		Description TEXT,
		DateAndTime TEXT,
		StartDate TEXT,
		StartTime TEXT,
		EndDate TEXT,
		EventTime TEXT,
		Price TEXT,
		Organizer TEXT,
		Venue TEXT,
		Contact TEXT,
		Flag TINYINT(1) )";

	databaseQuery($create_events_table);
}

/**
  * Creates Category table
  * Categories:
  * 1 Bashes, 2 Bazaar, 3 Competition, 4 Sports, 5 Performance
  * 6 Announcement, 7 Excursion, 8 Exhibition, 9 Course, 10 Recruitment
  * 11 Administration, 12 Chari, 99 Other
  * A Education, B Recreation, C Recruitment, D Volunteering, E Misc, F New
  * Mappings - A: 8,9; B: 3,4,5,7; C: 10; D: 12; E: 1,2,6,11,99;
  */
// function createCategoryTable() {
// 	$category = array(
// 	"1" => "Bashes", "2" => "Bazaar", "3" => "Competition",
// 	"4" => "Sports", "5" => "Performance", "6" => "Announcement",
// 	"7" => "Excursion", "8" => "Exhibition", "9" => "Course",
// 	"10" => "Recruitment", "11" => "Administration", "12" => "Charity",
// 	"99" => "Other", 
// 	"A" => "Education", "B" => "Recreation", "C" => "Recruitment",
// 	"D" => "Volunteering", "E" => "Misc", "F" => "New");

// 	$create_event_category_table
// 		= "CREATE TABLE CATEGORY(
// 			ID VARCHAR(5) PRIMARY KEY,
// 			Type VARCHAR(20) NOT NULL)";

// 	$insert_event_category
// 		= "INSERT INTO CATEGORY (ID,Type) VALUES ('%s', '%s')";

// 	databaseQuery($create_event_category_table);
// 	foreach ($category as $id => $type) {
// 		$insert_query = sprintf($insert_event_category, $id, $type);
// 		databaseQuery($insert_query);
// 	}
// }

/**
  * Creates NUSCOEEvents table
  */
function createNUSCOETable() {
	$create_event_nuscoe_table
		= "CREATE TABLE NUSCOEEVENTS(
			ID VARCHAR(36) PRIMARY KEY,
			Title TEXT,
			Description TEXT,
			Category TEXT,
			Venue TEXT,
			DateAndTime TEXT,
			Price TEXT,
			Organizer TEXT,
			Contact TEXT,
			Agenda TEXT,
			Flag TINYINT(1) )";

	databaseQuery($create_event_nuscoe_table);
}

/**
  * Called by initdb.php to initialise database
  */
function initialiseDatabase() {
	// createCategoryTable();
	createHapzEventTable();
	createIVLEEventsTable();
	createNUSCOETable();
}

/**
  * Called by cleardb.php to clear database
  */
function clearDatabase() {
	$db = connectToDB();
	$drop_table = "DROP TABLE %s";
	$table_list = array("IVLEEVENTS","HAPZEVENTS","NUSCOEEVENTS");
	foreach($table_list as $table_name) {
		$query = sprintf($drop_table, $table_name);
		databaseQuery($query);
	}
}

/**
  * Helper function to escape special characters and deny invalid string entries
  */
function escapeChar($string) {
	if (strlen($string) > 2000 || strlen($string) == 0) {
		return "-";
	}
	$string = str_replace('\\', '\\\\', $string);
	$string = str_replace('"', '\"', $string);
	$string = str_replace("'", "\'", $string);
	return $string;
}

?>