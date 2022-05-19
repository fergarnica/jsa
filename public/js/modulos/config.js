import axios from 'axios';
import Swal from 'sweetalert2';

const searchPermisos = document.getElementById('searchPermisos');
const searchPermisosxUser = document.getElementById('searchPermisosxUser');

const formEmpresa = document.getElementById('form-empresa');
const formNewOficina = document.getElementById('formNewOficina');
const formEditOficina = document.getElementById('formEditOficina');
const formNewVerif = document.getElementById('formNewVerif');
const formEditVerif = document.getElementById('formEditVerif');

const verifTel = document.getElementById('verifTel');
const verifEditTel = document.getElementById('verifEditTel');

const tblOficinas = document.querySelector('#tbl-oficinas');
const tblVerif = document.querySelector('#tbl-verificadores');

(function () {

    if (formEmpresa) {

        axios.get('/empresa/all')
            .then(function (respuesta) {

                if (respuesta.data != 'Empty') {

                    var nombreEmpresa = respuesta.data[0].nombre_empresa;
                    var razonSocial = respuesta.data[0].razon_social;
                    var webSite = respuesta.data[0].web_site;

                    $("#nameEmpresa").val(nombreEmpresa);
                    $("#razonSocial").val(razonSocial);
                    $("#webSite").val(webSite);

                }
            }).catch(errors => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Error en la Base de Datos'
                })
            })
    }

    if (tblOficinas) {

        axios.get('/oficinas/all')
            .then(function (respuesta) {

                if (respuesta.data != 'empty') {

                    var dataSet = respuesta.data;

                    $(tblOficinas).DataTable({
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
                            title: "ID Oficina"
                        },
                        {
                            title: "Oficina"
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

    if (tblVerif) {

        axios.get('/verificadores/all')
            .then(function (respuesta) {

                if (respuesta.data != 'empty') {

                    var dataSet = respuesta.data;

                    $(tblVerif).DataTable({
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
                            title: "ID verificador"
                        },
                        {
                            title: "Nombre"
                        },
                        {
                            title: "Email"
                        },
                        {
                            title: "Telefono"
                        },
                        {
                            title: "Fecha de alta"
                        },
                        {
                            title: "Estatus"
                        }
                        ]
                    });

                }

            })

    }

})();

if (formEmpresa) {

    formEmpresa.addEventListener('submit', function (e) {
        e.preventDefault();

        var payload = {};

        var nombreEmpresa = document.getElementById("nameEmpresa").value;
        var razonSocial = document.getElementById("razonSocial").value;
        var webSite = document.getElementById("webSite").value;

        if (nombreEmpresa == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Es necesario indicar el nombre de la empresal!',
            })
        } else {
            if (razonSocial == "") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Es necesario indicar la razón social de la empresal!',
                })

            } else {

                payload.nombre_empresa = nombreEmpresa;
                payload.razon_social = razonSocial;
                payload.web_site = webSite;

                axios.post('/empresa', payload)
                    .then(function (respuesta) {

                        if (respuesta.data == 'Creado') {

                            Swal.fire(
                                'Empresa Creada',
                                'La información de la empresa se guardó correctamente!',
                                'success'
                            ).then(function (result) {
                                if (result.value) {
                                    window.location = "/empresa";
                                }
                            });

                        } else {
                            if (respuesta.data == 'Actualizado') {

                                Swal.fire(
                                    'Empresa Editada',
                                    'La información de la empresa se editó correctamente!',
                                    'success'
                                ).then(function (result) {
                                    if (result.value) {
                                        window.location = "/empresa";
                                    }
                                });

                            } else {

                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Oops...',
                                    text: 'No se detectaron cambios!'
                                })
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
    })

}

if (searchPermisos) {

    var payload = {};

    payload.status = 1;

    axios.post('/perfiles/all', payload)
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

    searchPermisos.addEventListener('submit', function (e) {
        e.preventDefault();

        $('#btnSearchPermisos').html('<span id="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Buscando...').addClass('disabled');

        $('#tbl-perm-perfil').DataTable().destroy();
        $("#tbl-perm-perfil").remove();

        var perfilUser = document.getElementById("userPerfil").value;

        var route = '/permiso_x_perfil/' + perfilUser;

        axios.get(route)
            .then(function (respuesta) {

                $('#btnSearchPermisos').html('<i class="fa fa-search"></i> Consultar').removeClass('disabled');

                $("#bodyPermPerfil").append(
                    '<table id="tbl-perm-perfil" class="display table-bordered table-striped dt-responsive text-center" cellspacing="0" style="width:100%"> </table>'
                );

                const tblPermPerfil = document.querySelector('#tbl-perm-perfil');

                if (tblPermPerfil) {
                    var dataSet = respuesta.data;

                    $(tblPermPerfil).DataTable({
                        data: dataSet,
                        deferRender: true,
                        iDisplayLength: 50,
                        retrieve: true,
                        processing: true,
                        fixedHeader: true,
                        responsive: true,
                        searching: false,
                        columnDefs: [{
                            targets: "_all",
                            sortable: false
                        }],
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
                        createdRow: function (row, data, dataIndex) {
                            var idpadre = data[4];
                            //Pintar toda la columna
                            if (idpadre == 0) {
                                $('td', row).css('background-color', '#D6EAF8');
                                $(row).find('td:eq(2)').css('font-weight', 'bold');
                            }
                        },
                        columns: [{
                            title: "Orden"
                        },
                        {
                            title: "ID Menú"
                        },
                        {
                            title: "Menú"
                        },
                        {
                            title: "Acceso"
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
    })
}

$("#userPerfil").change(function () {

    $('#tbl-perm-perfil').DataTable().destroy();
    $("#tbl-perm-perfil").remove();

});

$(document).on("change", ".checkAcceso", function () {

    var idCheck = null;
    var idMenu = $(this).attr("idMenu");
    var idCheck = $(this).attr('id');
    var idPerfil = document.getElementById('userPerfil').value;
    var payload = {};

    const checkAcceso = document.getElementById(idCheck);

    if (checkAcceso.checked == true) {
        var acceso = 1;
    } else {
        var acceso = 0;
    }

    payload.idmenu = idMenu;
    payload.idperfil = idPerfil;
    payload.acceso = acceso;

    axios.put('/permiso_x_perfil', payload)
        .then(function (respuesta) {

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cambios guardados!',
                showConfirmButton: false,
                timer: 1000
            })

        })

});

if (searchPermisosxUser) {
    var payload = {};

    payload.status = 1;

    axios.post('/usuarios/all', payload)
        .then(function (respuesta) {

            var dataUsuario = respuesta.data;

            dataUsuario.forEach(function (valor, indice, array) {

                var idUsuario = valor[1];
                var nombreUsuario = valor[2];

                $("<option />")
                    .attr("value", idUsuario)
                    .html(nombreUsuario)
                    .appendTo("#userName");
            });
        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        })

    searchPermisosxUser.addEventListener('submit', function (e) {
        e.preventDefault();

        $('#btnPermisosxUser').html('<span id="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Buscando...').addClass('disabled');

        $('#tbl-perm-user').DataTable().destroy();
        $("#tbl-perm-user").remove();

        var nameUser = document.getElementById("userName").value;

        var route = '/permiso_x_usuario/' + nameUser;

        axios.get(route,)
            .then(function (respuesta) {

                $('#btnPermisosxUser').html('<i class="fa fa-search"></i> Consultar').removeClass('disabled');

                $("#bodyPermUser").append(
                    '<table id="tbl-perm-user" class="display table-bordered table-striped dt-responsive text-center" cellspacing="0" style="width:100%"> </table>'
                );

                const tblPermUser = document.querySelector('#tbl-perm-user');

                if (tblPermUser) {
                    var dataSet = respuesta.data;

                    $(tblPermUser).DataTable({
                        data: dataSet,
                        deferRender: true,
                        iDisplayLength: 50,
                        retrieve: true,
                        processing: true,
                        fixedHeader: true,
                        responsive: true,
                        searching: false,
                        columnDefs: [{
                            targets: "_all",
                            sortable: false
                        }],
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
                        createdRow: function (row, data, dataIndex) {
                            var idpadre = data[4];
                            //Pintar toda la columna
                            if (idpadre == 0) {
                                $('td', row).css('background-color', '#D6EAF8');
                                $(row).find('td:eq(2)').css('font-weight', 'bold');
                            }
                        },
                        columns: [{
                            title: "Orden"
                        },
                        {
                            title: "ID Menú"
                        },
                        {
                            title: "Menú"
                        },
                        {
                            title: "Acceso"
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

    })
}

$("#userName").change(function () {

    $('#tbl-perm-user').DataTable().destroy();
    $("#tbl-perm-user").remove();

});

$(document).on("change", ".checkAccesoUser", function () {

    var idCheck = null;
    var idMenu = $(this).attr("idMenu");
    var idCheck = $(this).attr('id');
    var idUser = document.getElementById('userName').value;
    var payload = {};

    const checkAcceso = document.getElementById(idCheck);

    if (checkAcceso.checked == true) {
        var acceso = 1;
    } else {
        var acceso = 0;
    }

    payload.idmenu = idMenu;
    payload.idusuario = idUser;
    payload.acceso = acceso;

    axios.put('/permiso_x_usuario', payload)
        .then(function (respuesta) {

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cambios guardados!',
                showConfirmButton: false,
                timer: 1000
            });

        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        })

});

/*=============================================
Crear Oficina
=============================================*/
if (formNewOficina) {

    formNewOficina.addEventListener('submit', function (e) {
        e.preventDefault();

        var payload = {};

        var nameOficina = document.getElementById("newOficina").value;

        payload.oficina = nameOficina;
        payload.fecha_creacion = moment().format('YYYY-MM-DD H:mm:ss');
        payload.status = 1;

        axios.post('/oficinas', payload)
            .then(function (respuesta) {

                if (respuesta.data == 'Repetido') {

                    $('#modalAgregarOficina').modal('dispose');

                    // Alerta
                    Swal.fire(
                        'La oficina ya existe',
                        'La oficina capturada ya existe en la base de datos',
                        'warning'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/oficinas";
                        }
                    });

                } else {
                    $("#modalAgregarPerfil").remove();
                    // Alerta
                    Swal.fire(
                        'Oficina Creada!',
                        respuesta.data,
                        'success'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/oficinas";
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

    });
}

$('#modalAgregarOficina').on('shown.bs.modal', function () {
    document.getElementById('newOficina').focus();
});

/*=============================================
Activar/Desactivar Oficinas
=============================================*/
$(document).on("click", "#btn-estatus-oficina", function () {

    var idOficina = $(this).attr("idOficina");
    var estadoOficina = $(this).attr("estadoOficina");

    var payload = {};

    payload.idOficina = idOficina;
    payload.estadoOficina = estadoOficina;

    axios.put('/oficinas', payload)
        .then(function (respuesta) {
            if (window.matchMedia("(max-width:767px)").matches) {

                Swal.fire(
                    'Oficina Actualizada',
                    respuesta.data,
                    'success'
                ).then(function (result) {
                    if (result.value) {
                        window.location = "/oficinas";
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

    if (estadoOficina == 0) {

        $(this).removeClass('btn-success');
        $(this).addClass('btn-danger');
        $(this).html('Desactivado');
        $(this).attr('estadoOficina', 1);

    } else {

        $(this).addClass('btn-success');
        $(this).removeClass('btn-danger');
        $(this).html('Activado');
        $(this).attr('estadoOficina', 0);
    }
});

/*=============================================
Editar Oficina
=============================================*/
$(document).on("click", "#btn-editar-oficina", function () {

    var idOficina = $(this).attr("idOficina");

    var route = '/oficinas/' + idOficina;

    axios.get(route)
        .then(function (respuesta) {

            var idOficina = respuesta.data[0].idoficina;
            var oficina = respuesta.data[0].oficina;

            $("#editIdOficina").val(idOficina);
            $("#editOficina").val(oficina);

        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        })
});

if (formEditOficina) {

    formEditOficina.addEventListener('submit', function (e) {
        e.preventDefault();

        var idOficina = document.getElementById("editIdOficina").value;
        var updOficina = document.getElementById("editOficina").value;

        var payload = {};

        payload.newOficina = updOficina;

        var route = '/oficinas/' + idOficina;

        axios.put(route, payload)
            .then(function (respuesta) {

                if (respuesta.data == 'Igual') {

                    $('#modalEditarOficina').modal('dispose');

                    Swal.fire(
                        'Oops...',
                        'No se detectan cambios!',
                        'warning'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/oficinas";
                        }
                    });

                } else {

                    if (respuesta.data == 'Repetido') {

                        $('#modalEditarOficina').modal('dispose');

                        Swal.fire(
                            'La oficina ya existe',
                            'La oficina ingresada ya existe en la base de datos!',
                            'warning'
                        ).then(function (result) {
                            if (result.value) {
                                window.location = "/oficinas";
                            }
                        });

                    } else {

                        $("#modalEditarOficina").remove();

                        Swal.fire(
                            'Oficina Actualizada',
                            respuesta.data,
                            'success'
                        ).then(function (result) {
                            if (result.value) {
                                window.location = "/oficinas";
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
            });
    })
}

$('#modalEditarOficina').on('shown.bs.modal', function () {
    document.getElementById('editOficina').focus();
});

/*=============================================
Agregar Verificador
=============================================*/
if (verifTel) {

    var im = new Inputmask("(99)99-99-99-99");
    im.mask(verifTel);

}

if (formNewVerif) {

    var payloadEmp = {};

    payloadEmp.status = 1;

    axios.post('/empleados/all', payloadEmp)
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
        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        });

    formNewVerif.addEventListener('submit', function (e) {
        e.preventDefault();

        var userEmpleado = document.getElementById("userEmpleado").value;

        var payload = {};

        payload.idempleado = userEmpleado;
        payload.status = 1;
        payload.fecha_creacion = moment().format('YYYY-MM-DD H:mm:ss');;

       axios.post('/verificadores', payload)
            .then(function (respuesta) {
                
                $('#modalAgregarVerif').modal('dispose');
                
                if (respuesta.data == 'Repetido') {

                    // Alerta
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'El empleado seleccionado ya existe como verificador!',
                    }).then(function (result) {
                        if (result.value) {
                            window.location = "/verificadores";
                        }
                    });
                    
                } else {

                    // Alerta
                    Swal.fire(
                        'Verficador Creado',
                        respuesta.data,
                        'success'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/verificadores";
                        }
                    });

                }


            }).catch(errors => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Error en la Base de Datos'
                })
            });

    })

}

/*=============================================
Activar/Desactivar Verificadores
=============================================*/
$(document).on("click", "#btn-estatus-verif", function () {

    var idVerif = $(this).attr("idVerif");
    var estadoVerif = $(this).attr("estadoVerif");

    var payload = {};

    payload.idVerif = idVerif;
    payload.estadoVerif = estadoVerif;

    axios.put('/verificadores', payload)
        .then(function (respuesta) {
            if (window.matchMedia("(max-width:767px)").matches) {

                Swal.fire(
                    'Verificador Actualizado',
                    respuesta.data,
                    'success'
                ).then(function (result) {
                    if (result.value) {
                        window.location = "/verificadores";
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

    if (estadoVerif == 0) {

        $(this).removeClass('btn-success');
        $(this).addClass('btn-danger');
        $(this).html('Desactivado');
        $(this).attr('estadoVerif', 1);

    } else {

        $(this).addClass('btn-success');
        $(this).removeClass('btn-danger');
        $(this).html('Activado');
        $(this).attr('estadoVerif', 0);
    }
});

/*=============================================
Editar Verificador
=============================================*/
if (verifEditTel) {

    var im = new Inputmask("(99)99-99-99-99");
    im.mask(verifEditTel);

}

if (formEditVerif) {

    formEditVerif.addEventListener('submit', function (e) {
        e.preventDefault();

        const url = window.location.pathname;
        var idVerif = url.substring(url.lastIndexOf('/') + 1);

        var verifEditNombre = document.getElementById("verifEditNombre").value;
        var verifEditPat = document.getElementById("verifEditPat").value;
        var verifEditMat = document.getElementById("verifEditMat").value;
        var verifEditEmail = document.getElementById("verifEditEmail").value;
        var verifEditTel = document.getElementById("verifEditTel").value;

        var payload = {};

        payload.nombre = verifEditNombre.toUpperCase();
        payload.ap_paterno = verifEditPat.toUpperCase();
        payload.ap_materno = verifEditMat.toUpperCase();
        payload.nombre_completo = verifEditNombre.toUpperCase() + ' ' + verifEditPat.toUpperCase() + ' ' + verifEditMat.toUpperCase();
        payload.email = verifEditEmail;
        payload.telefono = verifEditTel;

        var route = '/verificadores/' + idVerif;

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
                                window.location = "/verificadores";
                            }
                        });

                    }
                }

            }).catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Error en la Base de Datos'
                }).then(function (result) {
                    if (result.value) {
                        window.location = "/verificadores";
                    }
                });
            });

    })


}