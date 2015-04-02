<?php

require_once	'../db/db.php';


if(isset($_GET["cmd"])) {
	$cmd = $_GET["cmd"];
}
if(isset($_GET["cat"])) {
	$cat = $_GET["cat"];
}

header('Content-Type: application/json');

switch($cmd) {
	case "timeline":
		echo getEventsByTimelineSAMPLE();
		break;
	case "categories":
		echo getEventsByCategorySAMPLE($cat);
		break;
	default:
		break;
}

function getInvalidData() {
	$invalid = file_get_contents("sample/sampleinvalid.json");
	return $invalid;
}

function getEventsByTimelineSAMPLE() {
	$sampletimeline = file_get_contents("sample/sampletimeline.json");
	return $sampletimeline;
}

function getEventsByCategorySAMPLE($cat) {
	switch($cat) {
		case "0":
			echo "hehe";
			break;
		case "1":
			echo "hoho";
			break;
		case "2":
			echo "haha";
			break;
		default:
			return getInvalidData();
	}
}

function getEventsByTimeline() {
	return "Not done";
}
function getEventsByCategory() {
	return "Not done";
}


?>