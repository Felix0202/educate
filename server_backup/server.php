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

function checkUserCourseAccess($conn)
{ // return 1 if course is owned, 0 if isPublic, -1 if none
    $postBody = json_decode(file_get_contents('php://input'));
    $userId = $conn->real_escape_string($postBody->userId);
    $courseId = $conn->real_escape_string($postBody->courseId);
    $query1 = "SELECT * FROM course WHERE course.courseId = '$courseId' and isPublic = 1";
    $query2 = "SELECT * FROM usercourse join course using (courseId) WHERE userId = '$userId' AND courseId = '$courseId'";
    $query3 = "SELECT * FROM usercourse WHERE userId = '$userId' AND courseId = '$courseId' and isOwner = 1";
    $result1 = $conn->query($query1);
    $result2 = $conn->query($query2);
    $result3 = $conn->query($query3);
    if ($result3->num_rows != 0) {
        return 1;
    }
    if ($result1->num_rows != 0 || $result2->num_rows != 0) {
        return 0;
    }
    return -1;
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
                            $isReqOk = true;
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
        $response->error = "Create new User not possible";
        echo json_encode($response);
    }

// LOGGED IN REQUESTS
} else if (checkUserLoggedIn($conn)) {
    $isReqOk = false;
    $postBody = json_decode(file_get_contents('php://input'));

    if ($_GET["saveUserData"]) {
        $userId = $conn->real_escape_string($postBody->userId);
        $dataCat = $conn->real_escape_string($postBody->dataCat);
        $text = $conn->real_escape_string($postBody->text);
        if ($dataCat == 0) {
            $query = "UPDATE user SET name = '$text' WHERE userId = '$userId'";
            if ($result = $conn->query($query)) {
                $isReqOk = true;
                $response = new stdClass();
                $response->message = "DONE";
                echo json_encode($response);
            }
        } else if ($dataCat == 1) {
            $query = "UPDATE user SET email = '$text' WHERE userId = '$userId'";
            if ($result = $conn->query($query)) {
                $isReqOk = true;
                $response = new stdClass();
                $response->message = "DONE";
                echo json_encode($response);
            }
        } else if ($dataCat == 2) {
            $query = "UPDATE user SET password = md5('$passwordKEYWORD$text') WHERE userId = '$userId'";
            if ($result = $conn->query($query)) {
                $isReqOk = true;
                $response = new stdClass();
                $response->message = "DONE";
                echo json_encode($response);
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "Update Entry not possible";
            echo json_encode($response);
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
        $query = "SELECT courseId, title, note, DATE_FORMAT(creationDate, '%d.%m.%Y') 'creationDate', isPublic, isOwner FROM usercourse join course using(courseId) WHERE userId = '$userId'";
        if ($result = $conn->query($query)) {
            if ($result->num_rows != 0) {
                $courses = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $courses[] = $row;
                    $isReqOk = true;
                }
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->message = "No courses yet!";
            echo json_encode($response);
        }

        $courseId = $conn->real_escape_string($postBody->courseId);
        $check = checkUserCourseAccess($conn);
        if ($check == 0 || $check == 1) {
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
                $response = new stdClass();
                $response->entries = $emparray;
                $response->courses = $courses;
                echo json_encode($response);
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

    if ($_GET["deleteCourse"]) {
        $userId = $conn->real_escape_string($postBody->userId);
        $courseId = $conn->real_escape_string($postBody->courseId);

        if (checkUserCourseAccess($conn) == 1) {
            try {
                $conn->begin_transaction();
                $query = "DELETE FROM course WHERE courseId = $courseId";
                $conn->query($query);
                $query = "DELETE FROM usercourse where courseId = $courseId";
                $conn->query($query);
            } catch (Exception $exception) {
                $conn->rollback();
            }
            if ($conn->commit()) {
                $isReqOk = true;
                echo json_encode($courseId);
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "Delete course not possible";
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
                $response->error = "Leave Course not possible";
                echo json_encode($response);
            }
        }
    }

    if ($_GET["newEntry"]) { // no check if course is owned by user yet
        if (checkUserCourseAccess($conn) == 1) {
            $userId = $conn->real_escape_string($postBody->userId);
            $courseId = $conn->real_escape_string($postBody->courseId);
            $entryCat = $conn->real_escape_string($postBody->entryCat);

            try {
                $conn->begin_transaction();
                $query = "INSERT INTO courseEntry (creationDate, courseId) VALUES (current_timestamp(), '$courseId')";
                $conn->query($query);
                $entryId = mysqli_insert_id($conn);
                if ($entryCat == 1) {
                    $query = "INSERT INTO textEntry (entryId, text, isHeadline) VALUES ('$entryId', 'New Text', '0')";
                } else if ($entryCat == 2) {
                    $query = "INSERT INTO cardEntry (entryId, title) VALUES ('$entryId', 'New Cards')";
                } else {
                    $query = "INSERT INTO textEntry (entryId, text, isHeadline) VALUES ('$entryId', 'New Headline', '1')";
                }
                $conn->query($query);
            } catch (Exception $exception) {
                $conn->rollback();
            }
            if ($conn->commit()) {
                $isReqOk = true;
                echo json_encode($entryId);
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "Create new Entry not possible";
            echo json_encode($response);
        }
    }

    if ($_GET["saveEntry"]) { // no check if course is owned by user yet
        if (checkUserCourseAccess($conn) == 1) {
            $entryCat = $conn->real_escape_string($postBody->entryCat);
            $entryId = $conn->real_escape_string($postBody->entryId);
            $courseId = $conn->real_escape_string($postBody->courseId);
            $text = $conn->real_escape_string($postBody->text);
            if ($entryCat == 0 || $entryCat == 1) {
                $query = "UPDATE textEntry SET text = '$text' WHERE entryId = $entryId";
                if ($result = $conn->query($query)) {
                    $isReqOk = true;
                    $response = new stdClass();
                    $response->message = "DONE";
                    echo json_encode($response);
                }
            } else if ($entryCat == 2) {
                $query = "UPDATE cardEntry SET title = '$text' WHERE entryId = $entryId";
                if ($result = $conn->query($query)) {
                    $isReqOk = true;
                    $response = new stdClass();
                    $response->message = "DONE";
                    echo json_encode($response);
                }
            } else if ($entryCat == 3) {
                $query = "UPDATE course SET title = '$text' WHERE courseId = $courseId";
                if ($result = $conn->query($query)) {
                    $isReqOk = true;
                    $response = new stdClass();
                    $response->message = "DONE";
                    echo json_encode($response);
                }
            } else if ($entryCat == 4) {
                $query = "UPDATE course SET note = '$text' WHERE courseId = $courseId";
                if ($result = $conn->query($query)) {
                    $isReqOk = true;
                    $response = new stdClass();
                    $response->message = "DONE";
                    echo json_encode($response);
                }
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "Update Entry not possible";
            echo json_encode($response);
        }
    }

    if ($_GET["deleteEntry"]) { // no check if course is owned by user yet
        if (checkUserCourseAccess($conn) == 1) {
            $userId = $conn->real_escape_string($postBody->userId);
            $courseId = $conn->real_escape_string($postBody->courseId);
            $entryCat = $conn->real_escape_string($postBody->entryCat);
            $entryId = $conn->real_escape_string($postBody->entryId);

            try {
                $conn->begin_transaction();
                $query = "DELETE FROM courseEntry WHERE entryId = $entryId";
                $conn->query($query);
                if ($entryCat == 1) {
                    $query = "DELETE FROM textEntry WHERE entryId = $entryId";
                } else if ($entryCat == 2) {
                    $query = "DELETE FROM cardEntry WHERE entryId = $entryId";
                } else {
                    $query = "DELETE FROM textEntry WHERE entryId = $entryId";
                }
                $conn->query($query);
            } catch (Exception $exception) {
                $conn->rollback();
            }
            if ($conn->commit()) {
                $isReqOk = true;
                echo json_encode($entryId);
            }

        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "Delete Entry not possible";
            echo json_encode($response);
        }
    }

    if ($_GET["changePublic"]) { // no check if course is owned by user yet
        if (checkUserCourseAccess($conn) == 1) {
            $userId = $conn->real_escape_string($postBody->userId);
            $courseId = $conn->real_escape_string($postBody->courseId);
            $isPublic = $conn->real_escape_string($postBody->isPublic);

            $query = "UPDATE course SET isPublic = '$isPublic' WHERE courseId = $courseId";
            if ($result = $conn->query($query)) {
                $isReqOk = true;
                $response = new stdClass();
                $response->message = $isPublic;
                echo json_encode($response);
            }
        }

        if (!$isReqOk) {
            $isReqOk = true;
            $response = new stdClass();
            $response->error = "Change Public Status not possible";
            echo json_encode($response);
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
        $response->error = "Request not valid!";
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
