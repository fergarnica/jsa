import axios from 'axios';
import Swal from 'sweetalert2';

const body = document.body;
const pagLogin = document.getElementById("login");

const divContent = document.getElementById("content");
const divError = document.getElementById("error-notfound");
const divErrorUn = document.getElementById("error-unauthorized");

if (pagLogin) {
    body.classList.add("login-page");
    divContent.classList.remove("wrapper");
    divContent.classList.add("login-box");
}

if(divError){
    body.classList.add("sidebar-collapse");
}

if(divErrorUn){
    body.classList.add("sidebar-collapse");
}