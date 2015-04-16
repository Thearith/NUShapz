<?php

require_once	'../db/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

date_default_timezone_set("UTC");

define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");

function test() {
	$date = "16 April 2015 00:03";
	var_dump(strtotime($date));
}

test();

?>