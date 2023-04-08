import Header from '../components/header';
import {loggedIn, userData} from "@/pages/authentication";
import {useRouter} from "next/router";

export default function Error() {
    const router = useRouter();

    return (
        <>
            <Header></Header>
            <div>
                <h2>Error occurred while loading!</h2>
                <p>Error Message: {router.query.error}</p>
                <p>Pleasy reload the page and try again later!</p>
            </div>
        </>
    )

}

