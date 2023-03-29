import Header from '../components/header';
import {loggedIn} from "@/pages/authentication";
import {useRouter} from "next/router";

export default function Dashboard() {
    const router = useRouter();

    if (loggedIn) {
        return (
            <>
                <Header></Header>
                <div>
                    <h2>Dashboard</h2>
                    <p>you are logged in!</p>
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

