import {userData, loggedIn} from "@/pages/authentication";
import axios from "axios";
import {useState} from "react";

export default function CourseNav(ctx) {
    if (loggedIn) {
        const [courses, setCourses] = useState("loading");

        const printData = () => {
            let output = "";
            for (const course of userData.courses) {
                output += `<div class="courseNavCourse"><p>${course.title}</p></div>`;
            }
            setCourses(output);
        }

        if (courses === "loading") {
            if (ctx.courses === undefined) { // loads data (from server)
                axios.post('/api/loadCourses', {
                    authtoken: userData.authtoken,
                    userId: userData.userId
                }).then((res) => {
                    userData.courses = res.data;
                    printData();
                });
            } else if (ctx.courses === 0) { // waits for data (gets it in the next call)

            } else { // loads data (from ctx-param)
                userData.courses = ctx.courses;
                printData();
            }
        }

        return <>
            <courseNav>
                <div>
                    <h2>find courses</h2>
                    <input type="text" className={"courseNavInput"} placeholder={"search"}></input>
                </div>
                <br/>
                <div>
                    <h2>my courses</h2>
                    <div dangerouslySetInnerHTML={{__html: courses}}>

                    </div>
                </div>
            </courseNav>
        </>
    }
}