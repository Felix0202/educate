import Header from '../components/header';
import {loggedIn, forgotAuth, logIn, printLoggedIn} from "@/scripts/loadFunctions";
import Authentication from "@/pages/authentication";
import { redirect } from 'next/navigation';

export default function Dashboard() {
    if (loggedIn) {
        return (
            <>
                <Header></Header>
                <div>
                    <h2>Dashboard</h2>
                </div>
            </>
        )
    }

}

export const getServerSideProps = async () => {
    console.log(loggedIn)
    if (!loggedIn){
        return {
            redirect: {
                destination: '/authentication',
                permanent: false,
            }
        };
    } else {
        return {props: {}};
    }
};