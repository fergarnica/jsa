import axios from 'axios';
import Swal from 'sweetalert2';
import FileSaver from 'file-saver';

const formNewOrden = document.getElementById('formNewOrden');
const formSegOrdenes = document.getElementById('formSegOrdenes');
const formAsigOrden = document.getElementById('formAsigOrden');
const formAgenOrd = document.getElementById('formAgenOrd');

const fecOrden = document.getElementById("fecOrden");
const statusOrd = document.getElementById('statusOrd');

if (formNewOrden) {

    var payload = {};
    payload.status = 1;

    var routeUno = '/verificadores/all';
    var routeDos = '/oficinas/all';
    var routeTres = '/actividades/all';
    var routeCuatro = '/municipios';

    const requestUno = axios.post(routeUno, payload);
    const requestDos = axios.post(routeDos, payload);
    const requestTres = axios.post(routeTres, payload);
    const requestCuatro = axios.get(routeCuatro);

    axios.all([requestUno, requestDos, requestTres, requestCuatro]).then(axios.spread((...respuesta) => {

        const responseUno = respuesta[0];
        const responseDos = respuesta[1];
        const responseTres = respuesta[2];
        const responseCuatro = respuesta[3];

        var dataVerif = responseUno.data;
        var dataOfic = responseDos.data;
        var dataActi = responseTres.data;
        var dataMnpio = responseCuatro.data;

        dataVerif.forEach(function (valor, indice, array) {

            var idVerif = valor[1];
            var verificador = valor[2];

            $("<option />")
                .attr("value", idVerif)
                .html(verificador)
                .appendTo("#selectVerif");
        });

        dataOfic.forEach(function (valor, indice, array) {

            var idOffice = valor[1];
            var oficina = valor[2];

            $("<option />")
                .attr("value", idOffice)
                .html(oficina)
                .appendTo("#selectOficina");
        });

        dataActi.forEach(function (valor, indice, array) {

            var idActi = valor[1];
            var actividad = valor[2];

            $("<option />")
                .attr("value", idActi)
                .html(actividad)
                .appendTo("#selectActi");
        });

        dataMnpio.forEach(function (valor, indice, array) {

            var cveMnpio = valor[2];
            var municipio = valor[3];

            $("<option />")
                .attr("value", cveMnpio)
                .html(municipio)
                .appendTo("#selectMnpio");
        });

    })).catch(errors => {
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error',
            text: 'Error en la Base de Datos'
        })
    });


    formNewOrden.addEventListener('submit', function (e) {
        e.preventDefault();

        var selectOficina = document.getElementById("selectOficina").value;
        var selectVerif = document.getElementById("selectVerif").value;
        var selectActi = document.getElementById("selectActi").value;
        var giroOrden = document.getElementById("giroOrden").value;
        var selectMnpio = document.getElementById("selectMnpio").value;
        var estabOrden = document.getElementById("estabOrden").value;
        var ubicOrden = document.getElementById("ubicOrden").value;

        var payload = {};

        payload.idoficina = selectOficina;
        payload.idverificador_cen = selectVerif;
        payload.idactividad = selectActi;
        payload.giro = giroOrden;
        payload.cp_cve_mnpio = selectMnpio;
        payload.rfc = estabOrden;
        payload.ubicacion = ubicOrden;
        payload.idstatus_orden = 1;
        payload.fecha_captura = moment().format('YYYY-MM-DD H:mm:ss');

        axios.post('/ordenes', payload)
            .then(function (respuesta) {

                if (respuesta.data == 'Repetido') {

                    // Alerta
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'La orden capturada ya existe en la base de datos!',
                    })

                } else {

                    // Alerta
                    Swal.fire(
                        'Orden Creada',
                        respuesta.data,
                        'success'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/capturar_orden";
                        }
                    });

                }

            });

    })

}
/*=============================================
CONSULTAR ORDENES
=============================================*/
if (formSegOrdenes) {

    axios.get('/estatus_ordenes', payload)
        .then(function (respuesta) {

            var dataStatus = respuesta.data;

            dataStatus.forEach(function (valor, indice, array) {

                var idStatus = valor[1];
                var status_compra = valor[2];

                $("<option />")
                    .attr("value", idStatus)
                    .html(status_compra)
                    .appendTo("#statusOrd");
            });

        });


    formSegOrdenes.addEventListener('submit', function (e) {
        e.preventDefault();

        $('#btnOrdenes').html('<span id="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Buscando...').addClass('disabled');

        $('#tbl-ordenes').DataTable().destroy();
        $("#tbl-ordenes").remove();
        $("#bodySegOrd").remove();

        var payload = {};

        var statusOrd = document.getElementById('statusOrd').value;

        payload.idstatus_orden = statusOrd;

        axios.post('/seguimiento_ordenes', payload)
            .then(function (respuesta) {

                $('#btnOrdenes').html('<i class="fa fa-search"></i> Consultar').removeClass('disabled');

                if (respuesta.data != 'empty') {

                    $("#cardOrdenes").append(
                        '<div class="card-body" id="bodySegOrd">' +
                        '</div>'
                    );

                    $("#bodySegOrd").append(
                        '<table id="tbl-ordenes" class="display table-bordered table-striped dt-responsive text-center" cellspacing="0" style="width:100%"> </table>'
                    );

                    const tblOrdenes = document.querySelector('#tbl-ordenes');

                    var dataSet = respuesta.data;

                    if (statusOrd == 1) {

                        if (tblOrdenes) {

                            $(tblOrdenes).DataTable({
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
                                    title: "#"
                                },
                                {
                                    title: "Oficina"
                                },
                                {
                                    title: "Censador"
                                },
                                {
                                    title: "Actividad"
                                },
                                {
                                    title: "Giro"
                                },
                                {
                                    title: "Municipio"
                                },
                                {
                                    title: "RFC"
                                },
                                {
                                    title: "Ubicación"
                                },
                                {
                                    title: "Asignar"
                                }
                                ]
                            });
                        }

                    } else if (statusOrd == 2) {

                        if (tblOrdenes) {

                            $(tblOrdenes).DataTable({
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
                                    title: "#"
                                },
                                {
                                    title: "Oficina"
                                },
                                {
                                    title: "Censador"
                                },
                                {
                                    title: "Actividad"
                                },
                                {
                                    title: "Giro"
                                },
                                {
                                    title: "Municipio"
                                },
                                {
                                    title: "RFC"
                                },
                                {
                                    title: "Ubicación"
                                },
                                {
                                    title: "No. Acta"
                                },
                                {
                                    title: "Verificador"
                                },
                                {
                                    title: "Fecha Prog."
                                }
                                ]
                            });
                        }

                    }

                } else {

                    Swal.fire({
                        icon: 'warning',
                        title: '¡No se encontraron registros!',
                        text: 'Sin ordenes con el estatus ingresado.',
                    })

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


if (fecOrden) {
    $('#fecOrden').datepicker({
        format: "dd/mm/yyyy",
        language: 'es',
        startDate: '+1d',
        //endDate: '+0d',
        weekStart: 0,
        autoclose: true,
    });

}

/*=============================================
ASIGNAR ORDEN
=============================================*/
$(document).on("click", "#btn-asignar-orden", function () {

    var idOrden = $(this).attr("idOrden");

    $("#idOrdenAsig").val(idOrden);

    var payload = {};
    payload.status = 1;

    var route = '/verificadores/all';

    axios.post(route, payload)
        .then(function (respuesta) {

            var dataVerif = respuesta.data;

            dataVerif.forEach(function (valor, indice, array) {

                var idVerif = valor[1];
                var verificador = valor[2];

                $("<option />")
                    .attr("value", idVerif)
                    .html(verificador)
                    .appendTo("#selAsigVer");
            });

        }).catch(errors => {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Error en la Base de Datos'
            })
        })
});

if (formAsigOrden) {


    formAsigOrden.addEventListener('submit', function (e) {
        e.preventDefault();

        var payload = {};

        var idOrdenAsig = document.getElementById("idOrdenAsig").value;
        var numOrden = document.getElementById("numOrden").value;
        var selAsigVer = document.getElementById("selAsigVer").value;
        var fecOrden = document.getElementById("fecOrden").value;

        payload.idorden = idOrdenAsig;
        payload.num_orden = numOrden;
        payload.idverificador = selAsigVer;
        payload.fecha_prog = moment(fecOrden, 'DD/MM/YYYY').format('YYYY-MM-DD');
        payload.fecha_asigna = moment().format('YYYY-MM-DD H:mm:ss');

        var route = '/asignar_orden';

        axios.post(route, payload)
            .then(function (respuesta) {

                $('#modalAsignarOrden').modal('dispose');

                if (respuesta.data != 'Inexistente') {

                    // Alerta
                    Swal.fire(
                        'Orden Asignada',
                        respuesta.data,
                        'success'
                    ).then(function (result) {
                        if (result.value) {
                            window.location = "/seguimiento_ordenes";
                        }
                    });

                } else {

                    Swal.fire({
                        icon: 'warning',
                        title: '¡No se encontró la orden!',
                        text: 'La orden no existe en la base de datos.',
                    })

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

if(statusOrd){
    statusOrd.addEventListener('change', function () {
        $('#tbl-ordenes').DataTable().destroy();
        $("#tbl-ordenes").remove();
        $("#bodySegOrd").remove();
    });
}

$('#reservation').daterangepicker();
//Date range picker with time picker
$('#reservation').daterangepicker({
    startDate: moment(),
    endDate: moment(),
    locale: {
        format: 'YYYY/MM/DD',
        daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre',
            'Diciembre']
    }
});

if(formAgenOrd){

    formAgenOrd.addEventListener('submit', function (e) {
        e.preventDefault();

        $('#btnAgendaOrd').html('<span id="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Buscando...').addClass('disabled');

        $('#tbl-agenda-ords').DataTable().destroy();
        $("#tbl-agenda-ords").remove();
        $("#bodyAgenda").remove();

        var payload = {};

        var periodoOrds = document.getElementById("reservation").value;

        var fecInicial = periodoOrds.split('-')[0];
        var fecFinal = periodoOrds.split('-')[1];

        payload.fecInicial = fecInicial;
        payload.fecFinal = fecFinal;

        axios.post('/consultar_agenda', payload)
            .then(function (respuesta) {

                $('#btnAgendaOrd').html('<i class="fa fa-search"></i> Consultar').removeClass('disabled');

                if(respuesta.data != 'empty'){

                    var dataSet = respuesta.data;

                    $("#cardAgenda").append(
                        '<div class="card-body" id="bodyAgenda">' +
                        '</div>'
                    );

                    $("#bodyAgenda").append(
                        '<div id="btnOpciones" class="d-flex">' +
                        '<div class="btn-group ml-auto">' +
                        '<button id="btn-export-agenda" class="btn btn-sm btn-success"><i class="fas fa-file-excel"></i> Exportar</button>' +
                        '</div>' +
                        '</div>' +
                        '<br>'
                    );

                    $("#bodyAgenda").append(
                        '<table id="tbl-agenda-ords" class="display table-bordered table-striped dt-responsive text-center" cellspacing="0" style="width:100%"> </table>'
                    );
                    

                    const tblAgenda = document.querySelector('#tbl-agenda-ords');

                    if (tblAgenda) {

                        $(tblAgenda).DataTable({
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
                                title: "# Orden"
                            },
                            {
                                title: "Oficina"
                            },
                            {
                                title: "Verificador"
                            },
                            {
                                title: "Actividad"
                            },
                            {
                                title: "Giro"
                            },
                            {
                                title: "Municipio"
                            },
                            {
                                title: "RFC"
                            },
                            {
                                title: "Ubicación"
                            },
                            {
                                title: "Fecha Prog."
                            }
                            ]
                        });
                    }

                }else{

                    Swal.fire({
                        icon: 'warning',
                        title: '¡No se encontraron registros!',
                        text: 'Sin registros en el periodo seleccionado.',
                    })

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


/*=============================================
EXPORTAR AGENDA
=============================================*/
$(document).on("click", "#btn-export-agenda", function () {

    $('#btn-export-agenda').html('<span id="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Exportando...').addClass('disabled');

    var payload = {};
    var periodoVtas = document.getElementById("reservation").value;

    var fecInicial = periodoVtas.split('-')[0];
    var fecFinal = periodoVtas.split('-')[1];

    payload.fecInicial = fecInicial;
    payload.fecFinal = fecFinal;

    axios.post('/exportar_agenda', payload, {
        responseType: 'blob'
    }).then(function (respuesta) {

        var data = respuesta.data;
        console.log(data);

        $('#btn-export-agenda').html('Exportar').removeClass('disabled');

        if (data) {

            var blob = new Blob([data], { type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            FileSaver.saveAs(blob, 'agenda_ordenes.xlsx');

        } else {

            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'No existen registros!',
            })

        }

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error',
            text: 'Error en la base de datos!'
        }).then(function (result) {
            if (result.value) {
                window.location = "/agenda_ordenes";
            }
        });
    });

});