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
	if ($result = $db->query($query) !== TRUE) {
		echo "Error: " . $db->error;
	}
	$db->close();
	return $result;
}

/**
  * Creates IVLEEvents table
  */
function createIVLEEventsTable() {
	$create_new_events_table 
	= "CREATE TABLE IVLEEVENTS(
		ID VARCHAR(36) PRIMARY KEY,
		Title TEXT NOT NULL,
		CategoryID VARCHAR(5) NOT NULL REFERENCES CATEGORY(ID),
		Description TEXT,
		EventDateTime TEXT,
		Organizer TEXT,
		Venue TEXT,
		Contact TEXT,
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
		CategoryID VARCHAR(5) NOT NULL REFERENCES CATEGORY(ID),
		Description TEXT,
		EventDateTime TEXT,
		StartDate DATE,
		StartTime TIME,
		EndDate DATE,
		EventTime TIME,
		Organizer TEXT,
		Venue TEXT,
		Contact TEXT,
		Others TEXT )";

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
function createCategoryTable() {
	$category = array(
	"1" => "Bashes", "2" => "Bazaar", "3" => "Competition",
	"4" => "Sports", "5" => "Performance", "6" => "Announcement",
	"7" => "Excursion", "8" => "Exhibition", "9" => "Course",
	"10" => "Recruitment", "11" => "Administration", "12" => "Charity",
	"99" => "Other", 
	"A" => "Education", "B" => "Recreation", "C" => "Recruitment",
	"D" => "Volunteering", "E" => "Misc", "F" => "New");

	$create_event_category_table
		= "CREATE TABLE CATEGORY(
			ID VARCHAR(5) PRIMARY KEY,
			Type VARCHAR(20) NOT NULL)";

	$insert_event_category
		= "INSERT INTO CATEGORY (ID,Type) VALUES ('%s', '%s')";

	databaseQuery($create_event_category_table);
	foreach ($category as $id => $type) {
		$insert_query = sprintf($insert_event_category, $id, $type);
		databaseQuery($insert_query);
	}
}

/**
  * Creates NUSCOEEvents table
  */
function createNUSCOETable() {
	$create_event_nuscoe_table
		= "CREATE TABLE NUSCOEEVENTS(
			ID VARCHAR(36) PRIMARY KEY,
			Title TEXT,
			Description TEXT,
			Venue TEXT,
			EventDateTime TEXT)";

	databaseQuery($create_event_nuscoe_table);
}

/**
  * Called by initdb.php to initialise database
  */
function initialiseDatabase() {
	createCategoryTable();
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
	$table_list = array("IVLEEVENTS","HAPZEVENTS","NUSCOEEVENTS","CATEGORY");
	foreach($table_list as $table_name) {
		$query = sprintf($drop_table, $table_name);
		databaseQuery($query);
	}
}

/**
  * Helper function to escape special characters and deny invalid string entries
  */
function escapeChar($string) {
	if (strlen($string) > 2000) {
		return "";
	}
	$string = str_replace('\\', '\\\\', $string);
	$string = str_replace('"', '\"', $string);
	$string = str_replace("'", "\'", $string);
	return $string;
}

?>