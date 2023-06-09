import Header from '../components/header';
import {useRouter} from "next/router";
import axios from "axios";
//import {forgotAuth, signUp, logIn} from "@/scripts/loadFunctions";

export let loggedIn = false;

export let userData = {
    userName: '',
    email: '',
    password: ''
}

export default function Authentication() {
    const router = useRouter();

    const logIn = () => {
        userData.userName = document.getElementById('userName').value.trim();
        userData.password = document.getElementById('password').value;

        axios.post('/api/login', {
            username: userData.userName,
            password: userData.password
        }).then((res) => {
            if (res.data[0] && res.data[0].userId) {
                userData = res.data[0];
                loggedIn = true;
                delete userData['password'];
                router.push('/dashboard');
            } else if (res.data.message) {
                document.getElementById("authMessage").innerHTML = `<p style="color: red">${res.data.message}</p><br>`;
            } else {
                router.push({
                    pathname: '/error',
                    query: {error: res.data.error}
                }, '/error');
            }
        })
    }

    const forgotAuth = () => {
        alert("forgot not yet implemented");
    }

    const signUp = () => {
        userData.userName = document.getElementById('userName').value.trim();
        userData.email = document.getElementById('eMail').value.trim();
        userData.password = document.getElementById('password').value;
        userData.name = document.getElementById('name').value.trim();

        let body = {
            username: userData.userName,
            password: userData.password,
            email: userData.email,
            name: userData.name
        }

        // req to server.js
        axios.post('/api/newUser', body).then((res) => {
            if (res.data[0] && res.data[0].userId) {
                userData = res.data[0];
                loggedIn = true;
                delete userData['password'];
                router.push('/dashboard');
            } else if (res.data.message) {
                document.getElementById("authMessage").innerHTML = `<p style="color: red">${res.data.message}</p><br>`;
            } else {
                router.push({
                    pathname: '/error',
                    query: {error: res.data.error}
                }, '/error');
            }
        })
    }

    const printLoggedIn = () => {
        alert(`${loggedIn}`);
    }

    if (router.query.authMethod == 2) {
        return (
            <>
                <Header></Header>
                <div className={"authBox"}>
                    <div className={"authBox"}>
                        <h1 className={"authTitle"}>SIGN UP</h1>
                        <p className={"authLabel"}>Username:</p>
                        <input className={"authInput"} id={'userName'} type="text"/>
                        <br/><br/>
                        <p className={"authLabel"}>Name:</p>
                        <input className={"authInput"} id={'name'} type="text"/>
                        <br/><br/>
                        <p className={"authLabel"}>Email:</p>
                        <input className={"authInput"} id={'eMail'} type="email"/>
                        <br/><br/>
                        <p className={"authLabel"}>Password:</p>
                        <input className={"authInput"} id={'password'} type="password"/>
                        <br/><br/><br/>
                        <div id={"authMessage"}></div>
                        <div className={"authButton"} id={"submitButton"} onClick={() => {
                            signUp();
                        }}>
                            Sign up
                        </div>
                        <p>Already have a account? <span className={"authLink"} onClick={(e) => router.push({
                            pathname: '/authentication',
                            query: {authMethod: 1}
                        }, '/authentication')}>Log in</span></p>
                    </div>
                </div>
            </>
        )
    } else if (router.query.authMethod == 3) {
        return (
            <>
                <Header></Header>
                <div className={"authBox"}>
                    <h1 className={"authTitle"}>Forgot Username/Password <br/><span>(Not working yet)</span></h1>
                    <p className={"authLabel"}>Email:</p>
                    <input className={"authInput"} id={'eMail'} type="text"/>
                    <br/><br/>
                    <div id={"authMessage"}></div>
                    <div className={"authButton"} id={"submitButton"} onClick={() => {
                        forgotAuth();
                    }}>
                        Send Email
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <Header></Header>
                <div className={"authBox"}>
                    <h1 className={"authTitle"}>LOG IN</h1>
                    <p className={"authLabel"}>Username:</p>
                    <input className={"authInput"} id={'userName'} type="text"/>
                    <br/><br/>
                    <p className={"authLabel"}>Password:</p>
                    <input className={"authInput"} id={'password'} type="password"/>
                    <br/><br/><br/>
                    <div id={"authMessage"}></div>
                    <div className={"authButton"} id={"submitButton"} onClick={() => {
                        logIn();
                    }}>
                        Log in
                    </div>
                    <p>Don´t have a account yet? <span className={"authLink"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: {authMethod: 2}
                    }, '/authentication')}>Create one</span></p>
                    <p><span className={"authLink"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: {authMethod: 3}
                    }, '/authentication')}>Forgot Username/Password?</span></p>
                </div>
            </>
        )
    }
}