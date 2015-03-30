<?php
require_once	'config.php';



function createNewEventTable($db) {
	$create_new_events_table 
	= "CREATE TABLE NEW(
		ID VARCHAR(36) PRIMARY KEY,
		Title TEXT NOT NULL,
		CategoryID VARCHAR(5) NOT NULL,
		Description TEXT,
		EventDateTime TEXT,
		Organizer TEXT,
		Venue TEXT,
		Contact TEXT )";

	if($db->query($create_new_events_table) !== TRUE) {
		echo "Error: Create New table failed - " . $db->error;
		$db->close();
		return false;
	}
	$db->close();
}

function createEventTable($db) {
	$create_events_table
	= "CREATE TABLE EVENTS(
		ID VARCHAR(36) PRIMARY KEY,
		Title TEXT NOT NULL,
		CategoryID VARCHAR(5) NOT NULL,
		Description TEXT,
		EventDate DATE,
		EventTime TIME,
		Organizer TEXT,
		Venue TEXT,
		Contact TEXT,
		Others TEXT )";

	if($db->query($create_events_table) !== TRUE) {
		echo "Error: Create Event table failed - " . $db->error;
		$db->close();
		return false;
	}
	$db->close();
}

/**
  * Categories
  * 1 Bashes, 2 Bazaar, 3 Competition, 4 Sports, 5 Performance
  * 6 Announcement, 7 Excursion, 8 Exhibition, 9 Course, 10 Recruitment
  * 11 Administration, 12 Chari, 99 Other
  * A Education, B Recreation, C Recruitment, D Volunteering, E Misc, F New
  * A: 8,9; B: 3,4,5,7; C: 10; D: 12; E: 1,2,6,11,99;
  */
function createCategoryTable($db) {
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

	if ($db->query($create_event_category_table) !== TRUE) {
		echo "Error: Create Category table failed - " . $db->error;
		$db->close();
		return false;
	}
	foreach ($category as $id => $type) {
		$insert_query = sprintf($insert_event_category, $id, $type);
		if ($db->query($insert_query) !== TRUE) {
			echo "Error: Insert into Category table failed - " . $db->error;
			$db->close();
			return false;
		}
	}
	$db->close();
}


function connectToDB() {
	$db = new mysqli(db_host, db_uid, db_password, db_name);
	if ($db->connect_errno)
		exit("Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error);
	return $db;
}

function initialiseDatabase() {
	createNewEventTable(connectToDB());
	createEventTable(connectToDB());
	createCategoryTable(connectToDB());
}

initialiseDatabase();


?>