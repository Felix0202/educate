import Header from '../components/header';
import {useEffect} from "react";
import {useRouter} from "next/router";
import {forgotAuth, signUp, logIn} from "@/scripts/loadFunctions";

export default function Authentication() {
    const router = useRouter();

    let userName = '';

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
                        <p className={"authLabel"}>Email:</p>
                        <input className={"authInput"} id={'eMail'} type="email"/>
                        <br/><br/>
                        <p className={"authLabel"}>Password:</p>
                        <input className={"authInput"} id={'password'} type="password"/>
                        <br/><br/><br/>
                        <div className={"authButton"} onClick={() => {
                            signUp();
                        }}>
                            Sign up
                        </div>
                        <p>Already have a account? <span className={"authLink"} onClick={(e) => router.push({
                            pathname: '/authentication',
                            query: { authMethod: 1, userName: '' }
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
                    <h1 className={"authTitle"}>Forgot Username/Password</h1>
                    <p className={"authLabel"}>Email:</p>
                    <input className={"authInput"} id={'eMail'} type="text"/>
                    <br/><br/>
                    <div className={"authButton"} onClick={() => {
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
                    <div className={"authButton"} onClick={() => {
                        logIn();
                    }}>
                        Log in
                    </div>
                    <p>Don´t have a account yet? <span className={"authLink"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: { authMethod: 2 }
                    }, '/authentication')}>Create one</span></p>
                    <p><span className={"authLink"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: { authMethod: 3 }
                    }, '/authentication')}>Forgot Username/Password?</span></p>
                </div>
            </>
        )
    }
}