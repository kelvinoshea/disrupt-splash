<?php
  $host = "localhost";
  $username = "root";
  $password = "";
  $database = "disrupt-splash";

  // Create connection
  $conn = new mysqli($host, $username, $password, $database);

  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }

  $query = "INSERT INTO Emails (Email) VALUES ('".$_POST['email']."');";

  if ($conn->query($query)) {
      echo "Record updated successfully";

  } else {
      echo "Error updating record: " . $conn->error;

  }

  $conn->close();
?>
