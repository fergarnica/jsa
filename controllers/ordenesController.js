const pool = require('../config/db');
const fs = require('fs');
const Excel = require('exceljs');
const pdfMakePrinter = require('pdfmake/src/printer');
const fsPromises = require("fs").promises;

const moment = require('moment');

const { s3, bucket, uploadFile, getFileStream, downloadFile } = require('../helpers/s3');

var fonts = require('../public/fonts/fonts');

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
                    buttonAsig,
                    buttonArchiv
                ];

                dataset.push(obj);
            }

            res.send(dataset);

        } else if (idstatus_orden == 2) {
            
            for (var x = 0; x < results.length; x++) {

                const array = results[x];
                conteo = x + 1;

                var buttonPrint = "<div class='btn-group'><button type='button' class='btn btn-info btn-imprimir-orden' ' urlimage=" + "'" + array.imagen + "'' idOrden=" + "'" + array.idorden + "'" + "><i class='fas fa-print'></i></button></div>";

                var buttonArchiv = "<div class='btn-group'><button type='button' id='btn-archivar-orden' class='btn btn-success' data-toggle='modal' data-target='#modalArchivarOrden' idOrden=" + "'" + array.idorden + "'" + "><i class='fas fa-archive'></i></button></div>";

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
                    fechaProg,
                    buttonPrint,
                    buttonArchiv
                ];

                dataset.push(obj);
            }

            res.send(dataset);

        } else if (idstatus_orden == 0) {

            for (var x = 0; x < results.length; x++) {

                const array = results[x];
                conteo = x + 1;

                const obj = [
                    conteo,
                    array.oficina,
                    array.nombre_completo,
                    array.actividad,
                    array.giro,
                    array.cp_mnpio,
                    array.rfc,
                    array.ubicacion,
                    array.status_orden
                ];

                dataset.push(obj);
            }

            res.send(dataset);

        } else {

            for (var x = 0; x < results.length; x++) {

                const array = results[x];
                conteo = x + 1;

                const obj = [
                    conteo,
                    array.oficina,
                    array.nombre_completo,
                    array.actividad,
                    array.giro,
                    array.cp_mnpio,
                    array.rfc,
                    array.ubicacion,
                    array.status_orden,
                    array.orden_obs
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

            if (array.fecha_captura == null) {
                var fechaProg = '-------';
            } else {
                var fechaProg = moment(array.fecha_captura).format('DD/MM/YYYY');
            }

            const obj = [
                //array.num_orden,
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

exports.exportAgenda = async (req, res) => {

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

            if (array.fecha_captura == null) {
                var fechaProg = '-------';
            } else {
                var fechaProg = moment(array.fecha_captura).format('DD/MM/YYYY');
            }

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
            /* { header: 'NO.', width: 10 }, */
            { header: 'Oficina', width: 10 },
            { header: 'Censador', width: 40 },
            { header: 'Actividad', width: 25 },
            { header: 'Giro', width: 32 },
            { header: 'Municipio', width: 25 },
            { header: 'RFC', width: 25 },
            { header: 'Ubicaci??n', width: 15 },
            { header: 'Fecha Reg.', width: 25 }
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
        //worksheet.getCell('I1').alignment = { vertical: 'middle', horizontal: 'center' };
        // for the wannabe graphic designers out there
        worksheet.getCell('A1').font = { bold: true };
        worksheet.getCell('B1').font = { bold: true };
        worksheet.getCell('C1').font = { bold: true };
        worksheet.getCell('D1').font = { bold: true };
        worksheet.getCell('E1').font = { bold: true };
        worksheet.getCell('F1').font = { bold: true };
        worksheet.getCell('G1').font = { bold: true };
        worksheet.getCell('H1').font = { bold: true };
        //worksheet.getCell('I1').font = { bold: true };

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

        /* worksheet.getCell('I1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }; */

        var i;

        for (i = 0; i < dataOrds.length; i++) {

            const row = worksheet.getRow(2 + i);
            const ordenes = dataOrds[i];

            row.getCell(1).value = ordenes.oficina;
            row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(1).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(2).value = ordenes.nombre_completo;
            row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(2).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(3).value = ordenes.actividad;
            row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(3).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(4).value = ordenes.giro;
            row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(4).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(5).value = ordenes.mnpio;
            row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(5).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(6).value = ordenes.rfc;
            row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(6).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(7).value = ordenes.ubicacion;
            row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(7).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            row.getCell(8).value = ordenes.fecha;
            row.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(8).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            /* row.getCell(9).value = ordenes.fecha;
            row.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell(9).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }; */
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

    var printer = new pdfMakePrinter(fonts);

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

exports.printOrden = async (req, res) => {

    eval(req.body.content);

    var { idorden } = req.body;

    var dataOrdenes = await pool.query('call get_info_orden(?)', [idorden]);

    const results = dataOrdenes[0];

    var valuesTotal = results.length;

    if (valuesTotal === 0) {

        res.send('empty')

    } else {

        const dataOrden = [];

        for (var x = 0; x < results.length; x++) {

            conteo = x + 1;
            const array = results[x];

            var nameImagen = array.imagen;
            var idEmpleado = array.idempleado;

            const obj = {
                num_orden: array.num_orden,
                oficina: array.oficina,
                nombre_verif: array.nombre_verif,
                actividad: array.actividad,
                giro: array.giro,
                rfc: array.rfc,
                ubicacion: array.ubicacion,
                imagen: nameImagen,
                cadena: array.cadena,
                dia: array.dia,
                mes: array.mes,
                anio: array.anio
            };

            dataOrden.push(obj);

        }

        var imgNameFile = dataOrden[0].imagen;

        await printPdfImage(imgNameFile, dataOrden, res);

    }

}

exports.statusOrdsCerrar = async (req, res) => {

    const values = await pool.query('SELECT * FROM ordenes_estatus WHERE idstatus_orden NOT IN(1,2)');

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

exports.infoOrden = async (req, res) => {

    let idOrden = req.params.id;

    var dataOrdenes = await pool.query('call get_info_orden(?)', [idOrden]);

    const results = dataOrdenes[0];

    var valuesTotal = results.length;

    if (valuesTotal === 0) {

        res.send('empty')

    } else {

        const dataOrden = [];

        for (var x = 0; x < results.length; x++) {

            conteo = x + 1;
            const array = results[x];

            var nameImagen = array.imagen;

            const obj = {
                num_orden: array.num_orden,
                oficina: array.oficina,
                nombre_verif: array.nombre_verif,
                actividad: array.actividad,
                giro: array.giro,
                rfc: array.rfc,
                ubicacion: array.ubicacion,
                imagen: nameImagen,
                cadena: array.cadena,
                dia: array.dia,
                mes: array.mes,
                anio: array.anio
            };

            dataOrden.push(obj);

        }

        res.send(dataOrden);

    }

}


exports.cerrarOrden = async (req, res) => {

    var { idorden, idstatus_orden, orden_obs, fecha_cierre } = req.body;

    var idUsuario = res.locals.usuario.idusuario;

    var newCierre = {
        idorden,
        orden_obs,
        idUsuario
    }

    await pool.query('UPDATE ordenes SET idstatus_orden=? WHERE idorden=?', [idstatus_orden, idorden]);
    await pool.query('UPDATE ordenes SET fecha_cierre=? WHERE idorden=?', [fecha_cierre, idorden]);
    await pool.query('INSERT INTO ordenes_cierre SET ?', [newCierre]);


    res.send('La orden se cerr?? correctamente.')

}

async function getFileB64(fileKey) {

    const params = {
        Key: fileKey,
        Bucket: bucket
    }

    const { Body, ContentType } = await s3.getObject(params).promise();

    let image = Buffer.from(Body).toString('base64');
    image = "data:" + ContentType + ";base64," + image;
    return image;


}

async function printPdfImage(imgFile, dataOrden, res) {

    var imgLogo = 'logo_edomex.png';
    var imgLogoIsm = 'logo_isem.jpeg';
    var imgFooter = 'footer.png';

    /* var file = (location, name) => {
        return new Promise((resolve, reject) => {
            fs.readFile(location + name, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })

    } */

    const imageVerif = await getFileB64(imgFile);
    const logoImg = await getFileB64(imgLogo);
    const logoImgIsem = await getFileB64(imgLogoIsm);
    const logoFooter = await getFileB64(imgFooter);

    var docDefinition = {
        info: {
            title: `Orden ${dataOrden[0].num_orden}`
        },
        pageSize: 'LETTER',
        pageOrientation: 'portrait',
        pageMargins: [40, 40, 40, 0],
        content: [
            {
                columns: [
                    {
                        image: `${logoImg}`,
                        width: 130
                    },
                    {
                        text: ``, alignment: 'right', style: 'small', bold: true
                    },
                    {
                        image: `${logoImgIsem}`, width: 200
                    }
                ]
            },
            { text: '\n???2021. A??o de la Consumaci??n de la Independencia y la Grandeza de M??xico???.\n', style: 'header' },
            {
                columns: [
                    {
                        text: `NO. ORDEN: ${dataOrden[0].cadena}\n`, alignment: 'right', style: 'small', bold: true
                    }
                ]
            },
            {
                columns: [
                    {
                        text: `TOLUCA DE LERDO, M??XICO; A ${dataOrden[0].dia} DE ${dataOrden[0].mes} DE ${dataOrden[0].anio}\n\n`, alignment: 'right', style: 'small', bold: true
                    }
                ]
            },
            { text: 'Con fundamento en los art??culos 4 p??rrafo cuarto, 14, 16, 21 y 73 fracci??n XVI, regla tercera de la Constituci??n Pol??tica de los Estados Unidos Mexicanos; 1, 3 fracciones XIII, XIV, XV, XVI, XXII y XXIV, 4 fracci??n IV, 13 apartado B) fracciones I, IV y VI, 18, del 128 129, al 132, 194, 200 BIS, 393, 395, 396 fracci??n I, 397, 398, 399, 400, 401, 402, 403, 404 fracciones VII, X y XIII, 411, 412, 414, 431, 436 y 437 de la Ley General de Salud; 2 fracciones I incisos a) y c), II inciso e), 4, 6, 61, 66, 67, 68, 69, 70, 72, 73, 74, 75, 76, 77, 78, 79, 82, 133, 206, 1335 fracci??n II, 1336 y 1346 del Reglamento de la Ley General de Salud en Materia de Control Sanitario de Actividades, Establecimientos, Productos y Servicios; NORMA Oficial Mexicana NOM-047-SSA1-2011, Salud ambiental-??ndices biol??gicos de exposici??n para el personal ocupacionalmente expuesto a sustancias qu??micas; NORMA OFICIAL MEXICANA NOM-048-SSA1-1993, QUE ESTABLECE EL METODO NORMALIZADO PARA LA EVALUACION DE RIESGOS A LA SALUD COMO CONSECUENCIA DE AGENTES AMBIENTALES; NORMA OFICIAL MEXICANA NOM-056-SSA1-1993, REQUISITOS SANITARIOS DEL EQUIPO DE PROTECCION PERSONAL; Cl??usulas PRIMERA, SEGUNDA, CUARTA y S??PTIMA del Acuerdo Espec??fico de Coordinaci??n para el ejercicio de facultades en materia de control y fomento sanitarios publicado en el Diario Oficial de la Federaci??n del trece de diciembre de dos mil cuatro; 2, 3, 19 fracci??n IV, 25 y 26 de la Ley Org??nica de la Administraci??n P??blica del Estado de M??xico; 1.1 fracci??n I, 2.4, y 2.5 del C??digo Administrativo del Estado de M??xico; 1, 19 y 128 del C??digo de Procedimientos Administrativos del Estado de M??xico; y 1, 6, 14 fracci??n VIII y 25 fracciones I, III, VII y XI del Reglamento Interno del Instituto de Salud del Estado de M??xico; 57 y 110 del Reglamento de Salud del Estado de M??xico; ACUERDO por el que se establecen los Lineamientos T??cnicos Espec??ficos para la Reapertura de las Actividades Econ??micas, publicado en el Diario Oficial de la Federaci??n el veintinueve de mayo de dos mil veinte; ART??CULOS PRIMERO, SEGUNDO, TERCERO, QUINTO, SEXTO, S??PTIMO y transitorio PRIMERO del ACUERDO POR EL QUE SE FORTALECEN LAS MEDIDAS PREVENTIVAS Y DE SEGURIDAD PARA LA MITIGACI??N Y CONTROL DE LOS RIESGOS PARA LA SALUD QUE IMPLICA LA ENFERMEDAD POR EL VIRUS (COVID-19), EN EL ESTADO DE M??XICO Y SE ESTABLECE UN PROGRAMA DE VERIFICACI??N PARA SU CUMPLIMIENTO, publicado en el peri??dico oficial ???Gaceta del Gobierno??? del Estado de M??xico, del veintid??s de abril del dos mil veinte; ART??CULOS PRIMERO, SEGUNDO, TERCERO y transitorios SEGUNDO y TERCERO del ACUERDO DEL EJECUTIVO DEL ESTADO PARA LA TRANSICI??N GRADUAL DE LAS ACCIONES PREVENTIVAS DETERMINADAS CON MOTIVO DE LA EPIDEMIA CAUSADA POR EL VIRUS SARSCOV2 (COVID 19) PARA EL GOBIERNO DEL ESTADO DE M??XICO, publicado en el peri??dico oficial ???Gaceta del Gobierno??? del Estado de M??xico, del tres de julio de dos mil veinte;  ART??CULOS PRIMERO, TERCERO, CUARTO, QUINTO, SEXTO, S??PTIMO, OCTAVO, NOVENO, D??CIMO TERCERO, D??CIMO CUARTO y transitorios PRIMERO y SEGUNDO del ACUERDO POR EL QUE SE ESTABLECE EL PLAN PARA EL REGRESO SEGURO A LAS ACTIVIDADES ECON??MICAS, SOCIALES, GUBERNAMENTALES Y EDUCATIVAS CON MOTIVO DEL VIRUS SARS-CoV2 (COVID-19), EN EL ESTADO DE M??XICO, publicado en el peri??dico oficial ???Gaceta del Gobierno??? del Estado de M??xico, del tres de julio de dos mil veinte; ART??CULOS PRIMERO, SEGUNDO, TERCERO, QUINTO, SEXTO y transitorios PRIMERO y SEGUNDO del ACUERDO POR EL QUE SE FORTALECEN LAS MEDIDAS PREVENTIVAS Y DE SEGURIDAD PARA LA MITIGACI??N Y CONTROL DE LOS RIESGOS PARA LA SALUD QUE IMPLICA LA ENFERMEDAD POR EL VIRUS (COVID-19), EN EL ESTADO DE M??XICO, del dieciocho de diciembre del dos mil veinte; ART??CULOS PRIMERO Y TERCERO y transitorio ??NICO del ACUERDO QUE MODIFICA EL DIVERSO POR EL QUE SE FORTALECEN LAS MEDIDAS PREVENTIVAS Y DE SEGURIDAD PARA LA MITIGACI??N Y CONTROL DE LOS RIESGOS PARA LA SALUD QUE IMPLICA LA ENFERMEDAD POR EL VIRUS (COVID-19), EN EL ESTADO DE M??XICO, PUBLICADO EL 18 DE DICIEMBRE DE 2020 EN EL PERI??DICO  OFICIAL ???GACETA DEL GOBIERNO???, del ocho de enero de dos mil veintiuno; se expide la presente ORDEN DE VISITA, de tipo ORDINARIA, para ser practicada en:\n\n', style: 'parragrafh' },
            {
                text: [
                    { text: 'Giro: ', style: 'small', bold: true },
                    `${dataOrden[0].giro}\n`
                ],
                style: 'small'
            },
            {
                text: [
                    { text: 'Denominaci??n Comercial / Raz??n Social: ', style: 'small', bold: true },
                    `${dataOrden[0].rfc}\n`
                ],
                style: 'small'
            },
            {
                text: [
                    { text: 'Ubicado en: ', style: 'small', bold: true },
                    `${dataOrden[0].ubicacion}\n`
                ],
                style: 'small'
            },
            {
                text: [
                    'Propietario, Responsable, Encargado u Ocupante: \n\n'
                ],
                bold: true,
                style: 'small'
            },
            {
                text: [
                    'Se hace de su conocimiento, ',
                    { text: `${dataOrden[0].nombre_verif} `, style: 'small', bold: true },
                    'verificadores sanitarios adscritos a la Coordinaci??n de Regulaci??n Sanitaria y Comisi??n para la Protecci??n contra Riesgos Sanitarios del Estado de M??xico, cuyas fotograf??as deber??n coincidir con las credenciales vigentes con que se identifiquen, han sido designados para efectuar la Visita de Verificaci??n sanitaria en los siguientes t??rminos:\n\n'
                ],
                style: 'small',
                alignment: 'justify'
            },
            {
                image: `${imageVerif}`,
                width: 30,
                alignment: 'center'
            },
            {
                text: [
                    { text: '\nOBJETO: ', style: 'small', bold: true },
                    'Practicar visita de verificaci??n sanitaria en el establecimiento, instalaciones, equipos, maquinaria, aparatos, y manejo de sustancias, para constatar el cumplimiento del ACUERDO QUE MODIFICA EL DIVERSO POR EL QUE SE FORTALECEN LAS MEDIDAS PREVENTIVAS Y DE SEGURIDAD PARA LA MITIGACI??N Y CONTROL DE LOS RIESGOS PARA LA SALUD QUE IMPLICA LA ENFERMEDAD POR EL VIRUS (COVID-19), EN EL ESTADO DE M??XICO, PUBLICADO EL 18 DE DICIEMBRE DE 2020 EN EL PERI??DICO  OFICIAL ???GACETA DEL GOBIERNO???, del ocho de enero de dos mil veintiuno, as?? como para constatar las condiciones higi??nico sanitarias y de saneamiento b??sico que prevalecen en el mismo; las condiciones en que labora el personal ocupacionalmente expuesto, as?? como las medidas implementadas conforme a la normatividad sanitaria vigente, para reducir los riesgos en la salud de dicho personal.\n\n'
                ],
                style: 'small',
                alignment: 'justify'
            },
            { text: 'ALCANCE: \n\n', style: 'small', bold: true },
            {
                ol: [
                    'Verificar documentaci??n sanitaria (Aviso de funcionamiento).',
                    'Verificar evidencia documental de capacitaci??n al personal ocupacionalmente expuesto, estudios correspondientes de acuerdo a la actividad ocupacional que desarrollan. ',
                    'Verificar el uso de equipos de protecci??n personal para el trabajo, adecuado a la actividad que desarrolla el personal ocupacionalmente expuesto.',
                    'Verificar condiciones generales de mantenimiento, orden y aseo; iluminaci??n y ventilaci??n adecuada, servicios sanitarios con mobiliario y dotaci??n higi??nica suficiente; casilleros, letreros alusivos a la higiene del personal, dep??sitos para basura y ??rea de disposici??n temporal de residuos sanitarios, drenaje municipal u otras alternativas de disposici??n de aguas residuales.',
                    'Verificar los servicios generales del establecimiento, equipos y utensilios, manuales escritos de conservaci??n y mantenimiento de los mismos.',
                    'Verificar la evidencia documental de control de plagas realizado por personal autorizado, ausencia de fauna nociva y animales dom??sticos, instalaci??n de dispositivos para su control.'
                ],
                style: 'small',
                alignment: 'justify'
            },
            {
                image: `${logoFooter}`,
                width: 515,

                alignment: 'center'
            }
        ],
        styles: {
            header: {
                fontSize: 10,
                font: 'Helvetica',
                alignment: 'center'
            },
            subheader: {
                fontSize: 12,
                bold: true
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 6.5,
                font: 'Helvetica',
            },
            superMargin: {
                margin: [20, 0, 40, 0],
                fontSize: 15
            },
            parragrafh: {
                fontSize: 6.5,
                font: 'Helvetica',
                alignment: 'justify'
            },
            tableHeader: {
                bold: true
            }
        },

        /*  footer: 
             {
                 image: `${logoFooter}`,
                 width: 300,
                 alignment: 'center'
             } */

    }

    createPdfBinary(docDefinition, function (binary) {
        res.contentType('application/pdf');
        res.send(binary);
    }, function (error) {
        res.send('ERROR:' + error);
    });




}

/* async function createDir(dir) {
    try {
        await fsPromises.access(dir, fs.constants.F_OK);
    } catch (e) {
        await fsPromises.mkdir(dir);
    }
} */

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