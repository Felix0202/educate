import {userData, loggedIn} from "@/pages/authentication";
import axios from "axios";
import {useState} from "react";
import {useRouter} from "next/router";

export async function loadCourses() {
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
            return 1;
        }
    });
}

export default function CourseNav(ctx) {
    if (loggedIn) {
        const [courses, setCourses] = useState(0);
        const router = useRouter();

        if (courses === 0) {
            if (ctx.courses === undefined) { // loads data (from server)
                loadCourses().then((res) => {
                    setCourses(1);
                });
            } else if (ctx.courses === 0) { // waits for data (gets it in the next call)

            } else { // loads data (from ctx-param)
                userData.courses = ctx.courses;
                setCourses(1);
            }
        }

        if (courses === 1) {
            return <>
                <div className={"courseNav"}>
                    <div className={"courseNavFind"}>
                        <h2>find courses</h2>
                        <input type="text" className={"courseNavInput"} placeholder={"search"}></input>
                    </div>
                    <div>
                        <h2>my courses</h2>
                        <div className={"courseNavList"}>
                            {userData.courses.map((course) => <div className={"courseNavCourse"}
                                                                   onClick={(e) => router.push({
                                                                       pathname: '/course',
                                                                       query: {courseId: course.courseId}
                                                                   }, '/course')}><p>{course.title}</p></div>)}
                        </div>
                    </div>
                </div>
            </>
        } else {
            return <>
                <div className={"courseNav"}>
                    <div className={"courseNavFind"}>
                        <h2>find courses</h2>
                        <input type="text" className={"courseNavInput"} placeholder={"search"}></input>
                    </div>
                    <br/>
                    <div className={"courseNavList"}>
                        <h2>my courses</h2>
                        Loading
                    </div>
                </div>
            </>
        }


    }
}