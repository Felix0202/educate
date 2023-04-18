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

function userLoggedIn($conn, $userId)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $authToken = '';

    for ($i = 0; $i < 30; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $authToken .= $characters[$index];
    }
    try {
        $query = "DELETE FROM session WHERE userId = '$userId'";
        $result = $conn->query($query);
    } catch (Exception $ex) {
    }

    $query = "INSERT INTO `session` (`userId`, `authtoken`, `lastLogin`) VALUES ('$userId', '$authToken', current_timestamp())";
    $result = $conn->query($query);
    return $authToken;
}

function checkUserLoggedIn($conn)
{
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
        $response->message = "Username / Password wrong";
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
        $response->error = "didn´t work";
        echo json_encode($response);
    }

// LOGGED IN REQUESTS
} else if (checkUserLoggedIn($conn)) {
    $isReqOk = false;
    $postBody = json_decode(file_get_contents('php://input'));

// just for testing
    if ($_GET["getUsers"]) {
        $table = "user";
        $query = "SELECT userId, username, name, email, password FROM $table";
        if ($result = $conn->query($query)) {
            $emparray = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $emparray[] = $row;
                $isReqOk = true;
            }
            echo json_encode($emparray);
        }
    }

    if ($_GET["loadPublicCourses"]) {
        $searchText = $conn->real_escape_string($postBody->searchText);
        $query = "SELECT courseId, title, note, DATE_FORMAT(creationDate, '%d.%m.%Y') 'creationDate', isPublic From course WHERE isPublic = 1 AND title like '%$searchText%'";
        if ($result = $conn->query($query)) {
            if ($result->num_rows != 0) {
                $emparray = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $emparray[] = $row;
                    $isReqOk = true;
                }
                echo json_encode($emparray);
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->message = "No courses found!";
            echo json_encode($response);
        }
    }

    if ($_GET["loadCourses"]) {
        $userId = $conn->real_escape_string($postBody->userId);
        $query = "SELECT courseId, title, note, DATE_FORMAT(creationDate, '%d.%m.%Y') 'creationDate', isPublic, isOwner FROM usercourse join course using(courseId) WHERE userId = '$userId'";
        if ($result = $conn->query($query)) {
            if ($result->num_rows != 0) {
                $emparray = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $emparray[] = $row;
                    $isReqOk = true;
                }
                echo json_encode($emparray);
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->message = "No courses yet!";
            echo json_encode($response);
        }
    }

    if ($_GET["loadCourse"]) {
        $userId = $conn->real_escape_string($postBody->userId);
        $courseId = $conn->real_escape_string($postBody->courseId);
        $query1 = "SELECT * FROM course WHERE course.courseId = '$courseId' and isPublic = 1";
        $query2 = "SELECT * FROM usercourse join course using (courseId) WHERE userId = '$userId' AND courseId = '$courseId'";
        $result1 = $conn->query($query1);
        $result2 = $conn->query($query2);
        if ($result1->num_rows != 0 || $result2->num_rows != 0) {
            $query = "SELECT * FROM courseEntry join cardEntry using (entryId) WHERE courseId = '$courseId'";
            $emparray = array();
            if ($result = $conn->query($query)) {
                if ($result->num_rows != 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $emparray[] = $row;
                        $isReqOk = true;
                    }
                }
            }

            $query = "SELECT * FROM courseEntry join textEntry using (entryId) WHERE courseId = '$courseId'";
            if ($result = $conn->query($query)) {
                if ($result->num_rows != 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $emparray[] = $row;
                        $isReqOk = true;
                    }

                }
            }

            if (!$isReqOk) {
                $isReqOk = true;
                $response = new stdClass();
                $response->message = "No entries yet ...";
                echo json_encode($response);
            } else {
                echo json_encode($emparray);
            }
        } else {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "You do not have Access to this Course!";
            echo json_encode($response);
        }

    }

    if ($_GET["newCourse"]) {
        $userId = $conn->real_escape_string($postBody->userId);
        try {
            $conn->begin_transaction();
            $query = "INSERT INTO course(title, note, creationDate, isPublic) VALUES ('New Course',' nothing',current_timestamp(), 1)";
            $conn->query($query);
            $courseId = mysqli_insert_id($conn);
            $query = "INSERT INTO usercourse(userId, courseId, isOwner) VALUES ('{$userId}','$courseId', 1)";
            $conn->query($query);
        } catch (Exception $exception) {
            $conn->rollback();
        }
        if ($conn->commit()) {
            $isReqOk = true;
            echo json_encode($courseId);
        }


        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "Create course not possible";
            echo json_encode($response);
        }
    }

    if ($_GET["setUserCourse"]) {
        $userId = $conn->real_escape_string($postBody->userId);
        $courseId = $conn->real_escape_string($postBody->courseId);
        $userJoins = $conn->real_escape_string($postBody->userJoins);


        if ($userJoins == 1) {
            $query = "INSERT INTO usercourse (userId, courseId, isOwner) VALUES ('$userId', '$courseId', 0)";
            if ($result = $conn->query($query)) {
                $isReqOk = true;
            }
            if (!$isReqOk) {
                $isReqOk = true;
                $response = new stdClass();
                $response->error = "Course Join not possible";
                echo json_encode($response);
            }
        } else if ($userJoins == 0) {
            try {
                $query = "DELETE FROM usercourse WHERE userId = '$userId' and courseId = '$courseId'";
                $result = $conn->query($query);
                $isReqOk = true;
            } catch (Exception $ex) {

            }
            if (!$isReqOk) {
                $isReqOk = true;
                $response = new stdClass();
                $response->error = "Leve Course not possible";
                echo json_encode($response);
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
        $response->error = "No Req!";
        echo json_encode($response);
    }
// NOT LOGGED IN ERROR
} else {
    $response = new stdClass();
    $response->error = "Not Loggid in!";
    echo json_encode($response);
}

$conn->close();
?>
