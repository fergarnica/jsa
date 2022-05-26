const pool = require('../config/db');

exports.home = async (req, res) => {

    var idusuario = res.locals.usuario.idusuario;

    var user = await pool.query('SELECT a.nombre FROM empleados a INNER JOIN usuarios b on a.idempleado=b.idempleado WHERE b.idusuario= ?', idusuario);
    var totVerif = await pool.query('SELECT COUNT(idverificador) AS total_verif FROM verificadores WHERE status=1');
    var totOrds = await pool.query('SELECT COUNT(idorden) AS total_ords FROM ordenes');
    var totOrdsAb = await pool.query('SELECT COUNT(idorden) AS total_ords_ab FROM ordenes WHERE idstatus_orden=1');

    nombre = user[0].nombre.toUpperCase();
    totalVerif = totVerif[0].total_verif;
    totalOrdenes = totOrds[0].total_ords;
    totalOrdenesAb = totOrdsAb[0].total_ords_ab;

    res.render('index', {
        nombrePagina: 'Inicio',
        nombre,
        totalVerif,
        totalOrdenes,
        totalOrdenesAb
    });

}

exports.menusActivos = async (req, res) => {

    var idusuario = res.locals.usuario.idusuario;

    //var menus = await pool.query('call get_menus_activos');
    var menus = await pool.query('call get_menus_activos_x_user(?)', idusuario);

    const dataMenus = [];

    if (menus.length === 0) {

        res.send('Empty');

    } else {

        for (var x = 0; x < menus.length; x++) {
            const arrayMenus = menus[x];
            dataMenus.push(arrayMenus);
        }

        res.send(dataMenus);

    }
}

exports.submenusActivos = async (req, res) => {

    var idusuario = res.locals.usuario.idusuario;

    //var submenus = await pool.query('call get_submenus_activos');
    var submenus = await pool.query('call get_submenus_activos_x_user(?)', idusuario);

    const datasubMenus = [];

    if (submenus.length === 0) {

        res.send('Empty');

    } else {

        for (var x = 0; x < submenus.length; x++) {
            const arraysubMenus = submenus[x];
            datasubMenus.push(arraysubMenus);
        }

        res.send(datasubMenus);

    }

}

exports.menus = async (req, res) => {

    var idUsuario = res.locals.usuario.idusuario;
    var url = req.originalUrl;

    var permiso = await validAccess(idUsuario, url);
    var permisoCrear = await validaPermisoCrear(idUsuario, url);

    if(permiso>0){

        res.render('modulos/menu/menus', {
            nombrePagina: 'Menús',
            permisoCrear
        });

    }else{

        res.render('modulos/error/401', {
            nombrePagina: '401 Unauthorized'
        });

    }

}

exports.mostrarMenus = async (req, res) => {

    const values = await pool.query('call get_all_menus');
    const idUsuario = res.locals.usuario.idusuario;
    const results = values[0];

    var valuesTotal = results.length;

    if (valuesTotal === 0) {

        res.send('empty');

    } else {

        const dataMenus = [];
        const route = '/menus';

        var permisoCrear = await validaPermisoCrear(idUsuario, route);
        var permisoEditar = await validaPermisoEditar(idUsuario, route);
        var permisoEliminar = await validaPermisoEliminar(idUsuario, route);

        for (var x = 0; x < valuesTotal; x++) {

            conteo = x + 1;
            const arrayMenus = results[x];

            if(permisoCrear>0){
                var botonCrear = "<a id='btn-agregar-submenu' class='btn btn-info' href=" + "'/agregar_submenu/" + arrayMenus.idmenu + "'" + " idMenu=" + "'" + arrayMenus.idmenu + "'" + "'" + "><i class='fa fa-plus'></i></a>";
            }else{
                var botonCrear = "<button id='btn-agregar-submenu' class='btn btn-info' idMenu=" + "'" + arrayMenus.idmenu + "'" + "'" + "' disabled" + "><i class='fa fa-plus'></i></button>";
            }

            if(permisoEditar>0){
                var botonEditar = "<a type='button' id='btn-editar-menu' class='btn btn-warning' href=" + "'/editar_menu/" + arrayMenus.idmenu + "'" + " idMenu=" + "'" + arrayMenus.idmenu + "'" + "><i class='fas fa-pencil-alt'></i></a>";
                if (arrayMenus.status === 0) {
                    var status = "<button type='button' id='btn-estatus-menu' class='btn btn-danger btn-sm' estadoMenu='1' idMenu=" + "'" + arrayMenus.idmenu + "'" + ">Desactivado</button>";
                } else {
                    var status = "<button type='button' id='btn-estatus-menu' class='btn btn-success btn-sm' estadoMenu='0' idMenu=" + "'" + arrayMenus.idmenu + "'" + ">Activado</button>";
                }
            }else{
                var botonEditar = "<button type='button' id='btn-editar-menu' class='btn btn-warning' idMenu=" + "'" + arrayMenus.idmenu + "'" + "' disabled" + "><i class='fas fa-pencil-alt'></i></button>";
                if (arrayMenus.status === 0) {
                    var status = "<button type='button' id='btn-estatus-menu' class='btn btn-danger btn-sm' estadoMenu='1' idMenu=" + "'" + arrayMenus.idmenu + "'" + "' disabled" + ">Desactivado</button>";
                } else {
                    var status = "<button type='button' id='btn-estatus-menu' class='btn btn-success btn-sm' estadoMenu='0' idMenu=" + "'" + arrayMenus.idmenu + "'" + "' disabled" + ">Activado</button>";
                }
            }

            if(permisoEliminar>0){
                var botonEliminar = "<button id='btn-eliminar-menu' class='btn btn-danger' idMenu=" + "'" + arrayMenus.idmenu + "'" + " idPadre=" + "'" + arrayMenus.id_padre + "'" +"><i class='fa fa-times'></i></button>";
            }else{
                var botonEliminar = "<button id='btn-eliminar-menu' class='btn btn-danger' idMenu=" + "'" + arrayMenus.idmenu + "'" + " idPadre=" + "'" + arrayMenus.id_padre + "'" +"' disabled" + "><i class='fa fa-times'></i></button>";
            }

            if (arrayMenus.id_padre === 0) {
                var botones = "<div class='btn-group'>" + botonCrear + botonEditar + botonEliminar + "</div>";
            } else {
                var botones = "<div class='btn-group'>"+ botonEditar + botonEliminar + "</div>";
            }

            const obj = [
                conteo,
                arrayMenus.idmenu,
                arrayMenus.new_orden,
                arrayMenus.menu,
                arrayMenus.url,
                arrayMenus.icono,
                status,
                botones,
                arrayMenus.id_padre
            ];

            dataMenus.push(obj);
        }

        res.send(dataMenus);
    }

}

exports.activarMenus = async (req, res) => {

    const { idMenu, estadoMenu } = req.body;

    await pool.query('UPDATE menu SET status = ? WHERE idmenu = ?', [estadoMenu, idMenu]);

    res.status(200).send('El menú ha sido actualizado');

}

exports.formAgregarMenu = async (req, res) => {

    var newIdMenu = await pool.query('SELECT IFNULL(MAX(idmenu),0)+1 as idmenu FROM menu');

    var newOrden = await pool.query('SELECT IFNULL(MAX(orden),0)+1 as orden FROM menu WHERE id_padre=0');

    var idmenu = newIdMenu[0].idmenu;
    var orden = newOrden[0].orden;

    res.render('modulos/menu/agregar_menu', {
        nombrePagina: 'Agregar Menú',
        idmenu,
        orden
    });
}

exports.agregarMenu = async (req, res) => {

    var { idmenu, menu_nombre, id_padre, orden, url, icono, status } = req.body;

    const newMenu = {
        idmenu,
        menu_nombre,
        id_padre,
        orden,
        url,
        icono,
        status
    };

    const existMenu = await pool.query('SELECT * FROM menu WHERE menu_nombre = ?', newMenu.menu_nombre);

    if (existMenu.length > 0) {
        res.send('Repetido');
    } else {
        await pool.query('INSERT INTO menu SET ?', [newMenu]);

        res.status(200).send('Menú creado Correctamente');
    }
}

exports.formAgregarSubmenu = async (req, res) => {

    var idMenuPadre = req.params.id;

    var nombreMenuPadre = await pool.query('SELECT menu_nombre FROM menu WHERE idmenu=?', idMenuPadre);
    var newOrdenSub = await pool.query('SELECT IFNULL(MAX(orden),0) +1 AS orden FROM menu WHERE id_padre=?', idMenuPadre);
    var newIdMenu = await pool.query('SELECT MAX(idmenu)+1 as idmenu FROM menu');

    var menuPadre = nombreMenuPadre[0].menu_nombre;
    var newOrden = newOrdenSub[0].orden;
    var idmenu = newIdMenu[0].idmenu;

    res.render('modulos/menu/agregar_submenu', {
        nombrePagina: 'Agregar Submenú',
        menuPadre,
        newOrden,
        idmenu,
        idMenuPadre
    });
}

exports.agregarSubMenu = async (req, res) => {

    var { idmenu, menu_nombre, id_padre, orden, url, icono, status } = req.body;

    const newMenu = {
        idmenu,
        menu_nombre,
        id_padre,
        orden,
        url,
        icono,
        status
    };

    const existMenu = await pool.query('SELECT * FROM menu WHERE menu_nombre = ?', newMenu.menu_nombre);

    if (existMenu.length > 0) {
        res.send('Repetido');
    } else {
        await pool.query('INSERT INTO menu SET ?', [newMenu]);

        res.status(200).send('Submenú creado Correctamente');
    }
}

exports.formEditarMenu = async (req, res) => {

    var idMenu = req.params.id;

    var nombreMenu = await pool.query('SELECT menu_nombre FROM menu WHERE idmenu=?', idMenu);
    var ordenMenu = await pool.query('SELECT orden FROM menu WHERE idmenu=?', idMenu);
    var ordenMenu = await pool.query('SELECT orden FROM menu WHERE idmenu=?', idMenu);
    var urlMenu = await pool.query('SELECT url FROM menu WHERE idmenu=?', idMenu);
    var iconoMenu = await pool.query('SELECT icono FROM menu WHERE idmenu=?', idMenu);

    var nameMenu = nombreMenu[0].menu_nombre;
    var orden = ordenMenu[0].orden;
    var url = urlMenu[0].url;
    var icono = iconoMenu[0].icono;

    res.render('modulos/menu/editar_menu', {
        nombrePagina: 'Editar Menú',
        nameMenu,
        orden,
        idMenu,
        url,
        icono
    });
}

exports.editarMenu = async (req, res) => {

    var { idmenu, nombre_menu, url, icono } = req.body;

    var conteo = 0;

    const dataBase = await pool.query('SELECT * FROM menu WHERE idmenu = ?', idmenu);

    for (var x = 0; x < dataBase.length; x++) {
        const arrayCliente = dataBase[x];
        var menu_nombre_base = arrayCliente.menu_nombre;
        var url_base = arrayCliente.url;
        var icono_base = arrayCliente.icono;
    }

    const validMenu = await pool.query('SELECT * FROM menu WHERE menu_nombre = ? AND idmenu != ?', [nombre_menu, idmenu]);

    if (validMenu.length > 0) {

        res.send('MenuRep');

    } else {

        if (nombre_menu != menu_nombre_base) {
            await pool.query('UPDATE menu SET menu_nombre = ? WHERE idmenu = ?', [nombre_menu, idmenu]);
            var conteo = conteo + 1;
        }

        if (url != url_base) {
            await pool.query('UPDATE menu SET url = ? WHERE idmenu = ?', [url, idmenu]);
            var conteo = conteo + 1;
        }

        if (icono != icono_base) {
            await pool.query('UPDATE menu SET icono = ? WHERE idmenu = ?', [icono, idmenu]);
            var conteo = conteo + 1;
        }

        if (conteo > 0) {
            res.send('Menu Actualizado Correctamente');
        } else {
            res.send('Nulos');
        }
    }
}

exports.eliminarMenu = async (req, res) => {

    var idMenu = req.params.id;

    var eliminarMenu = await pool.query('DELETE FROM menu WHERE idmenu = ?', idMenu);

    if (eliminarMenu.affectedRows === 1) {
        await pool.query('DELETE FROM menu WHERE id_padre = ?', idMenu);
        res.status(200).send('El menú ha sido eliminado.');
    } else {
        res.send('Inexistente');
    }
    
}

exports.eliminarSubmenu = async (req, res) => {

    var idMenu = req.params.id;

    var eliminarSubmenu = await pool.query('DELETE FROM menu WHERE idmenu = ?', idMenu);

    if (eliminarSubmenu.affectedRows === 1) {
        res.status(200).send('El submenú ha sido eliminado.');
    } else {
        res.send('Inexistente');
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