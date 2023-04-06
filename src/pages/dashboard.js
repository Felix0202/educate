import Header from '../components/header';
import CourseNav from "@/components/courseNav";
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";
import axios from "axios";
import {useState} from "react";

export default function Dashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState("loading");
    const [coursesNav, setCoursesNav] = useState(0);

    const example = () => {
        axios.post('/api/checkLoggedIn', {
            authtoken: userData.authtoken,
            userId: userData.userId
        })
            .then((res) => {
                console.log(res.data);
            });
    }

    if (loggedIn) {
        if (courses === "loading") {
            axios.post('/api/loadCourses', {
                authtoken: userData.authtoken,
                userId: userData.userId
            }).then((res) => {
                console.log(res.data)
                userData.courses = res.data;
                console.log(userData.courses)
                let output = "";
                for (const course of userData.courses) {
                    output += `<div class="dashCourse">
                                <h2>${course.title}</h2>
                                <p>Note: ${course.note}</p>
                                <p>${course.creationDate}</p>
                               
                                </div>`;
                }
                setCoursesNav(userData.courses)
                setCourses(output);
            });
        }
        return (
            <>
                <Header></Header>
                <div className={"main"}>
                    <CourseNav courses={coursesNav}></CourseNav>
                    <div className={"mainBox"}>
                        <h2>Dashboard</h2>
                        <div className={"dashMain"} dangerouslySetInnerHTML={{__html: courses}}>

                        </div>
                    </div>
                </div>
            </>
        )
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

