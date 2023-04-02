import Header from '../components/header';
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";
import axios from "axios";

export default function Dashboard() {
    const router = useRouter();

    const example = () => {
        axios.post('/api/checkLoggedIn', {
            authtoken: userData.authtoken,
            userId: userData.userId
        })
            .then((res) => {
                console.log(res.data);
            });
    }

    if (loggedIn) {
        return (
            <>
                <Header></Header>
                <div>
                    <h2>Dashboard</h2>
                    <p>you are logged in!</p>
                    <p>{userData.userName}</p>
                </div>
                <div className={"authButton"} id={"submitButton"} onClick={() => {
                    example();
                }}>Test Login</div>
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

