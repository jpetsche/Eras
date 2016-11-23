<?php 
$servername = "mysql.cs.iastate.edu";
$username = "dbu309gp05";
$password = "8uj6J4wwABG";
$db = "db309gp05";

$user = $_POST['newUser'];

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

if($conn->connect_error) {
	die("connection error: " . $conn->connect_error);
}

$insert = 'INSERT INTO Accounts '.
      '(Username) '.
      'VALUES (' + $user + ')';

if ($conn->query($insert) === TRUE) {
    echo "New user created successfully";
} else {
    echo "Error: " . $insert . "<br>" . $conn->error;
}

$conn->close();
?>