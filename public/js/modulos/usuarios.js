import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';
import Inputmask from "inputmask";

const empTel = document.getElementById("empTel");
const empTelEdit = document.getElementById("empTelEdit");
const fecCont = document.getElementById("fecCont");
const fecContEdit = document.getElementById("fecContEdit");

const formNewPerfil = document.getElementById('formNewPerfil');
const formEditPerfil = document.getElementById('formEditPerfil');
const formNewUser = document.getElementById('formNewUser');
const formEditUser = document.getElementById('formEditUser');
const formNewEmpleado = document.getElementById('formNewEmpleado');
const formEditEmpleado = document.getElementById('formEditEmpleado');
const formUploadImg = document.getElementById('formUploadImg');

const tblPerfiles = document.querySelector('#tbl-perfiles');
const tblEmpleados = document.querySelector('#tbl-empleados');
const tblUsuarios = document.querySelector('#tbl-usuarios');

(function () {
    /*=============================================
        Data Table Perfiles
    =============================================*/
    if (tblPerfiles) {

        axios.get('/perfiles/all')
            .then(function (respuesta) {

                if (respuesta.data != 'empty') {

                    //console.log(tableLanguage);
                    var dataSet = respuesta.data;
                    //console.log(dataSet);

                    $(tblPerfiles).DataTable({
                        data: dataSet,
                        deferRender: true,
                        iDisplayLength: 25,
                        retrieve: true,
                        processing: true,
                        fixedHeader: true,
                        responsive: true,
                        language: {

                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "oAria": {
                                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }

                        },
                        columns: [{
                            title: "#"
                        },
                        {
                            title: "ID Perfil"
                        },
                        {
                            title: "Perfil"
                        },
                        {
                            title: "Fecha de Creación"
                        },
                        {
                            title: "Estatus"
                        },
                        {
                            title: "Acciones"
                        }
                        ]
                    });

                }
            }).catch(errors => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Error en la Base de Datos'
                })
            })
    }

    /*=============================================
        Data Table Empleados
    =============================================*/
    if (tblEmpleados) {

        axios.get('/empleados/all')
            .then(function (respuesta) {

                var dataSet = respuesta.data;
                //console.log(dataSet);
                if (respuesta.data != 'empty') {
                    $(tblEmpleados).DataTable({
                        data: dataSet,
                        deferRender: true,
                        iDisplayLength: 25,
                        retrieve: true,
                        processing: true,
                        fixedHeader: true,
                        responsive: true,
                        language: {

                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "oAria": {
                                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }

                        },
                        columns: [{
                            title: "#"
                        },
                        {
                            title: "ID Empleado"
                        },
                        {
                            title: "Nombre Completo"
                        },
                        {
                            title: "Correo Electronico"
                        },
                        {
                            title: "Telefono"
                        },
                        {
                            title: "Fecha de Contratación"
                        },
                        {
                            title: "Fecha Alta en Sistema"
                        },
                        {
                            title: "Estatus"
                        },
                        {
                            title: "Acciones"
                        }
                        ]
                    });

                }
            }).catch(errors => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Error en la Base de Datos'
                })
            })
    }

    /*=============================================
        Data Table Usuarios
    =============================================*/
    if (tblUsuarios) {

        axios.get('/usuarios/all')
            .then(function (respuesta) {

                var dataSet = respuesta.data;
                //console.log(dataSet);

                if (respuesta.data != 'empty') {
                    $(tblUsuarios).DataTable({
                        data: dataSet,
                        deferRender: true,
                        iDisplayLength: 25,
                        retrieve: true,
                        processing: true,
                        fixedHeader: true,
                        responsive: true,
                        language: {

                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "oAria": {
                                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }

                        },
                        columns: [{
                            title: "#"
                        },
                        {
                            title: "ID Usuario"
                        },
                        {
                            title: "Usuario"
                        },
                        {
                            title: "Nombre Completo"
                        },
                        {
                            title: "Perfil"
                        },
                        {
                            title: "Fecha de Creación"
                        },
                        {
                            title: "Fecha de Ultimo Login"
                        },
                        {
                            title: "Estatus"
                        },
                        {
                            title: "Acciones"
                        }
                        ]
                    });
                }
            }).catch(errors => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Error en la Base de Datos'
                })
            })
    }

    if (fecCont) {
        $('#fecCont').datepicker({
            format: "dd/mm/yyyy",
            language: 'es',
            //startDate: '+5d',
            endDate: '+0d',
            weekStart: 0,
            autoclose: true,
        });
    }

    if (fecContEdit) {
        $('#fecContEdit').datepicker({
            format: "dd/mm/yyyy",
            language: 'es',
            //startDate: '+5d',
            endDate: '+0d',
            weekStart: 0,
            autoclose: true,
        });

    }

})();

/*=============================================
Crear Perfil
=============================================*/
if (formNewPerfil) {

    formNewPerfil.addEventListener('submit', function (e) {
        e.preventDefault();

        var payload = {};

        var namePerfil = document.getElementById("newPerfil").value;

        payload.perfil = namePerfil;
        payload.fecha_creacion = moment().format('YYYY-MM-DD H:mm:ss');
        payload.status = 1;

        if (payload.perfil == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Es necesario indicar el nombre del Perfil!',
            })
        } else {

            axios.post('/perfiles', payload)
                .then(function (respuesta) {

                    if (respuesta.status === 200) {

                        if (respuesta.data == 'Repetido') {

                            $('#modalAgregarPerfil').modal('dispose');

                            // Alerta
                            Swal.fire(
                                'El perfil ya existe',
                                'El perfil capturado ya existe en la base de datos',
                                'warning'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location = "/perfiles";
                                }
                            });

                        } else {
                            $("#modalAgregarPerfil").remove();
                            // Alerta
                            Swal.fire(
                                'Perfil Creado',
                                respuesta.data,
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location = "/perfiles";
                                }
                            });
                        }
                    }
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo crear el Perfil'
                    })
                })
        }
    })
};

$('#modalAgregarPerfil').on('shown.bs.modal', function () {
    document.getElementById('newPerfil').focus();
});

/*=============================================
Activar/Desactivar Perfiles
=============================================*/
$(document).on("click", "#btn-estatus-perfil", function () {

    var idPerfil = $(this).attr("idPerfil");
    var estadoPerfil = $(this).attr("estadoPerfil");

    var payload = {};

    payload.idPerfil = idPerfil;
    payload.estadoPerfil = estadoPerfil;

    axios.put('/perfiles', payload)
        .then(function (respuesta) {
            if (window.matchMedia("(max-width:767px)").matches) {

                Swal.fire(
                    'Perfil Actualizado',
                    respuesta.data,
                    'success'
                ).then(function (result) {
                    if (result.value) {
                        window.location = "/perfiles";
                    }
                });
            }
        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        })

    if (estadoPerfil == 0) {

        $(this).removeClass('btn-success');
        $(this).addClass('btn-danger');
        $(this).html('Desactivado');
        $(this).attr('estadoPerfil', 1);

    } else {

        $(this).addClass('btn-success');
        $(this).removeClass('btn-danger');
        $(this).html('Activado');
        $(this).attr('estadoPerfil', 0);
    }
});

/*=============================================
Editar Perfil
=============================================*/
$(document).on("click", "#btn-editar-perfil", function () {

    var idPerfil = $(this).attr("idPerfil");

    var route = '/perfiles/' + idPerfil;

    axios.get(route)
        .then(function (respuesta) {

            var idPerfil = respuesta.data[0].idperfil;
            var perfil = respuesta.data[0].perfil;

            $("#editIdPerfil").val(idPerfil);
            $("#editPerfil").val(perfil);

        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        })
});

if (formEditPerfil) {

    formEditPerfil.addEventListener('submit', function (e) {
        e.preventDefault();

        var idPerfil = document.getElementById("editIdPerfil").value;
        var updPerfil = document.getElementById("editPerfil").value;

        var payload = {};

        payload.newPerfil = updPerfil;

        var route = '/perfiles/' + idPerfil;

        axios.put(route, payload)
            .then(function (respuesta) {

                if (respuesta.data == 'Igual') {

                    $('#modalEditarPerfil').modal('dispose');

                    Swal.fire(
                        'Oops...',
                        'No se detectan cambios!',
                        'warning'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/perfiles";
                        }
                    });

                } else {

                    if (respuesta.data == 'Repetido') {

                        $('#modalEditarPerfil').modal('dispose');

                        Swal.fire(
                            'El perfil ya existe',
                            'El perfil ingresado ya existe en la base de datos!',
                            'warning'
                        ).then(function (result) {
                            if (result.value) {
                                window.location = "/perfiles";
                            }
                        });

                    } else {

                        $("#modalEditarPerfil").remove();

                        Swal.fire(
                            'Perfil Actualizado',
                            respuesta.data,
                            'success'
                        ).then(function (result) {
                            if (result.value) {
                                window.location = "/perfiles";
                            }
                        });
                    }
                }
            }).catch(errors => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Error en la Base de Datos'
                })
            })
    })
}

$('#modalEditarPerfil').on('shown.bs.modal', function () {
    document.getElementById('editPerfil').focus();
});

/*=============================================
Eliminar Perfil
=============================================*/
$(document).on("click", "#btn-eliminar-perfil", function () {

    var idPerfil = $(this).attr("idPerfil");

    Swal.fire({
        title: '¿Está seguro de borrar el perfil?',
        text: "¡Si no lo está puede cancelar la acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrar!'
    }).then((result) => {
        if (result.value) {

            var route = '/perfiles/' + idPerfil;

            console.log(route);

            axios.delete(route)
                .then(function (respuesta) {
                    //console.log(respuesta);
                    Swal.fire(
                        'Eliminado!',
                        respuesta.data,
                        'success'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/perfiles";
                        }
                    });

                }).catch(errors => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Error en la Base de Datos'
                    })
                })
        }
    })

});

/*=============================================
Crear Usuario
=============================================*/
if (formNewUser) {

    var payload = {};

    payload.status = 1;

    var perfiles = axios.post('/perfiles/all', payload)
        .then(function (respuesta) {

            var dataPerfil = respuesta.data;

            dataPerfil.forEach(function (valor, indice, array) {

                var idPerfil = valor[1];
                var nombrePerfil = valor[2];

                $("<option />")
                    .attr("value", idPerfil)
                    .html(nombrePerfil)
                    .appendTo("#userPerfil");
            });
        })
    perfiles.then(function () {

        axios.post('/empleados/all', payload)
            .then(function (respuesta) {

                var dataEmpleados = respuesta.data;

                dataEmpleados.forEach(function (valor, indice, array) {

                    var idEmpleado = valor[1];
                    var nombreEmpleado = valor[7];

                    $("<option />")
                        .attr("value", idEmpleado)
                        .html(nombreEmpleado)
                        .appendTo("#userEmpleado");
                });
            })

    }).catch(errors => {
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error',
            text: 'Error en la Base de Datos'
        })
    })


    formNewUser.addEventListener('submit', function (e) {
        e.preventDefault();

        var payload = {};

        var nameUser = document.getElementById("userEmpleado").value;
        var nickUser = document.getElementById("userAlias").value;
        var passUser = document.getElementById("userPass").value;
        var passUser2 = document.getElementById("userPass2").value;
        var perfilUser = document.getElementById("userPerfil").value;
        //var fileUser = document.getElementById("nuevaFoto").value;

        payload.idempleado = nameUser;
        payload.usuario = nickUser;
        payload.passUser = passUser;
        payload.pass_usuario2 = passUser2;
        payload.idperfil = perfilUser;
        payload.status_usuario = 1;
        payload.fecha_creacion = moment().format('YYYY-MM-DD H:mm:ss');
        payload.fecha_ultimologin = null;

        if (payload.idempleado == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Es necesario selecionar el nombre del Usuario!',
            })
        } else {
            if (payload.usuario == "") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Es necesario indicar la clave del Usuario!',
                })
            } else {
                if (payload.passUser == "") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Es necesario indicar la contraseña del Usuario!',
                    })
                } else {
                    if (payload.pass_usuario2 == "") {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: 'Ingrese nuevamente la contraseña del Usuario!',
                        })
                    } else {
                        if (payload.passUser != payload.pass_usuario2) {

                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Las contraseñas no coinciden!',
                            })

                        } else {
                            if (payload.idperfil == "") {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Oops...',
                                    text: 'Es necesario seleccionar el perfil del Usuario!',
                                })
                            } else {
                                axios.post('/usuarios', payload)
                                    .then(function (respuesta) {

                                        if (respuesta.data == 'RepetidoUsuario') {

                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Oops...',
                                                text: 'El usuario ya existe en la base de datos!',
                                            })

                                        } else {

                                            if (respuesta.data == 'RepetidoEmpleado') {

                                                $('#modalAgregarUsuario').modal('dispose');

                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Oops...',
                                                    text: 'El empleado seleccionado ya tiene asignado un usuario!',
                                                })

                                            } else {
                                                // Alerta
                                                Swal.fire(
                                                    'Usuario Creado',
                                                    respuesta.data,
                                                    'success'
                                                ).then(function (result) {
                                                    if (result.value) {
                                                        window.location = "/usuarios";
                                                    }
                                                });
                                            }
                                        }
                                    }).catch(errors => {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Hubo un error',
                                            text: 'Error en la Base de Datos'
                                        })
                                    })
                            }

                        }
                    }

                }
            }
        }

    });
}
/*=============================================
Editar Usuario
=============================================*/
if (formEditUser) {

    const url = window.location.pathname;
    const idUsuario = url.substring(url.lastIndexOf('/') + 1);

    var payload = {};
    payload.status = 1;

    var routeOne = '/usuarios/' + idUsuario;
    var routeTwo = '/perfiles/all';

    const requestOne = axios.get(routeOne);
    const requestTwo = axios.post(routeTwo, payload);

    axios.all([requestOne, requestTwo]).then(axios.spread((...respuesta) => {

        const responseOne = respuesta[0];
        const responseTwo = respuesta[1];

        var nameEmpleado = responseOne.data[0].nombre_completo;
        var idUsuario = responseOne.data[0].idusuario;
        var userName = responseOne.data[0].usuario;
        var perfil = responseOne.data[0].perfil;
        var idperfil = responseOne.data[0].idperfil;

        $("#userEditEmpleado").val(nameEmpleado);
        $("#editIdUsuario").val(idUsuario);
        $("#userEditAlias").val(userName);

        $("<option />")
            .attr("value", idperfil)
            .html(perfil)
            .appendTo("#userEditPerfil");

        var dataPerfiles = responseTwo.data;

        dataPerfiles.forEach(function (valor, indice, array) {

            var idPerf = valor[1];
            var namePerfil = valor[2];

            $("<option />")
                .attr("value", idPerf)
                .html(namePerfil)
                .appendTo("#userEditPerfil");
        })

    })).catch(errors => {
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error',
            text: 'Error en la Base de Datos'
        })
    })


    formEditUser.addEventListener('submit', function (e) {
        e.preventDefault();

        var idUsuario = document.getElementById("editIdUsuario").value;
        var nameUser = document.getElementById("userEditAlias").value;
        var perfilUser = document.getElementById("userEditPerfil").value;

        var payload = {};

        payload.idusuario = idUsuario;
        payload.usuario = nameUser;
        payload.idperfil = perfilUser;

        var route = '/usuarios/' + idUsuario;

        axios.put(route, payload)
            .then(function (respuesta) {

                if (respuesta.data == 'Nulos') {

                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'No se detectaron cambios!',
                    })

                } else {

                    if (respuesta.data == 'UsuarioRep') {

                        Swal.fire(
                            'El usuario ya existe',
                            'El usuario capturado ya esta asociado a otro empleado!',
                            'warning'
                        )

                    } else {

                        Swal.fire(
                            'Usuario Actualizado!',
                            respuesta.data,
                            'success'
                        ).then(function (result) {
                            if (result.value) {
                                window.location = "/usuarios";
                            }
                        });

                    }
                }

            }).catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'No se pudo editar el Usuario'
                })
            })


    })


}

/*=============================================
Crear Empleado
=============================================*/
if (empTel) {

    var im = new Inputmask("(99)99-99-99-99");
    im.mask(empTel);

}

if (formNewEmpleado) {

    formNewEmpleado.addEventListener('submit', function (e) {
        e.preventDefault();

        var empNombre = document.getElementById("empNombre").value;
        var empPat = document.getElementById("empPat").value;
        var empMat = document.getElementById("empMat").value;
        var empEmail = document.getElementById("empEmail").value;
        var empTel = document.getElementById("empTel").value;
        var fecCont = document.getElementById("fecCont").value;

        var payload = {};

        payload.nombre = empNombre;
        payload.ap_paterno = empPat;
        payload.ap_materno = empMat;
        payload.email = empEmail;
        payload.telefono = empTel;
        payload.fecha_contratacion = moment(fecCont, 'DD/MM/YYYY').format('YYYY-MM-DD');

        if (payload.nombre == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Es necesario indicar el Nombre del Empleado!',
            })
        } else {
            if (payload.ap_paterno == "") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Es necesario indicar el Apellido Paterno del Empleado!',
                })
            } else {
                if (payload.ap_materno == "") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Es necesario indicar el Apellido Materno del Empleado!',
                    })
                } else {
                    if (payload.email == "") {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: 'Es necesario indicar el correo electronico del Empleado!',
                        })
                    } else {
                        var mailValido = validarEmail(empEmail);

                        if (mailValido == 0) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Oops...',
                                text: 'Debe de ingresar un correo electronico valido!',
                            })
                        } else {

                            if (payload.telefono == "") {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Oops...',
                                    text: 'Es necesario indicar el número telefónico del Empleado!',
                                })
                            } else {

                                if (payload.fecha_contratacion == "") {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Oops...',
                                        text: 'Es necesario indicar la feha de contratación del Empleado!',
                                    })
                                } else {

                                    payload.nombre_completo = empNombre + ' ' + empPat + ' ' + empMat;
                                    payload.fecha_creacion = moment().format('YYYY-MM-DD H:mm:ss');
                                    payload.status_empleado = 1;

                                    axios.post('/empleados', payload)
                                        .then(function (respuesta) {

                                            if (respuesta.status === 200) {

                                                if (respuesta.data == 'Repetido') {
                                                    // Alerta
                                                    Swal.fire(
                                                        'El empleado ya existe',
                                                        'El empleado capturado ya existe en la base de datos',
                                                        'warning'
                                                    )
                                                } else {
                                                    if (respuesta.data == 'CorreoRep') {
                                                        Swal.fire(
                                                            'El correo ya existe',
                                                            'El correo electrónico capturado ya esta asociado a otro empleado!',
                                                            'warning'
                                                        )
                                                    } else {
                                                        // Alerta
                                                        Swal.fire(
                                                            'Empleado Creado',
                                                            respuesta.data,
                                                            'success'
                                                        ).then(function (result) {
                                                            if (result.value) {
                                                                window.location = "/empleados";
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        })
                                        .catch(() => {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Hubo un error',
                                                text: 'No se pudo crear el Empleado'
                                            })
                                        })

                                }
                            }
                        }
                    }
                }
            }
        }
    })
};


/*=============================================
Activar/Desactivar Empleados
=============================================*/
$(document).on("click", "#btn-estatus-empleado", function () {


    var idEmpleado = $(this).attr("idEmpleado");
    var estadoEmpleado = $(this).attr("estadoEmpleado");

    var payload = {};

    payload.idEmpleado = idEmpleado;
    payload.estadoEmpleado = estadoEmpleado;

    axios.put('/empleados', payload)
        .then(function (respuesta) {
            if (window.matchMedia("(max-width:767px)").matches) {

                Swal.fire(
                    'Empleado Actualizado',
                    respuesta.data,
                    'success'
                ).then(function (result) {
                    if (result.value) {
                        window.location = "/empleados";
                    }
                });
            }
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'No se pudo actualizar el Empleado'
            })
        })

    if (estadoEmpleado == 0) {

        $(this).removeClass('btn-success');
        $(this).addClass('btn-danger');
        $(this).html('Desactivado');
        $(this).attr('estadoEmpleado', 1);

    } else {

        $(this).addClass('btn-success');
        $(this).removeClass('btn-danger');
        $(this).html('Activado');
        $(this).attr('estadoEmpleado', 0);
    }
});

/*=============================================
Editar Empleado
=============================================*/
if (empTelEdit) {
    var im = new Inputmask("(99)99-99-99-99");
    im.mask(empTelEdit);
}

if (formEditEmpleado) {

    const url = window.location.pathname;
    const idEmpleado = url.substring(url.lastIndexOf('/') + 1);

    var route = '/empleados/' + idEmpleado;

    axios.get(route)
        .then(function (respuesta) {

            var idEmpleado = respuesta.data[0].idempleado;
            var nombre = respuesta.data[0].nombre;
            var ap_paterno = respuesta.data[0].ap_paterno;
            var ap_materno = respuesta.data[0].ap_materno;
            var email = respuesta.data[0].email;
            var telefono = respuesta.data[0].telefono;
            var fecha_contratacion = moment(respuesta.data[0].fecha_contratacion).format('DD/MM/YYYY');;

            $("#idEmpleado").val(idEmpleado);
            $("#empNombreEdit").val(nombre);
            $("#empPatEdit").val(ap_paterno);
            $("#empMatEdit").val(ap_materno);
            $("#empEmailEdit").val(email);
            $("#empTelEdit").val(telefono);
            $("#fecContEdit").val(fecha_contratacion);

        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'No se pudo recuperar la información del Empleado'
            }).then(function (result) {
                if (result.value) {
                    window.location = "/empleados";
                }
            });
        });

    formEditEmpleado.addEventListener('submit', function (e) {
        e.preventDefault();

        var idEmpleado = document.getElementById("idEmpleado").value;
        var nombre = document.getElementById("empNombreEdit").value;
        var ap_paterno = document.getElementById("empPatEdit").value;
        var ap_materno = document.getElementById("empMatEdit").value;
        var email = document.getElementById("empEmailEdit").value;
        var telefono = document.getElementById("empTelEdit").value;
        var fecContEdit = document.getElementById("fecContEdit").value;

        var payload = {};

        payload.nombre = nombre;
        payload.ap_paterno = ap_paterno;
        payload.ap_materno = ap_materno;
        payload.email = email;
        payload.telefono = telefono;
        payload.nombre_completo = nombre + ' ' + ap_paterno + ' ' + ap_materno;
        payload.fecha_contratacion = moment(fecContEdit, 'DD/MM/YYYY').format('YYYY-MM-DD');

        var route = '/empleados/' + idEmpleado;

        axios.put(route, payload)
            .then(function (respuesta) {

                if (respuesta.data == 'Nulos') {

                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'No se detectaron cambios!',
                    })

                } else {

                    if (respuesta.data == 'CorreoRep') {

                        Swal.fire(
                            'El correo ya existe',
                            'El correo electrónico capturado ya esta asociado a otro empleado!',
                            'warning'
                        )

                    } else {

                        Swal.fire(
                            'Empleado Actualizado!',
                            respuesta.data,
                            'success'
                        ).then(function (result) {
                            if (result.value) {
                                window.location = "/empleados";
                            }
                        });

                    }
                }

            }).catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'No se pudo actualizar la información del Empleado'
                }).then(function (result) {
                    if (result.value) {
                        window.location = "/empleados";
                    }
                });
            });
    })
}

/*=============================================
Eliminar Empleado
=============================================*/
$(document).on("click", "#btn-eliminar-empleado", function () {

    var idPerfil = $(this).attr("idEmpleado");

    Swal.fire({
        title: '¿Está seguro de elimiar al empleado seleccionado?',
        text: "¡Si no lo está puede cancelar la acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrar!'
    }).then((result) => {
        if (result.value) {

            var route = '/empleados/' + idPerfil;

            console.log(route);

            axios.delete(route)
                .then(function (respuesta) {
                    //console.log(respuesta);
                    Swal.fire(
                        'Eliminado!',
                        respuesta.data,
                        'success'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/empleados";
                        }
                    });

                }).catch(errors => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Error en la Base de Datos'
                    })
                })
        }
    })

});

/*=============================================
SUBIENDO LA FOTO DEL USUARIO
=============================================*/
$("#nuevaFoto").change(function () {

    var imagen = this.files[0];

    /*=============================================
        VALIDAMOS EL FORMATO DE LA IMAGEN SEA JPG O PNG
        =============================================*/

    if (imagen["type"] != "image/jpeg" && imagen["type"] != "image/png") {

        $(".nuevaFoto").val("");

        swal({
            title: "Error al subir la imagen",
            text: "¡La imagen debe estar en formato JPG o PNG!",
            type: "error",
            confirmButtonText: "¡Cerrar!"
        });

    } else if (imagen["size"] > 2000000) {

        $(".nuevaFoto").val("");

        swal({
            title: "Error al subir la imagen",
            text: "¡La imagen no debe pesar más de 2MB!",
            type: "error",
            confirmButtonText: "¡Cerrar!"
        });

    } else {

        var datosImagen = new FileReader;
        datosImagen.readAsDataURL(imagen);

        $(datosImagen).on("load", function (event) {

            var rutaImagen = event.target.result;

            $(".previsualizar").attr("src", rutaImagen);

        })

    }
});

$(document).on("click", "#btnCancelAgregarUser", function () {
    window.location = "/usuarios";
});

/*=============================================
Activar/Desactivar Usuarios
=============================================*/
$(document).on("click", "#btn-estatus-usuario", function () {

    var idUsuario = $(this).attr("idUsuario");
    var estadoUsuario = $(this).attr("estadoUsuario");

    var payload = {};

    payload.idUsuario = idUsuario;
    payload.estadoUsuario = estadoUsuario;

    console.log(payload);

    axios.put('/usuarios', payload)
        .then(function (respuesta) {
            if (window.matchMedia("(max-width:767px)").matches) {

                Swal.fire(
                    'Usuario Actualizado',
                    respuesta.data,
                    'success'
                ).then(function (result) {
                    if (result.value) {
                        window.location = "/usuarios";
                    }
                });
            }
        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        })

    if (estadoUsuario == 0) {

        $(this).removeClass('btn-success');
        $(this).addClass('btn-danger');
        $(this).html('Desactivado');
        $(this).attr('estadoUsuario', 1);

    } else {

        $(this).addClass('btn-success');
        $(this).removeClass('btn-danger');
        $(this).html('Activado');
        $(this).attr('estadoUsuario', 0);
    }
});


/*=============================================
Eliminar Usuarios
=============================================*/
$(document).on("click", "#btn-eliminar-usuario", function () {

    var idUsuario = $(this).attr("idUsuario");

    Swal.fire({
        title: '¿Está seguro de eliminar al usuario?',
        text: "¡Si no lo está puede cancelar la acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrar!'
    }).then((result) => {
        if (result.value) {

            var route = '/usuarios/' + idUsuario;

            axios.delete(route)
                .then(function (respuesta) {
                    //console.log(respuesta);
                    Swal.fire(
                        'Eliminado!',
                        respuesta.data,
                        'success'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/usuarios";
                        }
                    });

                }).catch(errors => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Error en la Base de Datos'
                    })
                })
        }
    })

});

/*=============================================
SUBIENDO LA FOTO DEL EMPLEADO
=============================================*/
$("#imgEmpleado").change(function () {

    var imagen = this.files[0];

    /*=============================================
        VALIDAMOS EL FORMATO DE LA IMAGEN SEA JPG O PNG
        =============================================*/

    if (imagen["type"] != "image/jpeg" && imagen["type"] != "image/png") {

        $("#imgEmpleado").val("");

        swal({
            title: "Error al subir la imagen",
            text: "¡La imagen debe estar en formato JPG o PNG!",
            type: "error",
            confirmButtonText: "¡Cerrar!"
        });

    } else if (imagen["size"] > 2000000) {

        $("#imgEmpleado").val("");

        swal({
            title: "Error al subir la imagen",
            text: "¡La imagen no debe pesar más de 2MB!",
            type: "error",
            confirmButtonText: "¡Cerrar!"
        });

    } else {

        var datosImagen = new FileReader;
        datosImagen.readAsDataURL(imagen);

        $(datosImagen).on("load", function (event) {

            var rutaImagen = event.target.result;

            $("#previsualizar").attr("src", rutaImagen);

        })

    }
})

/*=============================================
Subir/Cambiar Imagen
=============================================*/
$(document).on("click", "#btn-imagen-empl", function () {

    var idEmpleado = $(this).attr("idEmpleado");

    $("#idEmpleado").val(idEmpleado);

    var route = '/empleados/route_imagen/' + idEmpleado;

    axios.get(route)
        .then(function (respuesta) {

            console.log(respuesta.data);
            if(respuesta.data != 'empty'){
                
                var rutaImagen = '/empleados/imagen/' + respuesta.data;

                $("#previsualizar").attr("src", rutaImagen);

            }

        })

});

if (formUploadImg) {

    formUploadImg.addEventListener('submit', function (e) {
        e.preventDefault();

        const idEmpleado = document.getElementById('idEmpleado').value;
        const file = document.querySelector('#imgEmpleado').files[0];

        const formData = new FormData();

        formData.append('idEmpleado', idEmpleado);
        formData.append('file', file);

        uploadFile(formData);

    })
}

const uploadFile = (formData) => {

    axios.post('/empleados/uploadImg', formData)
        .then(function (respuesta) {

            if (respuesta.data) {

                $('#modalSubirImagen').modal('dispose');

                Swal.fire(
                    'Imágen Actualizada!',
                    respuesta.data,
                    'success'
                ).then(function (result) {
                    if (result.value) {
                        window.location = "/empleados";
                    }
                });    

            }
        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        }).then(function (result) {
            if (result.value) {
                window.location = "/empleados";
            }
        }); 

};

/*=============================================
FUNCIONES
=============================================*/
function validarEmail(elemento) {

    var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (!regex.test(elemento)) {
        return 0;
    } else {
        return 1
    }

}

