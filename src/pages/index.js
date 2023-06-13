import Header from '../components/header';
import {router} from "next/client";

export default function Home() {
    return (
        <>
            <Header></Header>
            <div className={"mainSettings"}>
                <h1 className={"aboutTextBox"}>ABOUT - Functions</h1>
                <br/>
                <div className={"flexbox"}>
                    <div>
                        <img src="./demo_dashboard.png" alt="course" className={"aboutIMG"}/>
                    </div>
                    <div className={"aboutTextBox"}>
                        <br/>
                        <h2>Dashboard</h2>
                        <br/>
                        <p>
                            In the Dashboard you are always able to have a quick overview of all you courses and the
                            major information of them.
                        </p>
                    </div>
                </div>
                <div className={"flexbox"}>

                    <div className={"aboutTextBox"}>
                        <br/>
                        <h2>Courses</h2>
                        <br/>
                        <p>In the course - view you can edit the course, add entries or simple look and learn.</p>
                    </div>
                    <div>
                        <img src="./demo_course.png" alt="course" className={"aboutIMG"}/>
                    </div>
                </div>
                <div className={"flexbox"}>
                    <div>
                        <img src="./demo_settings.png" alt="course" className={"aboutIMG"}/>
                    </div>
                    <div className={"aboutTextBox"}>
                        <br/>
                        <h2>Settings</h2>
                        <br/>
                        <p>In the settings you can see and change information about you account.</p>
                    </div>
                </div>
                <div className={"aboutTextBox100"}>
                    <h3>This is a school Project - Made by Felix Wimberger</h3>
                </div>

            </div>
        </>
    )
}
