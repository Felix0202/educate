import Header from '../components/header';
import CourseNav from "@/components/courseNav";
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";
import axios from "axios";
import {useState} from "react";

export default function Course() {
    const router = useRouter();
    const [course, setCourse] = useState(0);
    const [entries, setEntries] = useState("loading");


    if (loggedIn) {
        let requestedCourse = router.query.courseId;
        let courseData;

        for (const course of userData.courses) {
            if (course.courseId == requestedCourse) {
                courseData = course;
            }
        }

        let courseEntries;
        if (course === 0 || course !== requestedCourse) {
            axios.post('/api/loadCourse', {
                authtoken: userData.authtoken,
                userId: userData.userId,
                courseId: requestedCourse
            }).then((res) => {
                courseEntries = res.data;
                let entriesString = "";

                if (courseEntries.message) {
                    entriesString = `<p class="courseMessage">${courseEntries.message}</p>`;
                } else if (courseEntries.error) {
                    router.push({
                        pathname: '/error',
                        query: {error: courseEntries.error}
                    },'/error');
                } else {
                    courseEntries.sort(function(a, b) {
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
                                <div className={"courseButtonEdit"}>
                                    <img src="../../edit.svg" alt="EDIT"/>
                                </div>
                            </div>
                        </div>

                        <div className={"courseMain"} dangerouslySetInnerHTML={{__html: entries}}>

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

