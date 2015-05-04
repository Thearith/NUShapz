// lab 7

// php session + post

$cmd = $_GET['cmd'];
$table_name = "PUZZLE";
$user = $_POST['user_id'];

if($user != "") {
	
	$password = $_POST['password'];
	$bool = verifyUser($user, $password);

	if($bool == true) {

		$query1 = "UPDATE " . $table_name . " SET BEST_MINIMUM_CLICKS = "
			 . $_SESSION['BEST_SCORE'] . " WHERE PUZZLE_ID = " . $_SESSION['ID'];
				$db->query($query1);

				$query2 = "UPDATE " . $table_name . " SET BEST_TIME = "
			 . $_SESSION['BEST_TIME'] . " WHERE PUZZLE_ID = " . $_SESSION['ID'];
				$db->query($query2);

			echo json_encode("0Congratulation!! This is the new best score " . $_SESSION['BEST_SCORE'] . " time " . $_SESSION['BEST_TIME']);
	} else {
		echo json_encode("1Either username or password is wrong. Please try again.");
	}

} else if($cmd == "puzzle") {

	$_SESSION['START_TIME'] = time();

	$index = intval($_GET['id']);
	
	if($index >= 0 && $index < count($puzzle)) {
		echo json_encode($puzzle[$index]);
	} else {
		echo "Index out of bounds";
	}

} else if($cmd == "solution") {

	$index = intval($_GET['id']);
	
	if($index >= 0 && $index < count($solution)) {
		echo json_encode($solution[$index]);
	} else {
		echo "Index out of bounds";	
	}

} else if($cmd == "best_score") {

	$index = intval($_GET['id']);
	
	if($index >= 0 && $index < count($solution)) {
		$best_score = getField($table_name, $index, 'BEST_MINIMUM_CLICKS');
		$best_time = getField($table_name, $index, 'BEST_TIME');
		echo json_encode("Best score is " . $best_score . ". Best time is " . $best_time . ".");
	} else {
		echo "Index out of bounds";	
	}

} else if($cmd == "what_is_n") {
	
	echo count($puzzle);

} else if($cmd == "check") {

	$index = intval($_GET['id']);
	$clicks = $_GET['clicks'];

	if($index < 0 || $index >= count($solution)) {
		exit("index out of bounds");
	}

	if(!$clicks) {
		exit("the clicks array is null");
	}

	$error = verifyClicks($clicks, $index);

	// this is the solution
	if($error == 0) {
		$score = count($clicks)-1;
		$best_score = getField($table_name, $index, 'BEST_MINIMUM_CLICKS');

		if($score < $best_score) {

			$time = time() - $_SESSION['START_TIME'];
			$_SESSION['BEST_SCORE'] = $score;
			$_SESSION['BEST_TIME'] = $time;
			$_SESSION['ID'] = $index;				

			echo json_encode("0");
		
		} else if ($score == $best_score) { 

			$time = time() - $_SESSION['START_TIME'];
			$best_time = getField($table_name, $index, 'BEST_TIME');

			if($time < $best_time) {

				$_SESSION['BEST_SCORE'] = $score;
				$_SESSION['BEST_TIME'] = $time;
				$_SESSION['ID'] = $index;

				echo json_encode("0");

			} else {
				echo json_encode("1Congratulation!! This is your score " . $score . " and time " . $time . ". The best score is " . $best_score . " and best time is " . $best_time);
			}

		} else {
			echo json_encode("1Congratulation!! This is your score " . $score . " and time " . $time . ". The best score is " . $best_score . " and best time is " . $best_time);
		}

	} else if($error == 1) {
		echo json_encode("2The solution is not correct. please recheck");
	}
}

