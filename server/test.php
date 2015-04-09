<?php

require_once	'../db/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


if(isset($_GET["cmd"])) {
	$cmd = $_GET["cmd"];
}
if(isset($_POST["cmd"])) {
	$cmd = $_POST["cmd"];
}


switch($cmd) {
	case "timeline":
		echo test();
		// echo getEventsByTimelineSAMPLE();
		break;
	case "categories":
		echo getEventsByCategorySAMPLE($cat);
		break;
	case "muahahahaha":
		// echo test();
		break; 
	case "nuscoe":
		echo getNUSCOE();
		break;
	case "ivle";
		echo getIVLE();
		break;
	case "new";
		echo getNewEvents();
		break;
	case "all";
		echo getAllEvents();
		break;
	case "adminlogin":
		echo dashboardLogin($_POST['login']);
		break;
	case "update":
		echo updateEventDB($_POST['event']);
		break;
	default:
		break;
}

function updateEventDB($event) {
	if(!isset($event)) {
		return invalidData();
	}

	$event = json_decode($event);

	$table = "";
	switch (strlen($event->ID)) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			$table = "HAPZEVENTS";
			break;
		case 6:
		case 7:
			$table = "NUSCOEEVENTS";
			break;
		case 36:
			$table = "IVLEEVENTS";
			break;
		default:
			return invalidData();
	}
	// Assume all fields can be updated
	$update_query = "UPDATE %s SET Title = '%s', Description = '%s', Category = '%s', Venue = '%s', DateAndTime = '%s', Price = '%s', Organizer = '%s', Contact = '%s', Agenda = '%s', Flag = %s WHERE ID = '%s'";
		
	$query = sprintf($update_query, $table, escapeChar($event->Title), escapeChar($event->Description), 
		escapeChar($event->Category), escapeChar($event->Venue), escapeChar($event->DateAndTime), 
		escapeChar($event->Price), escapeChar($event->Organizer), escapeChar($event->Contact),
		escapeChar($event->Agenda), escapeChar($event->Flag), $event->ID);


	$result = databaseQuery($query);

	return convertToOutputData($result);
}

function convertToOutputData($events) {
	$data = array(
		"Response" => "Valid", 
		"Events" => $events
	);
	$json = json_encode($data);
	return $json;
}

function invalidData() {
	$data = array(
		"Response" => "Invalid"
	);
	$json = json_encode($data);
	return $json;
}


?>