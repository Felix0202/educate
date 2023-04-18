import Header from '../components/header';
import CourseNav from "@/components/courseNav";
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";
import axios from "axios";
import {useState} from "react";

export default function Dashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState(0);
    const [coursesNav, setCoursesNav] = useState(0);

    if (loggedIn) {
        let searchText = router.query.searchText || "";
        if (router.query.publicCourses && router.query.searchText) { // if search is active
            let publicCourses = JSON.parse(router.query.publicCourses);
            if (publicCourses.message) { // if no public courses were found
                return <>
                    <Header></Header>
                    <div className={"main"}>
                        <CourseNav courses={coursesNav} searchText={searchText}></CourseNav>
                        <div className={"mainBox"}>
                            <div className={"dashHeader"}>
                                <p>Search for "{router.query.searchText}"</p>
                                <p className={"buttonAction"} onClick={() => {
                                    router.push({
                                        pathname: '/dashboard',
                                    }, '/dashboard');
                                }}>
                                    x
                                </p>
                            </div>
                            <div className={"dashMain"}>
                                <p className={"courseMessage"}>{publicCourses.message}</p>
                            </div>
                        </div>
                    </div>
                </>
            } else { // print public courses
                return <>
                    <Header></Header>
                    <div className={"main"}>
                        <CourseNav courses={coursesNav} searchText={searchText}></CourseNav>
                        <div className={"mainBox"}>
                            <div className={"dashHeader"}>
                                <p>Search for "{router.query.searchText}"</p>
                                <p className={"buttonAction"} onClick={() => {
                                    router.push({
                                        pathname: '/dashboard',
                                    }, '/dashboard');
                                }}>
                                    x
                                </p>
                            </div>
                            <div className={"dashMain"}>
                                {publicCourses.map((course) => <div className={"dashCourse"}
                                                                    onClick={(e) => router.push({
                                                                        pathname: '/course',
                                                                        query: {courseId: course.courseId, courseData: JSON.stringify(course)}
                                                                    }, '/course')}>
                                    <h2>{course.title}</h2>
                                    <p>Note: {course.note}</p>
                                    <p>{course.creationDate}</p>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </>
            }
        } else if (courses === 0) { // if courses are not loaded yet
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
                    setCoursesNav(userData.courses)
                    setCourses(1);
                }
            });
        }
        if (courses === 1) { // if courses are loaded
            return (
                <>
                    <Header></Header>
                    <div className={"main"}>
                        <CourseNav courses={coursesNav} searchText={searchText}></CourseNav>
                        <div className={"mainBox"}>
                            <div className={"dashHeader"}>
                                <p>Dashboard</p>
                                <p className={"buttonAction"} onClick={() => {
                                    axios.post('/api/newCourse', {
                                        authtoken: userData.authtoken,
                                        userId: userData.userId,
                                    }).then((res) => {
                                        if (res.data.error) {
                                            router.push({
                                                pathname: '/error',
                                                query: {error: res.data.error}
                                            }, '/error');
                                        } else {
                                            router.push({
                                                pathname: '/course',
                                                query: {
                                                    courseId: res.data,
                                                    newCourse: true
                                                }
                                            }, '/course');
                                        }
                                    })
                                }}>+</p>
                            </div>
                            <div className={"dashMain"}>
                                {userData.courses.message !== undefined ? (
                                    <><p className={"courseMessage"}>{userData.courses.message}</p></>
                                ) : (
                                    userData.courses.map((course) => <div className={"dashCourse"}
                                                                       onClick={(e) => router.push({
                                                                           pathname: '/course',
                                                                           query: {courseId: course.courseId, courseData: JSON.stringify(course)}
                                                                       }, '/course')}>
                                    <h2>{course.title}</h2>
                                    <p>Note: {course.note}</p>
                                    <p>{course.creationDate}</p>

                                </div>))}
                            </div>
                        </div>
                    </div>
                </>
            )
        } else { // if courses are loading at the moment
            return (
                <>
                    <Header></Header>
                    <div className={"main"}>
                        <CourseNav courses={coursesNav} searchText={searchText}></CourseNav>
                        <div className={"mainBox"}>
                            <div className={"dashHeader"}>
                                <p>Dashboard</p>
                            </div>
                            <div className={"dashMain"}>
                                Loading ...
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    } else { // if not loggedIn
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

