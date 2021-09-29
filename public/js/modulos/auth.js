import axios from 'axios';
import Swal from 'sweetalert2';

const body = document.body;
const pagLogin = document.getElementById("login");
const pagReset = document.getElementById("reset");
const pagnewPass = document.getElementById("new-password");

const divContent = document.getElementById("content");
const divError = document.getElementById("error-notfound");
const divErrorUn = document.getElementById("error-unauthorized");

const formChangePass = document.getElementById('formChangePass');


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

if (pagnewPass) {
    body.classList.add("login-page");
    divContent.classList.remove("wrapper");
    divContent.classList.add("login-box");

    pagnewPass.addEventListener('submit', function (e) {
        e.preventDefault();

        const url = window.location.pathname;
        const idToken = url.substring(url.lastIndexOf('/') + 1);

        const route = '/restablecer/' + idToken;

        var payload = {};
        var newPassword = document.getElementById("reset-pass").value;

        payload.newPassword = newPassword;

        if (payload.newPassword == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Es necesario ingresar la nueva contraseña!',
            })
        } else {

            axios.post(route, payload)
                .then(function (respuesta) {

                    if (respuesta.data == 'Expiro') {

                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: 'El enlace ha expirado!',
                        })


                    } else {

                        Swal.fire(
                            respuesta.data,
                            'La contraseña se ha actualizado correctamente!',
                            'success'
                        ).then(function (result) {
                            if (result.value) {
                                window.location = "/signin";
                            }
                        });


                    }
                }).catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Error en la base de datos'
                    })
                })
        }
    })
}

if (formChangePass) {

    formChangePass.addEventListener('submit', function (e) {
        e.preventDefault();

        var payload = {};

        var nickUser = document.getElementById("usuarioName").value;
        var passUser = document.getElementById("passActual").value;
        var newPass = document.getElementById("nuevoPass").value;
        var newPass2 = document.getElementById("nuevoPass2").value;

        payload.nickUser = nickUser;
        payload.passUser = passUser;
        payload.newPass = newPass;
        payload.newPass2 = newPass2;

        if (payload.passUser == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Es necesario ingresar la contraseña actual!',
            })
        } else {
            if (payload.newPass == "") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Es necesario ingresar la nueva contraseña!',
                })
            } else {
                if (payload.newPass2 == "") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Es necesario repetir la nueva contraseña!',
                    })
                } else {
                    if (payload.newPass != payload.newPass2) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Las contraseñas no coinciden!',
                        })

                    } else {

                        axios.put('/cambiar_password', payload)
                            .then(function (respuesta) {

                                if (respuesta.data == "Inexistente") {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'El usuario no existe',
                                    })
                                } else {
                                    if (respuesta.data == "Incorrecta") {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: 'La contraseña actual es incorrecta!',
                                        })
                                    }else{
                                        if(respuesta.data == "Igual"){
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Oops...',
                                                text: 'La contraseña nueva debe ser diferente a la actual!',
                                            })
                                        }else{
                                            Swal.fire(
                                                respuesta.data,
                                                'La contraseña se ha actualizado correctamente!',
                                                'success'
                                            ).then(function (result) {
                                                if (result.value) {
                                                    window.location = "/";
                                                }
                                            });
                                        }
                                    }
                                }
                            }).catch(() => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Hubo un error',
                                    text: 'Error en la base de datos'
                                })
                            })
                    }
                }
            }
        }
    })
}