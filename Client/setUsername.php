<?php 
session_start();
//saves username for this session so it can be retreived by any page
$_SESSION["user"] = $_POST['user'];
?>