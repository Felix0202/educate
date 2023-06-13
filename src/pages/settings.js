import Header from '../components/header';
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";
import Entry from "@/components/Entry";
import axios from "axios";

export default function Settings() {
    const router = useRouter();

    console.log(userData)


    const saveData = (dataCat) => { // 0 -> Name, 1 -> email, 2 -> password
        let newText = document.getElementById("settingsInput" + dataCat).value;
        console.log(dataCat)
        console.log(newText)
        axios.post('/api/saveUserData', {
            authtoken: userData.authtoken,
            userId: userData.userId,
            dataCat: dataCat,
            text: newText
        }).then((res) => {
            if (res.data.error) {
                router.push({
                    pathname: '/error',
                    query: {error: res.data.error}
                }, '/error');
            } else {
                if (dataCat == 0) {
                    userData.name = newText;
                } else if (dataCat == 1) {
                    userData.email = newText;
                }
                document.getElementById("settingsSave" + dataCat).innerHTML = res.data.message;
                document.getElementById("settingsSave" + dataCat).classList.add("fadeOutClass");
                setTimeout(() => {
                    if (document.getElementById("settingsSave" + dataCat)) {
                        document.getElementById("settingsSave" + dataCat).style.visibility = "hidden";
                        setTimeout(() => {
                            if (document.getElementById("settingsSave" + dataCat)) {
                                document.getElementById("settingsSave" + dataCat).classList.remove("fadeOutClass");
                                document.getElementById("settingsSave" + dataCat).innerHTML = "SAVE";
                            }
                        }, 500)
                    }
                }, 1200);
            }
        });
    }

    if (loggedIn) {
        return (
            <>
                <Header></Header>
                <div className={"mainSettings"}>
                    <h1 className={"authTitle"}>SETTINGS</h1>
                    <div>
                        <p>Username:</p>
                        <p className={"settingsValue"}>{userData.username}</p>
                    </div>
                    <div>
                        <p>Name:</p>
                        <div className={"flexbox"}>
                            <input type="text" className={"settingsInput"} id={"settingsInput0"} defaultValue={userData.name}  onClick={() => {
                                document.getElementById("settingsSave0").style.visibility = "visible";
                            }}/>
                            <button className={"buttonSettingsSave"} id={"settingsSave0"} onClick={() => {
                                saveData(0)
                            }}>SAVE</button>
                        </div>
                    </div>
                    <div>
                        <p>Email:</p>
                        <div className={"flexbox"}>
                            <input type="text" className={"settingsInput"} id={"settingsInput1"} defaultValue={userData.email}   onClick={() => {
                                document.getElementById("settingsSave1").style.visibility = "visible";
                            }}/>
                            <button className={"buttonSettingsSave"} id={"settingsSave1"} onClick={() => {
                                saveData(1)
                            }}>SAVE</button>
                        </div>
                    </div>
                    <div>
                        <p>Password:</p>
                        <div className={"flexbox"}>
                            <input type="text" className={"settingsInput"} id={"settingsInput2"} placeholder={"********"}   onClick={() => {
                                document.getElementById("settingsSave2").style.visibility = "visible";
                            }}/>
                            <button className={"buttonSettingsSave"} id={"settingsSave2"} onClick={() => {
                                saveData(2)
                            }}>SAVE</button>
                        </div>
                    </div>
                </div>
            </>
        )
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

