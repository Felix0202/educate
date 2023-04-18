import Header from '../components/header';
import CourseNav from "@/components/courseNav";
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";
import axios from "axios";
import {useState} from "react";
import {log} from "next/dist/server/typescript/utils";

export default function Course() {
    const router = useRouter();
    const [course, setCourse] = useState(0);
    const [entries, setEntries] = useState("loading");

    if (loggedIn) {

        const setUserCourse = (userJoins) => {
            console.log(userJoins);
            axios.post('/api/setUserCourse', {
                authtoken: userData.authtoken,
                userId: userData.userId,
                courseId: requestedCourse,
                userJoins: userJoins // if 1 user joins course - if 0 user leaves the course
            }).then((res) => {
                console.log(res.data);
                if (res.data.error) {
                    router.push({
                        pathname: '/error',
                        query: {error: res.data.error}
                    }, '/error');
                } else {
                    router.push({
                        pathname: '/dashboard',
                    }, '/dashboard');
                }
            });
        }

        let requestedCourse = router.query.courseId;

        // if new course is created
        if (router.query.newCourse) {
            // load course entries
            axios.post('/api/loadCourses', {
                authtoken: userData.authtoken,
                userId: userData.userId
            }).then((res) => {
                if (res.data.error) {
                    router.push({
                        pathname: '/error',
                        query: {error: res.data.error}
                    }, '/error');
                } else {
                    userData.courses = res.data;

                    // push to same page but without newCourse query
                    for (const course of userData.courses) {
                        if (course.courseId == requestedCourse) {
                            router.push({
                                pathname: '/course',
                                query: {courseId: requestedCourse, courseData: JSON.stringify(course)}
                            }, '/course');
                        }
                    }
                }
            });
            return <>
                <div>
                    <Header></Header>
                    <div className={"main"}>
                        Loading
                    </div>
                </div>
            </>
        } else {
            // get courseData from router -> already loaded (dashboard/course)
            let courseData = JSON.parse(router.query.courseData);

            let courseEntries;
            // if no couse is open yet or the requestedCourse is not the current one
            if (course === 0 || course !== requestedCourse) {
                axios.post('/api/loadCourse', {
                    authtoken: userData.authtoken,
                    userId: userData.userId,
                    courseId: requestedCourse
                }).then((res) => {
                    courseEntries = res.data;
                    let entriesString = "";

                    // write the data to string
                    if (courseEntries.message) {
                        entriesString = `<p class="courseMessage">${courseEntries.message}</p>`;
                    } else if (courseEntries.error) {
                        router.push({
                            pathname: '/error',
                            query: {error: courseEntries.error}
                        }, '/error');
                    } else {
                        courseEntries.sort(function (a, b) {
                            var keyA = new Date(a.creationDate),
                                keyB = new Date(b.creationDate);
                            // Compare the 2 dates
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        for (const entry of courseEntries) {
                            if (entry.text) {
                                if (entry.isHeadline == 1) {
                                    entriesString += `<div class="courseEntryHeadline">${entry.text}</div>`;
                                } else {
                                    entriesString += `<div class="courseEntryText">${entry.text}</div>`;
                                }
                            } else if (entry.title) {
                                entriesString += `<div class="courseEntryCard"><img class="courseCardIMG" src="../../indexCard.png" alt=""/>${entry.title}</div>`;
                            }
                        }
                    }
                    setEntries(entriesString);
                    setCourse(requestedCourse);
                });
            }

            let userJoinedCourse = false;
            console.log(userData.courses);
            if (userData.courses.message) {

            } else if (userData.courses) {
                for (const course of userData.courses) {
                    if (course.courseId === requestedCourse) {
                        if (course.isOwner !== "1") {
                            userJoinedCourse = true;
                        } else {
                            userJoinedCourse = null;
                        }
                        break;
                    }
                }
            } else {

            }

            return (
                <>
                    <Header></Header>
                    <div className={"main"}>
                        <CourseNav></CourseNav>
                        <div className={"mainBox"}>
                            <div className={"courseHeader"}>
                                <div>
                                    <h1>{courseData.title}</h1>
                                    <p>Note: {courseData.note}</p>
                                    <p>Created on: {courseData.creationDate}</p>
                                </div>
                                <div>
                                    {
                                        courseData.isOwner === "1" ? <>
                                            <div className={"courseButtonEdit"}>
                                                <img src="../../edit.svg" alt="EDIT"/>
                                            </div>
                                        </> : <></>
                                    }
                                    {
                                        userJoinedCourse !== null ? userJoinedCourse === true ? <>
                                            <div id={"courseJoinLeaveButton"} onClick={() => {
                                                setUserCourse(0);
                                            }}>LEAVE
                                            </div>
                                        </> : <>
                                            <div id={"courseJoinLeaveButton"} onClick={() => {
                                                setUserCourse(1);
                                            }}>JOIN
                                            </div>
                                        </> : <></>
                                    }
                                </div>
                            </div>

                            <div className={"courseMain"} dangerouslySetInnerHTML={{__html: entries}}>

                            </div>
                        </div>
                    </div>
                </>
            )
        }
    } else {
        return (
            <>
                <Header></Header>
                <div>
                    <h2>Please <span className={"authLink"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: {authMethod: 1}
                    }, '/authentication')}>Log in</span> first!</h2>
                </div>
            </>
        );

    }
}