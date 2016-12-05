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

$scores = [];

$max1 = array("HighScore"=> 0);
$max2 = array("HighScore"=> 0);
$max3 = array("HighScore"=> 0);
//finds top 3 highscores
for ($i = 0; $i < count($array); $i++)
{
    if ($array[$i]{"HighScore"} >= $max1["HighScore"])
    {
        $max3 = $max2; 
		$max2 = $max1; 
		$max1 = $array[$i];
    }
    else if ($array[$i]{"HighScore"} >= $max2["HighScore"])
    {
        $max3 = $max2;
		$max2 = $array[$i];
    }
    else if ($array[$i]{"HighScore"} >= $max3["HighScore"])
    {
        $max3 = $array[$i];
    }
}
array_push($scores, $max1);
array_push($scores, $max2);
array_push($scores, $max3);
echo json_encode($scores);

$conn->close();
?>