import Header from '../components/header';
import {useRouter} from "next/router";

export default function Error() {
    const router = useRouter();

    return (
        <>
            <Header></Header>
            <div className={"errorBox"}>
                <h2>Error occurred while loading!</h2>
                <hr/>
                <br/>
                <p>Error Message: <span className={"errorMessage"}>{router.query.error}</span></p>
                <br/>
                <p>Please reload / try again later <br/><br/>Get back to <span className={"authLink"}
                                                                               onClick={(e) => router.push({
                                                                                   pathname: '/authentication',
                                                                                   query: {authMethod: 1}
                                                                               }, '/authentication')}>Log in</span></p>
            </div>
        </>
    )

}

