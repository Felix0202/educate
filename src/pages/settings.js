import Header from '../components/header';
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";

export default function Settings() {
    const router = useRouter();

    if (loggedIn) {
        return (
            <>
                <Header></Header>
                <div>
                    <h2>Settings</h2>
                    <p>you are logged in!</p>
                    <p>{userData.userName}</p>
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

