import Header from '../components/header';
import CourseNav from "@/components/courseNav";
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";
import axios from "axios";
import {useState} from "react";
import Entry from "@/components/Entry";

export default function Course() {
    const router = useRouter();
    const [course, setCourse] = useState(0);
    const [entries, setEntries] = useState({message: "Loading ..."});
    const [edit, setEdit] = useState(false);

    if (loggedIn) {

        const newEntry = (entryCat) => {
            console.log(entryCat)
            axios.post('/api/newEntry', {
                authtoken: userData.authtoken,
                userId: userData.userId,
                courseId: requestedCourse,
                entryCat: entryCat
            }).then((res) => {
                if (res.data.error) {
                    router.push({
                        pathname: '/error',
                        query: {error: res.data.error}
                    }, '/error');
                } else {
                    loadCourse();
                }
            });
        }

        const loadCourse = () => {
            axios.post('/api/loadCourse', {
                authtoken: userData.authtoken,
                userId: userData.userId,
                courseId: requestedCourse
            }).then((res) => {
                let courseEntries = res.data.entries;
                userData.courses = res.data.courses;

                // write the data to string
                if (courseEntries.message) {
                    setEntries({message: courseEntries.message});
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
                    console.log(courseEntries)
                    setEntries(courseEntries);
                }
                setCourse(requestedCourse);
                setEdit(false);
            });
        }

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

        const deleteCourse = () => {
            axios.post('/api/deleteCourse', {
                authtoken: userData.authtoken,
                userId: userData.userId,
                courseId: requestedCourse
            }).then((res) => {
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
            })
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
                loadCourse();
            }

            let userJoinedCourse = false;
            console.log(userData.courses);
            if (userData.courses.message) {

            } else if (userData.courses) {
                for (const course of userData.courses) {
                    if (course.courseId === requestedCourse) {
                        courseData = course;
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

            console.log(courseData)

            let isPublic = courseData.isPublic === "1";

            console.log(isPublic)

            return (
                <>
                    <Header></Header>
                    <div className={"main"}>
                        <CourseNav></CourseNav>
                        <div className={"mainBox"}>
                            <div className={"courseHeader"}>
                                <div className={"courseHeaderInfos"}>
                                    <Entry edit={edit} entryCat={3} text={courseData.title} entryId={"-1"}
                                           courseId={requestedCourse}></Entry>
                                    <Entry edit={edit} entryCat={4} text={courseData.note} entryId={"-2"}
                                           courseId={requestedCourse}></Entry>
                                    <div><p>Created on: {courseData.creationDate}</p></div>
                                    {
                                        courseData.isOwner === "1" ?
                                            <>
                                                <div className={"flexbox"}><p>Public: </p>
                                                    <div
                                                        className={"flexboxJustifyCenterVertical courseHeaderPublicBox"}>
                                                        <div>
                                                            <input type="checkbox" className={"courseHeaderPublicInput"}
                                                                   checked={isPublic} onChange={() => {
                                                                axios.post('/api/changePublic', {
                                                                    authtoken: userData.authtoken,
                                                                    userId: userData.userId,
                                                                    courseId: requestedCourse,
                                                                    isPublic: (isPublic ? "0" : "1")
                                                                }).then((res) => {
                                                                    if (res.data.error) {
                                                                        router.push({
                                                                            pathname: '/error',
                                                                            query: {error: res.data.error}
                                                                        }, '/error');
                                                                    } else {
                                                                        loadCourse()
                                                                    }
                                                                })
                                                            }}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : <>
                                                <div className={"flexbox"}>
                                                    <p>Public: Yes</p>
                                                </div>
                                            </>
                                    }
                                </div>
                                <div className={"courseHeaderButtons"}>
                                    {
                                        courseData.isOwner === "1" || userJoinedCourse == null ? <>
                                            <div className={"flexboxVertical"}>
                                                <div className={"courseButtonEdit"} onClick={() => {
                                                    if (edit === true) loadCourse();
                                                    setEdit(!edit);
                                                }}>
                                                    <img src="../../edit.svg" alt="EDIT"/>
                                                </div>
                                                {
                                                    edit === true ? <>
                                                        <div
                                                            className={"courseButtonDelete flexboxJustifyCenterVertical"}
                                                            id={"courseDelete"} onClick={() => {
                                                            deleteCourse()
                                                        }}>
                                                            X
                                                        </div>
                                                    </> : <></>
                                                }
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

                            <div className={"courseMain"}>
                                {
                                    entries.message ? (
                                        <h2>{entries.message}</h2>
                                    ) : (
                                        entries.map((entry) =>
                                            entry.title ? (
                                                <Entry edit={edit} entryCat={2} text={entry.title}
                                                       entryId={entry.entryId}
                                                       courseId={requestedCourse}></Entry>
                                            ) : (
                                                entry.isHeadline === "1" ? (
                                                    <Entry edit={edit} entryCat={0} text={entry.text}
                                                           entryId={entry.entryId}
                                                           courseId={requestedCourse}></Entry>
                                                ) : (
                                                    <Entry edit={edit} entryCat={1} text={entry.text}
                                                           entryId={entry.entryId}
                                                           courseId={requestedCourse}></Entry>
                                                )
                                            )))
                                }
                                {
                                    courseData.isOwner === "1" || userJoinedCourse == null ? <>
                                        <br/>
                                        <div className={"courseNewEntry"}>
                                            + &nbsp;
                                            <p onClick={() => {
                                                newEntry(0); // 0-> Headline
                                            }}> Headline </p> &nbsp; | &nbsp;
                                            <p onClick={() => {
                                                newEntry(1); // 1 -> Text
                                            }}>Text</p> &nbsp; | &nbsp;
                                            <p onClick={() => {
                                                newEntry(2); // 2 -> Card
                                            }}>Card</p>
                                        </div>
                                    </> : <></>
                                }
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
                <div className={"notLoggedInBox"}>
                    <h2>Please <span className={"authLink"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: {authMethod: 1}
                    }, '/authentication')}>Log in</span> first!</h2>
                </div>
            </>
        );

    }
}