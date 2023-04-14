import {useRouter} from "next/router";
import {loggedIn, userData} from "@/pages/authentication";
import Link from "next/link";

export default function header() {
    const router = useRouter();

    if (loggedIn) {
        return (
            <>
                <header>
                    <div onClick={(e) => router.push("../")}>
                        <h1 className={"headerTitle"}><span className={"headerTitleE"}>E</span>ducate</h1>
                    </div>

                    <div className={"headerNav"}>
                        <Link className={"headerLink"} href="../">ABOUT</Link>
                        <Link className={"headerLink"} href="../dashboard">DASHBOARD</Link>
                        <Link className={"headerAccount"} href="../settings">
                            <img id={"headerSettings"} src="../../settings.svg" alt=""/>
                            {userData.name}
                        </Link>
                    </div>
                </header>
            </>
        )
    } else {
        return (
            <>
                <header>
                    <div onClick={(e) => router.push("../")}>
                        <h1 className={"headerTitle"}><span className={"headerTitleE"}>E</span>ducate</h1>
                    </div>

                    <div className={"headerNav"}>
                        <Link className={"headerLink"} href="../">ABOUT</Link>
                        <Link className={"headerLink"} href="../dashboard">DASHBOARD</Link>
                        <Link className={"headerLogIn headerButton"} href={{
                            pathname: '/authentication',
                            query: {authMethod: 1}
                        }}>LOG IN
                        </Link>
                        <Link className={"headerSignIn headerButton"} href={{
                            pathname: '/authentication',
                            query: {authMethod: 2}
                        }}>SIGN UP
                        </Link>
                    </div>
                </header>
            </>
        )
    }
}