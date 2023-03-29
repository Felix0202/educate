import axios from "axios";
import {redirect} from "next/navigation";
import {useRouter} from "next/router";
export let loggedIn = false;

export let userData = {
    userName: '',
    email: '',
    password: ''
}

export const forgotAuth = () => {
    alert("forgot");
}

export const logIn = () => {
    userData.userName = document.getElementById('userName').value;
    userData.password = document.getElementById('password').value;

    axios.post('/api/login', {
        username: userData.userName,
        password: userData.password
    }).then ((res) => {
        if (res.data[0] && res.data[0].userId) {
            userData = res.data[0];
            loggedIn = true;
            printLoggedIn();
        } else {
            console.log(res.data);
            console.log("Not worked");
        }
        delete userData['password'];
        console.log(userData);
    })
}

export const signUp = () => {
    userData.userName = document.getElementById('userName').value;
    userData.email = document.getElementById('eMail').value;
    userData.password = document.getElementById('password').value;
    userData.name = document.getElementById('name').value;

    // req to server.js
    axios.post('/api/newUser', {
        username: userData.userName,
        email: userData.email,
        password: userData.password,
        name: userData.name}).then ((res) => {
        if (res.data[0] && res.data[0].userId) {
            userData = res.data[0];
            loggedIn = true;
            return false;
        } else {
            console.log(res.data);
            console.log("Not worked");
            return true;
        }
        delete userData['password'];
        console.log(userData);
    })
}

export const printLoggedIn = () => {
    alert(`${loggedIn}`);
}
