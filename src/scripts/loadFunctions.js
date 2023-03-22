import {remove} from "next/dist/build/webpack/loaders/resolve-url-loader/lib/file-protocol";

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
    alert('Username: ' + userData.userName + ' Password: ' + userData.password);

    // req to server

    delete userData['password'];
    loggedIn = true;
}

export const signUp = () => {
    userData.userName = document.getElementById('userName').value;
    userData.email = document.getElementById('eMail').value;
    userData.password = document.getElementById('password').value;
    alert('Username: ' + userData.userName + ' Password: ' + userData.password + ' Email: ' + userData.email);

    // req to server


    delete userData['password'];
    console.log(userData);
}

export const printLoggedIn = () => {
    alert(`${loggedIn}`);
}
