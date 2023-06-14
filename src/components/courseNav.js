import {userData, loggedIn} from "@/pages/authentication";
import axios from "axios";
import {useState} from "react";
import {useRouter} from "next/router";

export default function CourseNav(ctx) {
    if (loggedIn) {

        const loadCourses = async () => {
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
                    setCourses(1);
                }
            });
        }

        const loadPublicCourses = () => {
            let searchText = document.getElementById('searchText').value;
            axios.post('/api/loadPublicCourses', {
                authtoken: userData.authtoken,
                userId: userData.userId,
                searchText: searchText
            }).then((res) => {
                if (res.data.error) {
                    router.push({
                        pathname: '/error',
                        query: {error: res.data.error}
                    }, '/error');
                } else {
                    router.push({
                        pathname: '/dashboard',
                        query: {
                            publicCourses: JSON.stringify(res.data),
                            searchText: searchText
                        }
                    }, '/dashboard');
                }
            });
        }


        const [courses, setCourses] = useState(0);
        const router = useRouter();

        if (courses === 0) {
            if (ctx.courses === undefined || ctx.courses === 0) { // loads data (from server)
                loadCourses();
            } else if (ctx.courses === 0) { // waits for data (gets it in the next call)

            } else { // loads data (from ctx-param)
                userData.courses = ctx.courses;
                setCourses(1);
            }
        }
        let searchText = ctx.searchText;
        if (courses === 1 || searchText != "") { // show courses if loaded or the if something is searched (then it is already loaded)
            return <>
                <div className={"courseNav"}>
                    <div className={"courseNavFind"}>
                        <h2>public courses</h2>
                        <input autoFocus={true} type="text" className={"courseNavInput"} placeholder={"search"}
                               id={'searchText'} value={searchText || ""} onInput={(e) => {
                            loadPublicCourses();
                        }}></input>
                    </div>
                    <div>
                        <h2>my courses</h2>
                        <div className={"courseNavList"}>
                            {userData.courses.message !== undefined ? (
                                <><br/><p className={"courseNavNoCourses"}>{userData.courses.message}</p></>
                            ) : (
                                userData.courses.map((course) => <div className={"courseNavCourse"}
                                                                      onClick={(e) => router.push({
                                                                          pathname: '/course',
                                                                          query: {
                                                                              courseId: course.courseId,
                                                                              courseData: JSON.stringify(course)
                                                                          }
                                                                      }, '/course')}><p>{course.title}</p></div>)
                            )}
                        </div>
                    </div>
                </div>
            </>
        } else {
            return <>
                <div className={"courseNav"}>
                    <div className={"courseNavFind"}>
                        <h2>public courses</h2>
                        <input autoFocus={true} type="text" className={"courseNavInput"} placeholder={"search"}
                               id={'searchText'} value={searchText || ""} onInput={(e) => {
                            loadPublicCourses();
                        }}></input>
                    </div>
                    <div>
                        <h2>my courses</h2>
                        <div className={"courseNavList"}>
                            loading
                        </div>
                    </div>
                </div>
            </>
        }
    }
}