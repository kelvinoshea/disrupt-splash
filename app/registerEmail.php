<?php
class DB_PDO_MySQL
{
    private $db;
    function __construct()
    {
      $host = "";
      $dbname = "";
      $user = "";
      $password = "";
        try {
            $options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8');
            $this->db = new PDO(
                "mysql:host=$host;dbname=$dbname",
                $user,
                $password,
                $options
            );
            $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,
                PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(501);
            echo 'MySQL: ' . $e->getMessage();
        }
    }
    function insert($query, $arr_params)
    {
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        // validation
        if (is_null($query)) {
          http_response_code(400);
          echo 'insert(): $query is null';
        }
        if (!is_string($query)) {
          http_response_code(400);
          echo "insert(): $query is not a string";
        }
        if (!is_null($arr_params) and !is_array($arr_params)) {
          http_response_code(400);
          echo "insert(): $arr_params is not an array";
        }
        if (!is_null($arr_params) and count($arr_params) < 1) {
          http_response_code(400);
          echo "insert(): $arr_params is empty";
        }
        //Lets go
        try {
            $sql = $this->db->prepare($query); // 'SELECT * FROM authors WHERE id = :id'
            if (is_null($arr_params)) {
              $sql->execute();
            } else {
              $sql->execute($arr_params); // array(':id' => '1', ..)
            }
            $result = $sql->fetchAll();
            return $result;
        } catch (PDOException $e) {
            http_response_code(501);
            echo 'MySQL: ' . $e->getMessage();
        }
    }
}

if (isset($_POST["email"])) {
  $dp = new DB_PDO_MySQL();
  $query = "INSERT INTO Emails (email, submitDate) \n"
  . "VALUES (:email, NOW())\n";
  $arr_params = array(':email' => trim($_POST["email"])); //
  $response = $dp->insert($query,$arr_params);
  if($response == FALSE) {
    http_response_code(204);
    echo "Insert Failed";
  }

  echo '1';
} else {
  http_response_code(400);
  echo '$_POST["email"] does not exist';
}
?>
