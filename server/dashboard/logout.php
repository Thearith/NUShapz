<?php
	session_unset();
	session_destroy();

	header("Location: http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/");
	die();
?>