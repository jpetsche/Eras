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

$sql = "SELECT * FROM Accounts";
$result = $conn->query($sql);
$array = [];

while($row = $result->fetch_assoc()) {

    array_push($array, $row);
}

echo json_encode($array);

$conn->close();
?>