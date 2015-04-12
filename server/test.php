<?php

require_once	'../db/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");

function deleteEvent($eventid) {
	if(!isset($eventid)) {
		return invalidData();
	}
	if(!is_string($eventid) {
		$eventid = strval($eventid);
	}  
	$table;
	switch (strlen($eventid)) {
		case 1:
		case 2:
		case 3:
			$table = "HAPZEVENTS";
			break;
		case 4:
		case 5:
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

	$query = "DELETE FROM %s WHERE ID = '%s'";
	$query = sprintf($query, $table, $eventid);
	$result = databaseQuery($query);
	return convertToOutputData($result);
}
deleteEvent(103);


?>