const pool = require('../config/db');
const helpers = require('../config/helpers');

const moment = require('moment');

exports.usuarios = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    console.log(idUsuario);
    console.log(url);

    var permiso = await validAccess(idUsuario, url);

    if(permiso>0){

        res.render('modulos/usuarios/usuarios', {
            nombrePagina: 'Usuarios'
        });

    }else{

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }
}

exports.perfiles = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if(permiso>0){

        res.render('modulos/usuarios/perfiles', {
            nombrePagina: 'Perfiles'
        });

    }else{

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.empleados = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);

    if(permiso>0){

        res.render('modulos/empleados/empleados', {
            nombrePagina: 'Empleados'
        });

    }else{

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }
 
}

exports.agregarEmpleadoForm = async (req, res) => {
    res.render('modulos/empleados/agregar_empleado', {
        nombrePagina: 'Agregar Empleado'
    });
}

exports.editarEmpleadoForm = async (req, res) => {
    res.render('modulos/empleados/editar_empleado', {
        nombrePagina: 'Editar Empleado'
    });
}

exports.agregarUsuarioForm = async (req, res) => {
    res.render('modulos/usuarios/agregar_usuario', {
        nombrePagina: 'Agregar Usuario'
    });
}

exports.editarUsuarioForm = async (req, res) => {
    res.render('modulos/usuarios/editar_usuario', {
        nombrePagina: 'Editar Usuario'
    });
}

exports.mostrarPerfiles = async (req, res) => {

    const values = await pool.query('SELECT * FROM perfiles');

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataPerfiles = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayPerfiles = values[x];
            var botones = "<div class='btn-group'><button type='button' id='btn-editar-perfil' class='btn btn-warning' data-toggle='modal' data-target='#modalEditarPerfil' idPerfil=" + "'" + arrayPerfiles.idperfil + "'" + "><i class='fas fa-pencil-alt'></i></button><button id='btn-eliminar-perfil' class='btn btn-danger' idPerfil=" + "'" + arrayPerfiles.idperfil + "'" + "><i class='fa fa-times'></i></button></div>";

            if (arrayPerfiles.status === 0) {
                var status = "<button type='button' id='btn-estatus-perfil' class='btn btn-danger btn-sm' estadoPerfil='1' idPerfil=" + "'" + arrayPerfiles.idperfil + "'" + ">Desactivado</button>";
            } else {
                var status = "<button type='button' id='btn-estatus-perfil' class='btn btn-success btn-sm' estadoPerfil='0' idPerfil=" + "'" + arrayPerfiles.idperfil + "'" + ">Activado</button>";
            }

            var fecha = moment(arrayPerfiles.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayPerfiles.idperfil,
                arrayPerfiles.perfil,
                fecha,
                status,
                botones
            ];

            dataPerfiles.push(obj);
        }

        res.send(dataPerfiles);
    }
}

exports.mostrarPerfilesActivos = async (req, res) => {

    const { status } = req.body;

    const values = await pool.query('SELECT * FROM perfiles WHERE status= ?', status);

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataPerfiles = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayPerfiles = values[x];

            var fecha = moment(arrayPerfiles.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayPerfiles.idperfil,
                arrayPerfiles.perfil,
                fecha,
                arrayPerfiles.status
            ];

            dataPerfiles.push(obj);
        }

        res.send(dataPerfiles);
    }
}

exports.agregarPerfil = async (req, res) => {

    const { perfil, fecha_creacion, status } = req.body;

    var valFolio = await pool.query('SELECT IFNULL(MAX(idperfil),100)+1 AS idper FROM perfiles');

    for (var x = 0; x < valFolio.length; x++) {
        var idperfil = valFolio[x].idper;
    }

    const newLink = {
        idperfil,
        perfil,
        fecha_creacion,
        status
    };

    const existPerfil = await pool.query('SELECT * FROM perfiles WHERE perfil = ?', newLink.perfil);

    if (existPerfil.length > 0) {

        res.send('Repetido');

    } else {

        await pool.query('INSERT INTO perfiles SET ?', [newLink]);

        res.status(200).send('Perfil de Usuario Creado Correctamente');
    }

}


exports.activarPerfil = async (req, res) => {

    const { idPerfil, estadoPerfil } = req.body;

    await pool.query('UPDATE perfiles SET status = ? WHERE idperfil = ?', [estadoPerfil, idPerfil]);

    res.status(200).send('El perfil ha sido actualizado');

}

exports.eliminarPerfil = async (req, res) => {

    let idPerfil = req.params.id;

    var eliminarPerfil = await pool.query('DELETE FROM perfiles WHERE idperfil = ?', idPerfil);

    if (eliminarPerfil.affectedRows === 1) {
        res.status(200).send('El perfil ha sido eliminado.');
    } else {
        res.send('Inexistente');
    }

}

exports.mostrarPerfil = async (req, res) => {

    let idPerfil = req.params.id;

    const dataPerfil = await pool.query('SELECT * FROM perfiles WHERE idperfil = ?', idPerfil);

    res.status(200).send(dataPerfil);

}

exports.editarPerfil = async (req, res) => {

    let idPerfil = req.params.id;
    let newPerfil = req.body.newPerfil;

    const perfilSinCambio = await pool.query('SELECT * FROM perfiles WHERE perfil = ? AND idperfil= ?', [newPerfil, idPerfil]);
    const perfilRepetido = await pool.query('SELECT * FROM perfiles WHERE perfil = ?', newPerfil);

    if (perfilSinCambio.length > 0) {
        res.send('Igual');
    } else {

        if(perfilRepetido.length > 0){
            res.send('Repetido');
        }else{
            await pool.query('UPDATE perfiles SET perfil = ? WHERE idperfil = ?', [newPerfil, idPerfil]);
            res.status(200).send('El perfil ha sido actualizado correctamente.');
        }
    }
}

exports.agregarEmpleado = async (req, res) => {

    const { nombre, ap_paterno, ap_materno, email, telefono, nombre_completo, status_empleado, fecha_creacion, fecha_contratacion } = req.body;

    var valFolio = await pool.query('SELECT IFNULL(MAX(idempleado),100)+1 AS idemp FROM empleados');

    for (var x = 0; x < valFolio.length; x++) {
        var idempleado = valFolio[x].idemp;
    }

    const newLink = {
        idempleado,
        nombre,
        ap_paterno,
        ap_materno,
        email,
        telefono,
        nombre_completo,
        status_empleado,
        fecha_creacion,
        fecha_contratacion
    };

    const existEmpleado = await pool.query('SELECT * FROM empleados WHERE nombre_completo = ?', newLink.nombre_completo);

    if (existEmpleado.length > 0) {

        res.send('Repetido');

    } else {

        const validMail = await pool.query('SELECT * FROM empleados WHERE email = ?', newLink.email);

        if(validMail.length >0){

            res.send('CorreoRep');

        }else{

            await pool.query('INSERT INTO empleados SET ?', [newLink]);

            res.status(200).send('Empleado Creado Correctamente!');

        }
        
    }

}

exports.mostrarEmpleados = async (req, res) => {

    const values = await pool.query('SELECT * FROM empleados');

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataEmpleados = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayEmpleados = values[x];

            var botones = "<div class='btn-group'><a type='button' id='btn-editar-empleado' rel='nofollow' class='btn btn-warning' href=" + "'/editar_empleado/" + arrayEmpleados.idempleado + "'" + " idEmpleado=" + "'" + arrayEmpleados.idempleado + "'" + "><i class='fas fa-pencil-alt'></i></a><button id='btn-eliminar-empleado' class='btn btn-danger' idEmpleado=" + "'" + arrayEmpleados.idempleado + "'" + "><i class='fa fa-times'></i></button></div>";

            if (arrayEmpleados.status_empleado === 0) {
                var status = "<button type='button' id='btn-estatus-empleado' class='btn btn-danger btn-sm' estadoEmpleado='1' idEmpleado=" + "'" + arrayEmpleados.idempleado + "'" + ">Desactivado</button>";
            } else {
                var status = "<button type='button' id='btn-estatus-empleado' class='btn btn-success btn-sm' estadoEmpleado='0' idEmpleado=" + "'" + arrayEmpleados.idempleado + "'" + ">Activado</button>";
            }

            var fechaCreacion = moment(arrayEmpleados.fecha_creacion).format('DD/MM/YYYY hh:mm:ss a');
            var fechaContratacion = moment(arrayEmpleados.fecha_contratacion).format('DD/MM/YYYY');

            const obj = [
                conteo,
                arrayEmpleados.idempleado,
                arrayEmpleados.nombre_completo,
                arrayEmpleados.email,
                arrayEmpleados.telefono,
                fechaContratacion,
                fechaCreacion,
                status,
                botones
            ];

            dataEmpleados.push(obj);
        }

        res.send(dataEmpleados);
    }
}

exports.activarEmpleado = async (req, res) => {

    const { idEmpleado, estadoEmpleado } = req.body;

    await pool.query('UPDATE empleados SET status_empleado = ? WHERE idempleado = ?', [estadoEmpleado, idEmpleado]);

    res.status(200).send('El empleado ha sido actualizado');

}

exports.mostrarEmpleado = async (req, res) => {

    let idEmpleado = req.params.id;

    const dataEmpleado = await pool.query('SELECT * FROM empleados WHERE idempleado = ?', idEmpleado);

    res.status(200).send(dataEmpleado);


}

exports.editarEmpleado = async (req, res) => {

    var idEmpleado = req.params.id;
    const { nombre, ap_paterno, ap_materno, email, telefono, nombre_completo, fecha_contratacion } = req.body;
    var conteo = 0;

    const dataBase = await pool.query('SELECT * FROM empleados WHERE idempleado = ?', idEmpleado);

    for (var x = 0; x < dataBase.length; x++) {
        const arrayEmpleado = dataBase[x];
        var nombre_base = arrayEmpleado.nombre;
        var paterno_base = arrayEmpleado.ap_paterno;
        var materno_base = arrayEmpleado.ap_materno
        var email_base = arrayEmpleado.email;
        var telefono_base = arrayEmpleado.telefono;
        var fec_cont_base = moment(arrayEmpleado.fecha_contratacion).format('YYYY-MM-DD');
    }

    const validMail = await pool.query('SELECT * FROM empleados WHERE email = ? AND idempleado != ?', [email,idEmpleado]);

    if(validMail.length >0){

        res.send('CorreoRep');

    }else{

        if (nombre !== nombre_base) {
            await pool.query('UPDATE empleados SET nombre = ? WHERE idempleado = ?', [nombre, idEmpleado]);
            await pool.query('UPDATE empleados SET nombre_completo = ? WHERE idempleado = ?', [nombre_completo, idEmpleado]);
            var conteo = conteo + 1;
        }
    
        if (ap_paterno !== paterno_base) {
            await pool.query('UPDATE empleados SET ap_paterno = ? WHERE idempleado = ?', [ap_paterno, idEmpleado]);
            await pool.query('UPDATE empleados SET nombre_completo = ? WHERE idempleado = ?', [nombre_completo, idEmpleado]);
            var conteo = conteo + 1;
        }
    
        if (ap_materno !== materno_base) {
            await pool.query('UPDATE empleados SET ap_materno = ? WHERE idempleado = ?', [ap_materno, idEmpleado]);
            await pool.query('UPDATE empleados SET nombre_completo = ? WHERE idempleado = ?', [nombre_completo, idEmpleado]);
            var conteo = conteo + 1;
        }
    
        if (email !== email_base) {
            await pool.query('UPDATE empleados SET email = ? WHERE idempleado = ?', [email, idEmpleado]);
            var conteo = conteo + 1;
        }
    
        if (telefono !== telefono_base) {
            await pool.query('UPDATE empleados SET telefono = ? WHERE idempleado = ?', [telefono, idEmpleado]);
            var conteo = conteo + 1;
        }

        if (fecha_contratacion !== fec_cont_base) {
            await pool.query('UPDATE empleados SET fecha_contratacion = ? WHERE idempleado = ?', [fecha_contratacion, idEmpleado]);
            var conteo = conteo + 1;
        }
    
        if (conteo > 0) {
    
            res.send('Empleado Actualizado Correctamente');
    
        } else {
            res.send('Nulos');
    
        }
    }
}

exports.eliminarEmpleado = async (req, res) => {

    let idEmpleado = req.params.id;

    var eliminarEmpleado = await pool.query('DELETE FROM empleados WHERE idempleado = ?', idEmpleado);

    if (eliminarEmpleado.affectedRows === 1) {
        res.status(200).send('El empleado ha sido eliminado.');
    } else {
        res.send('Inexistente');
    }

}

exports.mostrarEmpleadosActivos = async (req, res) => {

    const { status } = req.body;

    const values = await pool.query('SELECT * FROM empleados WHERE status_empleado= ?', status);

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataEmpleados = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayEmpleados = values[x];

            var fecha = moment(arrayEmpleados.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayEmpleados.idempleado,
                arrayEmpleados.nombre,
                arrayEmpleados.ap_paterno,
                arrayEmpleados.ap_materno,
                arrayEmpleados.email,
                arrayEmpleados.telefono,
                arrayEmpleados.nombre_completo,
                fecha,
                arrayEmpleados.status
            ];

            dataEmpleados.push(obj);
        }

        res.send(dataEmpleados);
    }
}

exports.agregarUsuario = async (req, res) => {

    const { idempleado, usuario, passUser, idperfil, status_usuario, fecha_creacion } = req.body;

    var valFolio = await pool.query('SELECT IFNULL(MAX(idusuario),100)+1 AS idusr FROM usuarios');

    for (var x = 0; x < valFolio.length; x++) {
        var idusuario = valFolio[x].idusr;
    }

    var pass_usuario = await helpers.encryptPassword(passUser);

    const newLink = {
        idusuario,
        idempleado,
        usuario,
        pass_usuario,
        idperfil,
        status_usuario,
        fecha_creacion
    };

    const existUsuario = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', newLink.usuario);
    const existEmpleado = await pool.query('SELECT * FROM usuarios WHERE idempleado = ?', newLink.idempleado);

    if (existUsuario.length > 0) {

        res.send('RepetidoUsuario');

    } else {

        if (existEmpleado.length > 0) {

            res.send('RepetidoEmpleado');

        } else {

            await pool.query('INSERT INTO usuarios SET ?', [newLink]);

            res.status(200).send('Usuario Creado Correctamente!');
        }
    }
}


exports.mostrarUsuarios = async (req, res) => {

    const usuariosValues = await pool.query('SELECT a.idusuario, a.usuario, b.nombre_completo, a.status_usuario, c.perfil, a.fecha_creacion, a.fecha_ultimologin FROM usuarios a INNER JOIN empleados b on a.idempleado=b.idempleado INNER JOIN perfiles c on a.idperfil=c.idperfil order by 1');

    var valuesTotal = usuariosValues.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataUsuarios = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayUsuarios = usuariosValues[x];
            var botones = "<div class='btn-group'><a type='button' id='btn-editar-usuario' class='btn btn-warning' href=" + "'/editar_usuario/" + arrayUsuarios.idusuario + "'" + " idEmpleado=" + "'" + arrayUsuarios.idusuario + "'" + "><i class='fas fa-pencil-alt'></i></a><button id='btn-eliminar-usuario' class='btn btn-danger' idUsuario=" + "'" + arrayUsuarios.idusuario + "'" + "><i class='fa fa-times'></i></button></div>";
            
            if (arrayUsuarios.status_usuario > 0) {
                var status = "<button type='button' id='btn-estatus-usuario' class='btn btn-success btn-sm' estadoUsuario='0' idUsuario=" + "'" + arrayUsuarios.idusuario + "'" + ">Activado</button>";
            } else {
                var status = "<button type='button' id='btn-estatus-usuario' class='btn btn-danger btn-sm' estadoUsuario='1' idUsuario=" + "'" + arrayUsuarios.idusuario + "'" + ">Desactivado</button>";
            }
            var fechaCreacion = moment(arrayUsuarios.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            if(arrayUsuarios.fecha_ultimologin === null){
                var fechaLogin = "";
            }else{
                var fechaLogin = moment(arrayUsuarios.fecha_ultimologin).format('YYYY-MM-DD hh:mm:ss a');
            }
            
            const obj = [
                conteo,
                arrayUsuarios.idusuario,
                arrayUsuarios.usuario,
                arrayUsuarios.nombre_completo,
                arrayUsuarios.perfil,
                fechaCreacion,
                fechaLogin,
                status,
                botones
            ];

            dataUsuarios.push(obj);
        }

        res.send(dataUsuarios);
    }
}

exports.activarUsuario = async (req, res) => {

    const { idUsuario, estadoUsuario } = req.body;

    await pool.query('UPDATE usuarios SET status_usuario = ? WHERE idusuario = ?', [estadoUsuario, idUsuario]);

    res.status(200).send('El usuario ha sido actualizado');

}

exports.editarUsuario = async (req, res) => {

    const{ idusuario, usuario, idperfil } = req.body;

    var conteo = 0;

    const dataBase = await pool.query('SELECT * FROM usuarios WHERE idusuario = ?', idusuario);

    for (var x = 0; x < dataBase.length; x++) {
        const arrayUsuario = dataBase[x];
        var usuario_base = arrayUsuario.usuario;
        var idperfil_base = arrayUsuario.idperfil;
    }
    
    const validUser = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND idusuario != ?', [usuario, idusuario]);

    if(validUser.length > 0){

        res.send('UsuarioRep');

    }else{

         if(usuario != usuario_base){

            await pool.query('UPDATE usuarios SET usuario = ? WHERE idusuario = ?', [usuario, idusuario]);
            var conteo = conteo + 1;
        }


        if(idperfil != idperfil_base){

            await pool.query('UPDATE usuarios SET idperfil = ? WHERE idusuario = ?', [idperfil, idusuario]);
            var conteo = conteo + 1;
        }


        if (conteo > 0) {
    
            res.send('Usuario Actualizado Correctamente');
    
        } else {
            res.send('Nulos');
    
        }

    } 

}

exports.eliminarUsuario = async (req, res) => {

    let idUsuario = req.params.id;

    var eliminarUsuario = await pool.query('DELETE FROM usuarios WHERE idusuario = ?', idUsuario);

    if (eliminarUsuario.affectedRows === 1) {
        res.status(200).send('El usuario ha sido eliminado.');
    } else {
        res.send('Inexistente');
    }

}

exports.mostrarUsuario = async (req, res) => {

    let idUsuario = req.params.id;

    const dataUsuario = await pool.query('SELECT  a.idusuario, a.usuario, b.nombre_completo, a.status_usuario, c.perfil, c.idperfil, a.fecha_creacion, a.fecha_ultimologin FROM usuarios a INNER JOIN empleados b on a.idempleado=b.idempleado INNER JOIN perfiles c on a.idperfil=c.idperfil WHERE a.idusuario= ?', idUsuario);

    res.status(200).send(dataUsuario);
    
}

exports.mostrarUsuariosActivos = async (req, res) => {

    const { status } = req.body;

    const values = await pool.query('SELECT * FROM usuarios WHERE status_usuario= ?', status);

    var valuesTotal = values.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataUsuarios = [];

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayUsuarios = values[x];

            var fecha = moment(arrayUsuarios.fecha_creacion).format('YYYY-MM-DD hh:mm:ss a');

            const obj = [
                conteo,
                arrayUsuarios.idusuario,
                arrayUsuarios.usuario,
                fecha,
                arrayUsuarios.status_usuario
            ];

            dataUsuarios.push(obj);
        }

        res.send(dataUsuarios);
    }
}

async function validAccess(idUsuario, url){

    var permiso = 0;

    var idPerfilQry = await pool.query('SELECT idperfil FROM usuarios WHERE idusuario=?',idUsuario);
    var idMenuQry = await pool.query('SELECT idmenu FROM menu WHERE url=?',url);

    var idPerfil = idPerfilQry[0].idperfil;
    var idMenu = idMenuQry[0].idmenu;

    var validPermU = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xusuario WHERE idmenu=? AND idusuario=? AND acceso=1',[idMenu, idUsuario]);
    var validPermP = await pool.query('SELECT COUNT(1) as cuenta FROM permisos_xperfil WHERE idmenu=? AND idperfil=? AND acceso=1',[idMenu,idPerfil]);
    
    var permiso = permiso + validPermU[0].cuenta + validPermP[0].cuenta;

    return permiso

}