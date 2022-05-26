const pool = require('../config/db');
const moment = require('moment');

exports.empresa = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/empresa/empresa', {
            nombrePagina: 'Empresa'
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.infoEmpresa = async (req, res) => {

    var empresa = await pool.query('SELECT * FROM empresa');

    const dataEmpresa = [];

    if (empresa.length === 0) {

        res.send('Empty');

    } else {

        for (var x = 0; x < empresa.length; x++) {
            const arrayEmpresa = empresa[x];
            dataEmpresa.push(arrayEmpresa);
        }

        res.send(dataEmpresa);

    }

}

exports.guardarEmpresa = async (req, res) => {

    const { nombre_empresa, razon_social, web_site } = req.body;
    var conteo = 0;

    const newEmpresa = {
        nombre_empresa,
        razon_social,
        web_site
    };

    var infoEmpresa = await pool.query('SELECT * FROM empresa');


    if (infoEmpresa.length === 0) {

        await pool.query('INSERT INTO empresa SET ?', [newEmpresa]);

        res.status(200).send('Creado');

    } else {

        for (var x = 0; x < infoEmpresa.length; x++) {
            const arrayEmpresa = infoEmpresa[x];
            var empresa_base = arrayEmpresa.nombre_empresa;
            var razon_social_base = arrayEmpresa.razon_social;
            var web_site_base = arrayEmpresa.web_site;
        }

        if (nombre_empresa !== empresa_base) {
            await pool.query('UPDATE empresa SET nombre_empresa = ?', [nombre_empresa]);
            var conteo = conteo + 1;
        }

        if (razon_social !== razon_social_base) {
            await pool.query('UPDATE empresa SET razon_social = ?', [razon_social]);
            var conteo = conteo + 1;
        }

        if (web_site !== web_site_base) {
            await pool.query('UPDATE empresa SET web_site = ?', [web_site]);
            var conteo = conteo + 1;
        }

        if (conteo > 0) {

            res.send('Actualizado');

        } else {
            res.send('Nulos');

        }


    }

}

exports.permisos = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/menu/permisos_xperfil', {
            nombrePagina: 'Permisos'
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }
}

exports.permisosxPerfil = async (req, res) => {

    let idPerfil = req.params.id;

    var dataPermisos = await pool.query('call get_permisos_xperfil(?)', idPerfil);

    const results = dataPermisos[0];

    const dataset = [];

    for (var x = 0; x < results.length; x++) {

        const array = results[x];

        if (array.acceso === 1) {

            var checkBoxAcceso = "<input type='checkbox' class='checkAcceso' idPadre=" + "'" + array.id_padre + "'" + " idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "c' checked" + ">";

            if (array.id_padre === 0) {
                var checkBoxCrear = null;
                var checkBoxEditar = null;
                var checkBoxEliminar = null;
            } else {
                if (array.crear === 1) {
                    var checkBoxCrear = "<input type='checkbox' class='checkCrear' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "cc' checked" + ">";
                } else {
                    var checkBoxCrear = "<input type='checkbox' class='checkCrear' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "cc' " + ">";
                }

                if (array.editar === 1) {
                    var checkBoxEditar = "<input type='checkbox' class='checkEditar' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "ce' checked" + ">";
                } else {
                    var checkBoxEditar = "<input type='checkbox' class='checkEditar' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "ce' " + ">";
                }

                if (array.eliminar === 1) {
                    var checkBoxEliminar = "<input type='checkbox' class='checkEliminar' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "cel' checked" + ">";
                } else {
                    var checkBoxEliminar = "<input type='checkbox' class='checkEliminar' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "cel' " + ">";
                }

            }


        } else {

            var checkBoxAcceso = "<input type='checkbox' class='checkAcceso' idPadre=" + "'" + array.id_padre + "'" + " idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "c' " + ">";

            if (array.id_padre === 0) {
                var checkBoxCrear = null;
                var checkBoxEditar = null;
                var checkBoxEliminar = null;
            } else {
                var checkBoxCrear = "<input type='checkbox' class='checkCrear' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "cc' " + " disabled>";
                var checkBoxEditar = "<input type='checkbox' class='checkEditar' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "ce' " + " disabled>";
                var checkBoxEliminar = "<input type='checkbox' class='checkEliminar' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "cel' " + " disabled>";
            }

        }

        const obj = [
            array.new_orden,
            array.idmenu,
            array.menu,
            checkBoxAcceso,
            checkBoxCrear,
            checkBoxEditar,
            checkBoxEliminar,
            array.id_padre
        ];

        dataset.push(obj);
    }

    res.send(dataset)

}


exports.activarPermxPerfil = async (req, res) => {

    var { idmenu, idperfil, acceso, permiso } = req.body;

    if (permiso === 'accesar') {

        var crear = 0;
        var editar = 0;
        var eliminar = 0;

        const newPermiso = {
            idmenu,
            idperfil,
            acceso,
            crear,
            editar,
            eliminar
        };

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xperfil WHERE idmenu=? and idperfil=?', [idmenu, idperfil]);

        var exist = countExist[0].cuenta;

        if (exist === 0) {

            await pool.query('INSERT INTO permisos_xperfil SET ?', [newPermiso]);

            res.send('Insertado');

        } else {

            if (newPermiso.acceso === 0) {
                await pool.query('UPDATE permisos_xperfil SET acceso = ?, crear = ?, editar = ?, eliminar = ? WHERE idmenu = ? AND idperfil=?', [newPermiso.acceso, newPermiso.crear, newPermiso.editar, newPermiso.eliminar, newPermiso.idmenu, newPermiso.idperfil]);
            } else {
                await pool.query('UPDATE permisos_xperfil SET acceso = ? WHERE idmenu = ? AND idperfil=?', [newPermiso.acceso, newPermiso.idmenu, newPermiso.idperfil]);
            }

            res.send('Actualizado');

        }

    }

    if (permiso === 'crear') {

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xperfil WHERE idmenu=? and idperfil=?', [idmenu, idperfil]);

        var exist = countExist[0].cuenta;

        if (exist === 1) {

            await pool.query('UPDATE permisos_xperfil SET crear = ? WHERE idmenu = ? AND idperfil=?', [acceso, idmenu, idperfil]);

            res.send('Actualizado');

        } else {
            res.send('Error');
        }

    }
    
    if(permiso === 'editar'){

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xperfil WHERE idmenu=? and idperfil=?', [idmenu, idperfil]);

        var exist = countExist[0].cuenta;

        if (exist === 1) {

            await pool.query('UPDATE permisos_xperfil SET editar = ? WHERE idmenu = ? AND idperfil=?', [acceso, idmenu, idperfil]);

            res.send('Actualizado');

        } else {
            res.send('Error');
        }

    }

    if (permiso === 'eliminar') {

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xperfil WHERE idmenu=? and idperfil=?', [idmenu, idperfil]);

        var exist = countExist[0].cuenta;

        if (exist === 1) {

            await pool.query('UPDATE permisos_xperfil SET eliminar = ? WHERE idmenu = ? AND idperfil=?', [acceso, idmenu, idperfil]);

            res.send('Actualizado');

        } else {
            res.send('Error');
        }

    }

}

exports.permisosxUsuario = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/menu/permisos_xusuario', {
            nombrePagina: 'Permisos'
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.getpermisosxUsuario = async (req, res) => {

    let idUser = req.params.id;

    var dataPermisos = await pool.query('call get_permisos_xusuario(?)', idUser);

    const results = dataPermisos[0];

    const dataset = [];

    for (var x = 0; x < results.length; x++) {

        const array = results[x];

        if (array.acceso === 1) {

            var checkBoxAcceso = "<input type='checkbox' class='checkAccesoUser' idPadre=" + "'" + array.id_padre + "'" + " idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "u' checked" + ">";

            if (array.id_padre === 0) {
                var checkBoxCrear = null;
                var checkBoxEditar = null;
                var checkBoxEliminar = null;
            } else {
                if (array.crear === 1) {
                    var checkBoxCrear = "<input type='checkbox' class='checkCrearxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "uc' checked" + ">";
                } else {
                    var checkBoxCrear = "<input type='checkbox' class='checkCrearxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "uc' " + ">";
                }

                if (array.editar === 1) {
                    var checkBoxEditar = "<input type='checkbox' class='checkEditarxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "ue' checked" + ">";
                } else {
                    var checkBoxEditar = "<input type='checkbox' class='checkEditarxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "ue' " + ">";
                }

                if (array.eliminar === 1) {
                    var checkBoxEliminar = "<input type='checkbox' class='checkEliminarxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "uel' checked" + ">";
                } else {
                    var checkBoxEliminar = "<input type='checkbox' class='checkEliminarxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "uel' " + ">";
                }

            }


        } else {

            var checkBoxAcceso = "<input type='checkbox' class='checkAccesoUser' idPadre=" + "'" + array.id_padre + "'" + " idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "u' " + ">";

            if (array.id_padre === 0) {
                var checkBoxCrear = null;
                var checkBoxEditar = null;
                var checkBoxEliminar = null;
            } else {
                var checkBoxCrear = "<input type='checkbox' class='checkCrearxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "uc' " + " disabled>";
                var checkBoxEditar = "<input type='checkbox' class='checkEditarxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "ue' " + " disabled>";
                var checkBoxEliminar = "<input type='checkbox' class='checkEliminarxUser' idMenu=" + "'" + array.idmenu + "'" + " id=" + "'" + array.idmenu + "uel' " + " disabled>";
            }

        }

        const obj = [
            array.new_orden,
            array.idmenu,
            array.menu,
            checkBoxAcceso,
            checkBoxCrear,
            checkBoxEditar,
            checkBoxEliminar,
            array.id_padre
        ];

        dataset.push(obj);
    }

    res.send(dataset)

}

exports.activarPermxUser = async (req, res) => {

    var { idmenu, idusuario, acceso, permiso } = req.body;

    if (permiso === 'accesar') {

        var crear = 0;
        var editar = 0;
        var eliminar = 0;

        const newPermiso = {
            idmenu,
            idusuario,
            acceso,
            crear,
            editar,
            eliminar
        };

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xusuario WHERE idmenu=? and idusuario=?', [idmenu, idusuario]);

        var exist = countExist[0].cuenta;

        if (exist === 0) {

            await pool.query('INSERT INTO permisos_xusuario SET ?', [newPermiso]);

            res.send('Insertado');

        } else {

            if (newPermiso.acceso === 0) {
                await pool.query('UPDATE permisos_xusuario SET acceso = ?, crear = ?, editar = ?, eliminar = ? WHERE idmenu = ? AND idusuario=?', [newPermiso.acceso, newPermiso.crear, newPermiso.editar, newPermiso.eliminar, newPermiso.idmenu, newPermiso.idusuario]);
            } else {
                await pool.query('UPDATE permisos_xusuario SET acceso = ? WHERE idmenu = ? AND idusuario=?', [newPermiso.acceso, newPermiso.idmenu, newPermiso.idusuario]);
            }

            res.send('Actualizado');

        }

    }

    if (permiso === 'crear') {

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xusuario WHERE idmenu=? and idusuario=?', [idmenu, idusuario]);

        var exist = countExist[0].cuenta;

        if (exist === 1) {

            await pool.query('UPDATE permisos_xusuario SET crear = ? WHERE idmenu = ? AND idusuario=?', [acceso, idmenu, idusuario]);

            res.send('Actualizado');

        } else {
            res.send('Error');
        }

    }

    if (permiso === 'editar') {

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xusuario WHERE idmenu=? and idusuario=?', [idmenu, idusuario]);

        var exist = countExist[0].cuenta;

        if (exist === 1) {

            await pool.query('UPDATE permisos_xusuario SET editar = ? WHERE idmenu = ? AND idusuario=?', [acceso, idmenu, idusuario]);

            res.send('Actualizado');

        } else {
            res.send('Error');
        }

    }

    if (permiso === 'eliminar') {

        var countExist = await pool.query('SELECT COUNT(1) AS cuenta FROM permisos_xusuario WHERE idmenu=? and idusuario=?', [idmenu, idusuario]);

        var exist = countExist[0].cuenta;

        if (exist === 1) {

            await pool.query('UPDATE permisos_xusuario SET eliminar = ? WHERE idmenu = ? AND idusuario=?', [acceso, idmenu, idusuario]);

            res.send('Actualizado');

        } else {
            res.send('Error');
        }

    }

}


exports.oficinas = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);
    var permisoCrear = await validaPermisoCrear(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/empresa/oficinas', {
            nombrePagina: 'Oficinas',
            permisoCrear
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.agregarOficina = async (req, res) => {

    const { oficina, fecha_creacion, status } = req.body;

    var valFolio = await pool.query('SELECT IFNULL(MAX(idoficina),100)+1 AS idofi FROM oficinas');

    for (var x = 0; x < valFolio.length; x++) {
        var idoficina = valFolio[x].idofi;
    }

    const newOffice = {
        idoficina,
        oficina,
        fecha_creacion,
        status
    };

    const existOffice = await pool.query('SELECT * FROM oficinas WHERE oficina = ?', newOffice.oficina);

    if (existOffice.length > 0) {

        res.send('Repetido');

    } else {

        await pool.query('INSERT INTO oficinas SET ?', [newOffice]);

        res.status(200).send('Oficina Creada Correctamente');
    }

}

exports.mostrarOficinas = async (req, res) => {

    const values = await pool.query('SELECT * FROM oficinas');
    const idUsuario = res.locals.usuario.idusuario;
    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataOficinas = [];
        const route = '/oficinas';

        var permisoEditar = await validaPermisoEditar(idUsuario, route);
        var permisoEliminar = await validaPermisoEliminar(idUsuario, route);


        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayOficinas = values[x];

            if(permisoEditar > 0){

                var botonEditar = "<button type='button' id='btn-editar-oficina' class='btn btn-warning' data-toggle='modal' data-target='#modalEditarOficina' idOficina=" + "'" + arrayOficinas.idoficina + "'" + "><i class='fas fa-pencil-alt'></i></button>";

                if (arrayOficinas.status === 0) {
                    var status = "<button type='button' id='btn-estatus-oficina' class='btn btn-danger btn-sm' estadoOficina='1' idOficina=" + "'" + arrayOficinas.idoficina + "'" + ">Desactivado</button>";
                } else {
                    var status = "<button type='button' id='btn-estatus-oficina' class='btn btn-success btn-sm' estadoOficina='0' idOficina=" + "'" + arrayOficinas.idoficina + "'" + ">Activado</button>";
                }

            }else{

                var botonEditar = "<button type='button' id='btn-editar-oficina' class='btn btn-warning' data-toggle='modal' data-target='#modalEditarOficina' idOficina=" + "'" + arrayOficinas.idoficina + "'" + "' disabled" + "><i class='fas fa-pencil-alt'></i></button>";

                if (arrayOficinas.status === 0) {
                    var status = "<button type='button' id='btn-estatus-oficina' class='btn btn-danger btn-sm' estadoOficina='1' idOficina=" + "'" + arrayOficinas.idoficina + "'" + "' disabled" + ">Desactivado</button>";
                } else {
                    var status = "<button type='button' id='btn-estatus-oficina' class='btn btn-success btn-sm' estadoOficina='0' idOficina=" + "'" + arrayOficinas.idoficina + "'" + "' disabled" + ">Activado</button>";
                }

            }

            var botones = "<div class='btn-group'>" + botonEditar + "</div>";

            

            var fecha = moment(arrayOficinas.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayOficinas.idoficina,
                arrayOficinas.oficina,
                fecha,
                status,
                botones
            ];

            dataOficinas.push(obj);
        }

        res.send(dataOficinas);
    }
}

exports.activarOficina = async (req, res) => {

    const { idOficina, estadoOficina } = req.body;

    await pool.query('UPDATE oficinas SET status = ? WHERE idoficina = ?', [estadoOficina, idOficina]);

    res.status(200).send('La oficina ha sido actualizada');

}

exports.mostrarOficina = async (req, res) => {

    let idOficina = req.params.id;

    const dataOficina = await pool.query('SELECT * FROM oficinas WHERE idoficina = ?', idOficina);

    res.status(200).send(dataOficina);

}

exports.editarOficina = async (req, res) => {

    let idOficina = req.params.id;
    let newOficina = req.body.newOficina;

    const oficinaSinCambio = await pool.query('SELECT * FROM oficinas WHERE oficina = ? AND idoficina= ?', [newOficina, idOficina]);
    const oficinaRepetido = await pool.query('SELECT * FROM oficinas WHERE oficina = ?', newOficina);

    if (oficinaSinCambio.length > 0) {
        res.send('Igual');
    } else {

        if (oficinaRepetido.length > 0) {
            res.send('Repetido');
        } else {
            await pool.query('UPDATE oficinas SET oficina = ? WHERE idoficina = ?', [newOficina, idOficina]);
            res.status(200).send('La oficina ha sido actualizada correctamente.');
        }
    }
}

exports.verificadores = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);
    var permisoCrear = await validaPermisoCrear(idUsuario, url);

    if (permiso > 0) {

        res.render('modulos/empresa/verificadores', {
            nombrePagina: 'Verificadores',
            permisoCrear
        });

    } else {

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.agregarVerifForm = async (req, res) => {
    res.render('modulos/empresa/agregar_verificador', {
        nombrePagina: 'Agregar Verificador'
    });
}

exports.agregarVerif = async (req, res) => {

    const { idempleado, status, fecha_creacion } = req.body;

    var valFolio = await pool.query(`SELECT LPAD(IFNULL(MAX(idverificador),0) + 1 , 4, '0') AS idver FROM verificadores`);


    for (var x = 0; x < valFolio.length; x++) {
        var idverificador = valFolio[x].idver;
    }

    const newLink = {
        idverificador,
        idempleado,
        status,
        fecha_creacion
    };

    const existVerif = await pool.query('SELECT * FROM verificadores WHERE idempleado = ?', newLink.idempleado);

    if (existVerif.length > 0) {

        res.send('Repetido');

    } else {

        await pool.query('INSERT INTO verificadores SET ?', [newLink]);

        res.status(200).send('Verificador Creado Correctamente!');

    }

}

exports.mostrarVerif = async (req, res) => {

    const values = await pool.query('SELECT a.idverificador, UPPER(b.nombre_completo) AS nombre_completo, b.email, b.telefono, a.status, a.fecha_creacion FROM verificadores a INNER JOIN empleados b ON a.idempleado=b.idempleado');
    const idUsuario = res.locals.usuario.idusuario;
    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataVerif = [];
        const route = '/verificadores';

        var permisoEditar = await validaPermisoEditar(idUsuario, route);
        var permisoEliminar = await validaPermisoEliminar(idUsuario, route);

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayVerif = values[x];

            if(permisoEditar > 0){
                if (arrayVerif.status === 0) {
                    var status = "<button type='button' id='btn-estatus-verif' class='btn btn-danger btn-sm' estadoVerif='1' idVerif=" + "'" + arrayVerif.idverificador + "'" + ">Desactivado</button>";
                } else {
                    var status = "<button type='button' id='btn-estatus-verif' class='btn btn-success btn-sm' estadoVerif='0' idVerif=" + "'" + arrayVerif.idverificador + "'" + ">Activado</button>";
                }
            }else{
                if (arrayVerif.status === 0) {
                    var status = "<button type='button' id='btn-estatus-verif' class='btn btn-danger btn-sm' estadoVerif='1' idVerif=" + "'" + arrayVerif.idverificador + "'" + "'" + "' disabled" + ">Desactivado</button>";
                } else {
                    var status = "<button type='button' id='btn-estatus-verif' class='btn btn-success btn-sm' estadoVerif='0' idVerif=" + "'" + arrayVerif.idverificador + "'" + "'" + "' disabled" + ">Activado</button>";
                }
            }

            var fecha = moment(arrayVerif.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayVerif.idverificador,
                arrayVerif.nombre_completo,
                arrayVerif.email,
                arrayVerif.telefono,
                fecha,
                status
                //botones
            ];

            dataVerif.push(obj);
        }

        res.send(dataVerif);
    }
}

exports.activarVerif = async (req, res) => {

    const { idVerif, estadoVerif } = req.body;

    await pool.query('UPDATE verificadores SET status = ? WHERE idverificador = ?', [estadoVerif, idVerif]);

    res.status(200).send('El verificador ha sido actualizado correctamente!');

}


exports.mostrarVerifActivos = async (req, res) => {

    const { status } = req.body;

    const values = await pool.query('SELECT a.idverificador, UPPER(b.nombre_completo) AS nombre_completo, b.email, b.telefono, a.status, a.fecha_creacion FROM verificadores a INNER JOIN empleados b ON a.idempleado=b.idempleado WHERE a.status= ?', status);

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataVerif = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayVerif = values[x];

            var fecha = moment(arrayVerif.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayVerif.idverificador,
                arrayVerif.nombre_completo,
                fecha,
                arrayVerif.status
            ];

            dataVerif.push(obj);
        }

        res.send(dataVerif);
    }
}

exports.mostrarOficActivas = async (req, res) => {

    const { status } = req.body;

    const values = await pool.query('SELECT * FROM oficinas WHERE status= ?', status);

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataOfic = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayOfic = values[x];

            var fecha = moment(arrayOfic.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayOfic.idoficina,
                arrayOfic.oficina,
                fecha,
                arrayOfic.status
            ];

            dataOfic.push(obj);
        }

        res.send(dataOfic);
    }
}

exports.mostrarActiviActivos = async (req, res) => {

    const { status } = req.body;

    const values = await pool.query('SELECT * FROM actividades WHERE status= ?', status);

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataActi = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayActi = values[x];

            const obj = [
                conteo,
                arrayActi.idactividad,
                arrayActi.actividad,
                arrayActi.status
            ];

            dataActi.push(obj);
        }

        res.send(dataActi);
    }
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

async function validaPermisoCrear(idUsuario, route) {

    var permiso = 0;

    var idPerfilQry = await pool.query('SELECT idperfil FROM usuarios WHERE idusuario=?', idUsuario);
    var idMenuQry = await pool.query('SELECT idmenu FROM menu WHERE url=?', route);

    var idPerfil = idPerfilQry[0].idperfil;
    var idMenu = idMenuQry[0].idmenu;

    var validPermU = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xusuario WHERE idmenu=? AND idusuario=? AND crear=1', [idMenu, idUsuario]);
    var validPermP = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xperfil WHERE idmenu=? AND idperfil=? AND crear=1', [idMenu, idPerfil]);

    var permiso = permiso + validPermU[0].cuenta + validPermP[0].cuenta;

    return permiso;

}

async function validaPermisoEditar(idUsuario, route) {

    var permiso = 0;

    var idPerfilQry = await pool.query('SELECT idperfil FROM usuarios WHERE idusuario=?', idUsuario);
    var idMenuQry = await pool.query('SELECT idmenu FROM menu WHERE url=?', route);

    var idPerfil = idPerfilQry[0].idperfil;
    var idMenu = idMenuQry[0].idmenu;

    var validPermU = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xusuario WHERE idmenu=? AND idusuario=? AND editar=1', [idMenu, idUsuario]);
    var validPermP = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xperfil WHERE idmenu=? AND idperfil=? AND editar=1', [idMenu, idPerfil]);

    var permiso = permiso + validPermU[0].cuenta + validPermP[0].cuenta;

    return permiso;

}

async function validaPermisoEliminar(idUsuario, route) {

    var permiso = 0;

    var idPerfilQry = await pool.query('SELECT idperfil FROM usuarios WHERE idusuario=?', idUsuario);
    var idMenuQry = await pool.query('SELECT idmenu FROM menu WHERE url=?', route);

    var idPerfil = idPerfilQry[0].idperfil;
    var idMenu = idMenuQry[0].idmenu;

    var validPermU = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xusuario WHERE idmenu=? AND idusuario=? AND eliminar=1', [idMenu, idUsuario]);
    var validPermP = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xperfil WHERE idmenu=? AND idperfil=? AND eliminar=1', [idMenu, idPerfil]);

    var permiso = permiso + validPermU[0].cuenta + validPermP[0].cuenta;

    return permiso;

}