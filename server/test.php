<?php

require_once	'../db/db.php';
date_default_timezone_set("UTC");
define("UTCtoGMT8", "28800");
define("DATEFORMAT", "j F Y, g:i a");

	// Test for NUS COE
	// use this format
	// echo 'Now: (GMT8):'.date('j F Y, g:i a',time()+UTCtoGMT8)."\r\n";

	// $testtime = strtotime("Wed, 22 Apr 2015 09:00:00 +0800");
	// echo 'Test: '.date('j F Y, g:i a',$testtime+UTCtoGMT8)."\n";


	// $testtime = strtotime("Wed, 22 Apr 2015 09:00:00");
	// echo 'Test: '.date('j F Y, g:i a',$testtime)."\n";


//TIME
// $currentTime = time() + UTCtoGMT8;

// $beginOfDay = strtotime("midnight", $currentTime);
// $endOfDay = strtotime("tomorrow", $beginOfDay) - 1;

// $beginOfTomorrow = $endOfDay + 1;
// $endOfTomorrow = strtotime("tomorrow", $beginOfTomorrow) - 1;

// $beginOfDayAfterTomorrow = $endOfTomorrow + 1;
// $endOfThisWeek = strtotime("+7 days", $endOfDay);

// $afterThisWeek = $endOfThisWeek + 1;

// echo "beginOfDay: ".$beginOfDay."\n";
// echo "endOfDay: ".$endOfDay."\n";
// echo "beginOfTomorrow: ".$beginOfTomorrow."\n";
// echo "endOfTomorrow: ".$endOfTomorrow."\n";
// echo "beginOfDayAfterTomorrow: ".$beginOfDayAfterTomorrow."\n";
// echo "endOfThisWeek: ".$endOfThisWeek."\n";
// echo "afterThisWeek: ".$afterThisWeek."\n";




?>