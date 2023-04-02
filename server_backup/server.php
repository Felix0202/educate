<?php

$passwordKEYWORD = "educate";

$_db_host = "localhost";
$_db_datenbank = "educate";
$_db_username = "educateServer";
$_db_passwort = "educate";

$conn = new mysqli($_db_host, $_db_username, $_db_passwort, $_db_datenbank);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function userLoggedIn ($conn, $userId) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $authToken = '';

    for ($i = 0; $i < 30; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $authToken .= $characters[$index];
    }
    try {
        $query = "DELETE FROM session WHERE userId = '$userId'";
        $result = $conn->query($query);
    } catch (Exception $ex) {}

    $query = "INSERT INTO `session` (`userId`, `authtoken`, `lastLogin`) VALUES ('$userId', '$authToken', current_timestamp())";
    $result = $conn->query($query);
    return $authToken;
}

function checkUserLoggedIn($conn) {
    $postBody = json_decode(file_get_contents('php://input'));
    $userId = $conn->real_escape_string($postBody->userId);
    $authToken = $conn->real_escape_string($postBody->authtoken);

    $query = "SELECT * FROM session WHERE authtoken = '$authToken' and userId = '$userId' and lastLogin + interval 2 hour > current_timestamp()";
    if ($result = $conn->query($query)) {
        if ($result->num_rows == 0) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

// LOGIN
if ($_GET["loginUser"]) {
    $postBody = json_decode(file_get_contents('php://input'));
    $isReqOk = false;
    if (isset($postBody->username) && isset($postBody->password)) {
        $isReqOk = true;
        $table = "user";
        $username = $conn->real_escape_string($postBody->username);
        $password = $conn->real_escape_string($postBody->password);
        $query = "SELECT userId, username, name, email FROM $table WHERE username = '$username' and password = md5('$passwordKEYWORD$password')";
        if ($result = $conn->query($query)) {
            if ($result->num_rows == 0) {
                $isReqOk = false;
            } else {
                $userData = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $authToken = userLoggedIn($conn, $row['userId']);
                    $row['authtoken'] = $authToken;
                    $userData[] = $row;
                    echo json_encode($userData);
                }
            }
        } else {
            $isReqOk = false;
        }
    }
    if (!$isReqOk) {
        $response = new stdClass();
        $response->message = "User not found";
        echo json_encode($response);
    }

// NEW USER
} else if ($_GET["newUser"]) {
    $postBody = json_decode(file_get_contents('php://input'));
    $isReqOk = false;
    if (isset($postBody->username) && isset($postBody->password) && isset($postBody->email) && isset($postBody->name)) {
        $isReqOk = true;
        $table = "user";
        $username = $conn->real_escape_string($postBody->username);
        $password = $conn->real_escape_string($postBody->password);
        $email = $conn->real_escape_string($postBody->email);
        $name = $conn->real_escape_string($postBody->name);
        $query = "INSERT INTO $table (username, password, email, name) VALUES ('$username', md5('$passwordKEYWORD$password'), '$email', '$name')";
        try {
            if ($result = $conn->query($query)) {
                $query = "SELECT userId, username, name, email FROM $table WHERE username = '$username'";
                if ($result = $conn->query($query)) {
                    if ($result->num_rows == 0) {
                        $isReqOk = false;
                    } else {
                        $emparray = array();
                        while ($row = mysqli_fetch_assoc($result)) {
                            $authToken = userLoggedIn($conn, $row['userId']);
                            $row['authtoken'] = $authToken;
                            $userData[] = $row;
                            echo json_encode($userData);
                        }
                    }
                } else {
                    $isReqOk = false;
                }
            } else {
                $isReqOk = false;
            }
        } catch (Exception $ex) {
            $isReqOk = true;
            $response = new stdClass();
            $response->message = "user already exists";
            echo json_encode($response);
        }

    }
    if (!$isReqOk) {
        $response = new stdClass();
        $response->message = "didn´t work";
        echo json_encode($response);
    }

// LOGGED IN REQUESTS
} else if (checkUserLoggedIn($conn)) {
    $isReqOk = false;

    if ($_GET["getUsers"]) {
        $table = "user";
        $query = "SELECT userId, username, name, email, password FROM $table";
        if ($result = $conn->query($query)) {
            $emparray = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $emparray[] = $row;
                echo json_encode($emparray);
                $isReqOk = true;
            }
        }
    }

    if ($_GET["isLoggedIn"]) {
        $isReqOk = true;
        $response = new stdClass();
        $response->message = "Yessir";
        echo json_encode($response);
    }

    // LOGGED IN BUT NO REQUEST ERROR
    if (!$isReqOk) {
        $response = new stdClass();
        $response->message = "No Req!";
        echo json_encode($response);
    }
// NOT LOGGED IN ERROR
} else {
    $response = new stdClass();
    $response->message = "Not Loggid in!";
    echo json_encode($response);
}

$conn->close();
?>
