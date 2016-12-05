<?php 
$servername = "mysql.cs.iastate.edu";
$username = "dbu309gp05";
$password = "8uj6J4wwABG";
$db = "db309gp05";


// Create connection
$conn = new mysqli($servername, $username, $password, $db);

$score = $_POST['score'];
$user = $_POST['user'];

if($conn->connect_error) {
	die("connection error: " . $conn->connect_error);
}

$sql = "SELECT * FROM Accounts";
$result = $conn->query($sql);
$array = [];

while($row = $result->fetch_assoc()) {
    array_push($array, $row);
}


//finds top 3 highscores
for ($i = 0; $i < count($array); $i++)
{
    if ($array[$i]{"HighScore"} < $score && $array[$i]{"Username"} == $user)
    {
		$sql = "UPDATE Accounts SET HighScore = " . $score . " WHERE Username = '$user'";
		
		if (mysqli_query($conn, $sql)) {
			echo "Record updated successfully";
		}
		else {
			echo "Error updating record: " . mysqli_error($conn);
		}
    }
}

$conn->close();
?>