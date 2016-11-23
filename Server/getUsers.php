<?php 
$servername = "mysql.cs.iastate.edu";
$username = "dbu309gp05";
$password = "8uj6J4wwABG";
$db = "db309gp05";


// Create connection
$conn = new mysqli($servername, $username, $password, $db);

if($conn->connect_error) {
	die("connection error: " . $conn->connect_error);
}

$sql = "SELECT Username FROM Accounts";
$result = $conn->query($sql);

echo json_encode($result);

$conn->close();
?>