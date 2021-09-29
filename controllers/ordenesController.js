const pool = require('../config/db');
const fs = require('fs');
const Excel = require('exceljs');

const moment = require('moment');

var Roboto = require('../public/fonts/Roboto');

exports.capturarOrden = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/ordenes/capturar_orden', {
            nombrePagina: 'Capturar Orden'
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.mostrarMunic = async (req, res) => {

    const values = await pool.query('SELECT * FROM municipios');

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataMunic = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayMunic = values[x];

            const obj = [
                conteo,
                arrayMunic.cp_cve_estado,
                arrayMunic.cp_cve_mnpio,
                arrayMunic.cp_mnpio
            ];

            dataMunic.push(obj);
        }

        res.send(dataMunic);
    }
}

exports.guardarOrden = async (req, res) => {

    const { idoficina, idverificador_cen, idactividad, giro, cp_cve_mnpio, rfc, ubicacion, idstatus_orden, fecha_captura } = req.body;

    var valFolio = await pool.query(`SELECT IFNULL(MAX(idorden),100)+1 AS idor FROM ordenes`);

    var idusuario = res.locals.usuario.idusuario;

    for (var x = 0; x < valFolio.length; x++) {
        var idorden = valFolio[x].idor;
    }

    const newLink = {
        idorden,
        idoficina,
        idverificador_cen,
        idactividad,
        giro,
        cp_cve_mnpio,
        rfc,
        ubicacion,
        idstatus_orden,
        fecha_captura,
        idusuario
    };

    const existVerif = await pool.query('SELECT * FROM ordenes WHERE rfc = ? AND ubicacion = ? AND idstatus_orden = ?', [newLink.rfc, newLink.ubicacion, newLink.idstatus_orden]);

    if (existVerif.length > 0) {

        res.send('Repetido');

    } else {

        await pool.query('INSERT INTO ordenes SET ?', [newLink]);

        res.status(200).send('Orden Capturada Correctamente!');

    }

}

exports.seguimientoOrden = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/ordenes/seguimiento_ordenes', {
            nombrePagina: 'Seguimientos Ordenes'
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.statusOrdenes = async (req, res) => {

    const values = await pool.query('SELECT * FROM ordenes_estatus');

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataStatus = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayStatus = values[x];

            const obj = [
                conteo,
                arrayStatus.idstatus_orden,
                arrayStatus.status_orden
            ];

            dataStatus.push(obj);
        }

        res.send(dataStatus);
    }
}

exports.mostrarOrdenes = async (req, res) => {


    var { idstatus_orden } = req.body;

    var dataOrdenes = await pool.query('call get_ordenes_xestatus(?)', idstatus_orden);

    const results = dataOrdenes[0];

    var valuesTotal = results.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataset = [];

        if (idstatus_orden == 1) {

            for (var x = 0; x < results.length; x++) {

                const array = results[x];
                conteo = x + 1;

                var buttonAsig = "<div class='btn-group'><button type='button' id='btn-asignar-orden' class='btn btn-info' data-toggle='modal' data-target='#modalAsignarOrden' idOrden=" + "'" + array.idorden + "'" + "><i class='fas fa-user-check'></i></button></div>";

                const obj = [
                    conteo,
                    array.oficina,
                    array.nombre_completo,
                    array.actividad,
                    array.giro,
                    array.cp_mnpio,
                    array.rfc,
                    array.ubicacion,
                    buttonAsig
                ];

                dataset.push(obj);
            }

            res.send(dataset);

        } else if (idstatus_orden == 2) {

            for (var x = 0; x < results.length; x++) {

                const array = results[x];
                conteo = x + 1;

                var fechaProg = moment(array.fecha_prog).format('DD/MM/YYYY');

                const obj = [
                    conteo,
                    array.oficina,
                    array.nombre_completo,
                    array.actividad,
                    array.giro,
                    array.cp_mnpio,
                    array.rfc,
                    array.ubicacion,
                    array.num_orden,
                    array.nombre_verif,
                    fechaProg
                ];

                dataset.push(obj);
            }

            res.send(dataset);

        }

    }
}

exports.asignarOrden = async (req, res) => {

    const { idorden, num_orden, idverificador, fecha_prog, fecha_asigna } = req.body;

    var idusuario = res.locals.usuario.idusuario;

    const newLink = {
        idorden,
        num_orden,
        idverificador,
        fecha_prog,
        idusuario
    };

    const existOrden = await pool.query('SELECT * FROM ordenes WHERE idorden=?', [newLink.idorden]);

    if (existOrden.length < 0) {

        res.send('Inexistente');

    } else {

        await pool.query('INSERT INTO ordenes_prog SET ?', [newLink]);

        await pool.query('UPDATE ordenes SET idstatus_orden=2 WHERE idorden=?', [newLink.idorden]);

        await pool.query('UPDATE ordenes SET fecha_asigna=? WHERE idorden=?', [fecha_asigna, newLink.idorden]);

        res.status(200).send('Orden Asignada Correctamente!');

    }

}

exports.agendaOrdenes = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/ordenes/agenda_ordenes', {
            nombrePagina: 'Agenda Ordenes'
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}


exports.consultarAgenda = async (req, res) => {

    var { fecInicial, fecFinal } = req.body;

    var inicial = moment(fecInicial, 'YYYY/MM/DD').format('YYYY-MM-DD');
    var final = moment(fecFinal, 'YYYY/MM/DD').format('YYYY-MM-DD');

    var dataOrdenes = await pool.query('call get_agenda_ordenes(?,?)', [inicial, final]);

    const results = dataOrdenes[0];

    var valuesTotal = results.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataset = [];

        for (var x = 0; x < results.length; x++) {

            const array = results[x];

            var fechaProg = moment(array.fecha_prog).format('DD/MM/YYYY');
            
            const obj = [
                array.num_orden,
                array.oficina,
                array.nombre_completo,
                array.actividad,
                array.giro,
                array.mnpio,
                array.rfc,
                array.ubicacion,
                fechaProg
            ];

            dataset.push(obj);
        }

        res.send(dataset);

    }
}

exports.exportAgenda= async (req, res) => {

    var { fecInicial, fecFinal } = req.body;

    var inicial = moment(fecInicial, 'YYYY/MM/DD').format('YYYY-MM-DD');
    var final = moment(fecFinal, 'YYYY/MM/DD').format('YYYY-MM-DD');

    var dataOrdenes = await pool.query('call get_agenda_ordenes(?,?)', [inicial, final]);

    const results = dataOrdenes[0];

    var valuesTotal = results.length;

    if (valuesTotal === 0) {

        res.send('empty')

    } else {

        const dataOrds = [];

        for (var x = 0; x < results.length; x++) {

            const array = results[x];

            var fechaProg = moment(array.fecha_prog).format('DD/MM/YYYY');
            
            const obj = {
                num_orden: array.num_orden,
                oficina: array.oficina,
                nombre_completo: array.nombre_completo,
                actividad: array.actividad,
                giro: array.giro,
                mnpio: array.mnpio,
                rfc: array.rfc,
                ubicacion: array.ubicacion,
                fecha: fechaProg
            };

            dataOrds.push(obj);
        }

        var workbook = new Excel.Workbook();

        workbook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ];

        var worksheet = workbook.addWorksheet('Agenda');

        worksheet.columns = [
            { header: 'NO.', width: 10 },
            { header: 'Oficina', width: 10 },
            { header: 'Verificador', width: 40 },
            { header: 'Actividad', width: 25 },
            { header: 'Giro', width: 32 },
            { header: 'Municipio', width: 25 },
            { header: 'RFC', width: 25 },
            { header: 'Ubicación', width: 15 },
            { header: 'Fecha Prog.', width: 25 }
        ];

        // set cell alignment to top-left, middle-center, bottom-right
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('E1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('F1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('G1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('I1').alignment = { vertical: 'middle', horizontal: 'center' };
        // for the wannabe graphic designers out there
        worksheet.getCell('A1').font = { bold: true };
        worksheet.getCell('B1').font = { bold: true };
        worksheet.getCell('C1').font = { bold: true };
        worksheet.getCell('D1').font = { bold: true };
        worksheet.getCell('E1').font = { bold: true };
        worksheet.getCell('F1').font = { bold: true };
        worksheet.getCell('G1').font = { bold: true };
        worksheet.getCell('H1').font = { bold: true };
        worksheet.getCell('I1').font = { bold: true };

        // set single thin border around
        worksheet.getCell('A1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('B1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('C1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('D1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('E1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('F1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('G1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('H1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.getCell('I1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        var i;

        for (i = 0; i < dataOrds.length; i++) {

            const row = worksheet.getRow(2 + i);
            const ordenes = dataOrds[i];

            row.getCell(1).value = ordenes.num_orden;
            row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(1).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(2).value = ordenes.oficina;
            row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(2).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(3).value = ordenes.nombre_completo;
            row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(3).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(4).value = ordenes.actividad;
            row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(4).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(5).value = ordenes.giro;
            row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(5).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(6).value = ordenes.mnpio;
            row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(6).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(7).value = ordenes.rfc;
            row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(7).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(8).value = ordenes.ubicacion;
            row.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(8).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(9).value = ordenes.fecha;
            row.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(9).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.commit();

        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        workbook.xlsx.write(res)
            .then(function (data) {
                res.end();
                console.log('File write done........');
            });

    }

}

function createPdfBinary(pdfDoc, callback) {

    var printer = new pdfMakePrinter(Roboto);

    var doc = printer.createPdfKitDocument(pdfDoc);
    //doc.pipe(fs.createWriteStream('pdfs/basics.pdf'));

    var chunks = [];
    var result;

    doc.on('data', function (chunk) {
        chunks.push(chunk);
    });
    doc.on('end', function () {
        result = Buffer.concat(chunks);
        callback('data:application/pdf;base64,' + result.toString('base64'));
    });
    doc.end();

}

// Table body builder
function buildTableBody(data, columns, showHeaders, headers) {
    var body = [];
    // Inserting headers
    if (showHeaders) {
        body.push(headers);
    }

    // Inserting items from external data array
    data.forEach(function (row) {
        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
            dataRow.push({ text: Object.byString(row, column), alignment: headers[i].alignmentChild });
            i++;
        })
        body.push(dataRow);

    });

    return body;
}

// Func to return generated table
function table(data, columns,/* witdhsDef, */showHeaders, headers, layoutDef) {
    return {
        table: {
            headerRows: 1,
            //widths: witdhsDef,
            fontSize: 8,
            body: buildTableBody(data, columns, showHeaders, headers)
        },
        layout: layoutDef
    };
}

Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function currencyFormat(value) {
    return '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}


async function validAccess(idUsuario, url) {

    var permiso = 0;

    var idPerfilQry = await pool.query('SELECT idperfil FROM usuarios WHERE idusuario=?', idUsuario);
    var idMenuQry = await pool.query('SELECT idmenu FROM menu WHERE url=?', url);

    var idPerfil = idPerfilQry[0].idperfil;
    var idMenu = idMenuQry[0].idmenu;

    var validPermU = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xusuario WHERE idmenu=? AND idusuario=? AND acceso=1', [idMenu, idUsuario]);
    var validPermP = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xperfil WHERE idmenu=? AND idperfil=? AND acceso=1', [idMenu, idPerfil]);

    var permiso = permiso + validPermU[0].cuenta + validPermP[0].cuenta;

    return permiso

}