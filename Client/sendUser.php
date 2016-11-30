<?php 
session_start();
$servername = "mysql.cs.iastate.edu";
$username = "dbu309gp05";
$password = "8uj6J4wwABG";
$db = "db309gp05";

$user = $_POST['newUser'];

//saves username for this session so it can be retreived by any page
$_SESSION["user"] = $user;

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

if($conn->connect_error) {
	die("connection error: " . $conn->connect_error);
}

$insert = 'INSERT INTO Accounts 
      (Username, HighScore) 
      VALUES ("' . $user . '", "0")';

if ($conn->query($insert) === TRUE) {
    echo "New user created successfully";
} else {
    echo "Error: " . $insert . "<br>" . $conn->error;
}

$conn->close();
?>