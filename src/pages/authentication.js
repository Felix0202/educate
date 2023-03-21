import Header from '../components/header';
import {useEffect} from "react";
import {useRouter} from "next/router";

export default function Authentication() {
    const router = useRouter();
    if (router.query.authMethod == 2) {
        return (
            <>
                <Header></Header>
                <div className={"authBox"}>
                    <div className={"authBox"}>
                        <h1 className={"authTitle"}>SIGN UP</h1>
                        <p className={"authLabel"}>Username:</p>
                        <input className={"authInput"} type="text"/>
                        <br/><br/>
                        <p className={"authLabel"}>Password:</p>
                        <input className={"authInput"} type="password"/>
                        <br/><br/><br/>
                        <div className={"authButton"} onClick={() => loadShit2()}>
                            Sign up
                        </div>
                        <p>Already have a account? <span className={"authLink"} onClick={(e) => router.push({
                            pathname: '/authentication',
                            query: { authMethod: 1 }
                        }, '/authentication')}>Log in</span></p>

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
                    <input className={"authInput"} type="text"/>
                    <br/><br/>
                    <p className={"authLabel"}>Password:</p>
                    <input className={"authInput"} type="password"/>
                    <br/><br/><br/>
                    <div className={"authButton"}>
                        Log in
                    </div>
                    <p>Don´t have a account yet? <span className={"authLink"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: { authMethod: 2 }
                    }, '/authentication')}>Create one</span></p>
                </div>
            </>
        )
    }
}

function loadShit2() {
    console.log("geh leck 2");
}
