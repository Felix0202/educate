import {useRouter} from "next/router";

export default function header() {
    const router = useRouter();
    return (
        <>
            <header>
                <div onClick={(e) => router.push("../")}>
                    <h1 className={"headerTitle"}><span className={"headerTitleE"}>E</span>ducate</h1>
                </div>

                <div className={"headerNav"}>
                    <a className={"headerLink"} href="../">ABOUT</a>
                    <a className={"headerLink"} href="../dashboard">DASHBOARD</a>
                    <div className={"headerLogIn headerButton"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: { authMethod: 1 }
                    }, '/authentication')}>LOG IN</div>
                    <div className={"headerSignIn headerButton"} onClick={(e) => router.push({
                        pathname: '/authentication',
                        query: { authMethod: 2 }
                    }, '/authentication')}>SIGN UP</div>
                </div>
            </header>
        </>
    )
}