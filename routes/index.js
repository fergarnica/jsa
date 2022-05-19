const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const configController = require('../controllers/configController');
const usuariosController = require('../controllers/usuariosController');
const ordenesController = require('../controllers/ordenesController');

const { isLoggedIn, isNotLogeedIn } = require('../config/auth');
const { verifyFile } = require('../middlewares/verifyFile');

module.exports = function () {

    // Ruta para el home
    router.get('/',
        isLoggedIn,
        homeController.home
    );

    //Iniciar Sesión
    router.get('/signin',
        isNotLogeedIn,
        authController.iniciarSesion
    );
    router.post('/signin',
        isNotLogeedIn,
        authController.autenticarUsuario
    );

    //Logout
    router.get('/logout',
        isLoggedIn,
        authController.logout
    );

    //Cambiar contraseña
    router.get('/cambiar_password',
        isLoggedIn,
        authController.formChangePassword
    );
    router.put('/cambiar_password',
        isLoggedIn,
        authController.cambiarPassword
    );

    //Menus
    router.get('/menus',
        isLoggedIn,
        homeController.menus
    );
    router.get('/menus_activos',
        isLoggedIn,
        homeController.menusActivos
    );
    router.get('/submenus_activos',
        isLoggedIn,
        homeController.submenusActivos
    );
    router.get('/menus/all',
        isLoggedIn,
        homeController.mostrarMenus
    );
    router.put('/menus',
        isLoggedIn,
        homeController.activarMenus
    );
    router.get('/agregar_menu',
        isLoggedIn,
        homeController.formAgregarMenu
    );
    router.post('/menus',
        isLoggedIn,
        homeController.agregarMenu
    );
    router.get('/agregar_submenu/:id',
        isLoggedIn,
        homeController.formAgregarSubmenu
    );
    router.post('/submenus',
        isLoggedIn,
        homeController.agregarSubMenu
    );
    router.get('/editar_menu/:id',
        isLoggedIn,
        homeController.formEditarMenu
    );
    router.put('/menus/:id',
        isLoggedIn,
        homeController.editarMenu
    );
    router.delete('/menus/:id',
        isLoggedIn,
        homeController.eliminarMenu
    );
    router.delete('/submenus/:id',
        isLoggedIn,
        homeController.eliminarSubmenu
    );

    //Empleados
    router.get('/empleados',
        isLoggedIn,
        usuariosController.empleados
    );
    router.post('/empleados',
        isLoggedIn,
        usuariosController.agregarEmpleado
    );
    router.get('/agregar_empleado',
        isLoggedIn,
        usuariosController.agregarEmpleadoForm
    );
    router.get('/editar_empleado/:id',
        isLoggedIn,
        usuariosController.editarEmpleadoForm
    );
    router.get('/empleados/all',
        isLoggedIn,
        usuariosController.mostrarEmpleados
    );
    router.post('/empleados/all',
        isLoggedIn,
        usuariosController.mostrarEmpleadosActivos
    );
    router.get('/empleados/:id',
        isLoggedIn,
        usuariosController.mostrarEmpleado
    );
    router.put('/empleados',
        isLoggedIn,
        usuariosController.activarEmpleado
    );
    router.put('/empleados/:id',
        isLoggedIn,
        usuariosController.editarEmpleado
    );
    router.delete('/empleados/:id',
        isLoggedIn,
        usuariosController.eliminarEmpleado
    );
    router.post('/empleados/uploadImg',
        isLoggedIn,
        usuariosController.subirImgEmpl
    );
    router.get('/empleados/route_imagen/:id',
        isLoggedIn,
        usuariosController.mostrarImgEmplRoute
    );
    router.get('/empleados/imagen/:id',
        isLoggedIn,
        usuariosController.mostrarImgEmpl
    );

    //Perfiles
    router.get('/perfiles',
        isLoggedIn,
        usuariosController.perfiles
    );
    router.get('/perfiles/all',
        isLoggedIn,
        usuariosController.mostrarPerfiles
    );
    router.post('/perfiles/all',
        isLoggedIn,
        usuariosController.mostrarPerfilesActivos
    );
    router.get('/perfiles/:id',
        isLoggedIn,
        usuariosController.mostrarPerfil
    );
    router.post('/perfiles',
        isLoggedIn,
        usuariosController.agregarPerfil
    );
    router.put('/perfiles',
        isLoggedIn,
        usuariosController.activarPerfil
    );
    router.put('/perfiles/:id',
        isLoggedIn,
        usuariosController.editarPerfil
    );
    router.delete('/perfiles/:id',
        isLoggedIn,
        usuariosController.eliminarPerfil
    );

    //Usuarios
    router.get('/usuarios',
        isLoggedIn,
        usuariosController.usuarios
    );
    router.post('/usuarios',
        isLoggedIn,
        usuariosController.agregarUsuario
    );
    router.get('/agregar_usuario',
        isLoggedIn,
        usuariosController.agregarUsuarioForm
    );
    router.get('/editar_usuario/:id',
        isLoggedIn,
        usuariosController.editarUsuarioForm
    );
    router.get('/usuarios/all',
        isLoggedIn,
        usuariosController.mostrarUsuarios
    );
    router.post('/usuarios/all',
        isLoggedIn,
        usuariosController.mostrarUsuariosActivos
    );
    router.get('/usuarios/:id',
        isLoggedIn,
        usuariosController.mostrarUsuario
    );
    router.put('/usuarios',
        isLoggedIn,
        usuariosController.activarUsuario
    );
    router.put('/usuarios/:id',
        isLoggedIn,
        usuariosController.editarUsuario
    );
    router.delete('/usuarios/:id',
        isLoggedIn,
        usuariosController.eliminarUsuario
    );

    //Permisos
    router.get('/permisos_por_perfil',
        isLoggedIn,
        configController.permisos
    );
    router.get('/permiso_x_perfil/:id',
        isLoggedIn,
        configController.permisosxPerfil
    );
    router.put('/permiso_x_perfil',
        isLoggedIn,
        configController.activarPermxPerfil
    );
    router.get('/permisos_por_usuario',
        isLoggedIn,
        configController.permisosxUsuario
    );
    router.get('/permiso_x_usuario/:id',
        isLoggedIn,
        configController.getpermisosxUsuario
    );
    router.put('/permiso_x_usuario',
        isLoggedIn,
        configController.activarPermxUser
    );

    //Empresa
    router.get('/empresa',
        isLoggedIn,
        configController.empresa
    );
    router.get('/empresa/all',
        isLoggedIn,
        configController.infoEmpresa
    );
    router.post('/empresa',
        isLoggedIn,
        configController.guardarEmpresa
    );

    //Oficinas
    router.get('/oficinas',
        isLoggedIn,
        configController.oficinas
    );
    router.post('/oficinas',
        isLoggedIn,
        configController.agregarOficina
    );
    router.get('/oficinas/all',
        isLoggedIn,
        configController.mostrarOficinas
    );
    router.put('/oficinas',
        isLoggedIn,
        configController.activarOficina
    );
    router.get('/oficinas/:id',
        isLoggedIn,
        configController.mostrarOficina
    );
    router.put('/oficinas/:id',
        isLoggedIn,
        configController.editarOficina
    );
    router.post('/oficinas/all',
        isLoggedIn,
        configController.mostrarOficActivas
    );

    //Verificadores
    router.get('/verificadores',
        isLoggedIn,
        configController.verificadores
    );
    /*router.get('/agregar_verificador',
        isLoggedIn,
        configController.agregarVerifForm
    );*/
    router.post('/verificadores',
        isLoggedIn,
        configController.agregarVerif
    );
    router.get('/verificadores/all',
        isLoggedIn,
        configController.mostrarVerif
    );
    router.put('/verificadores',
        isLoggedIn,
        configController.activarVerif
    );
    router.post('/verificadores/all',
        isLoggedIn,
        configController.mostrarVerifActivos
    );

    router.post('/actividades/all',
        isLoggedIn,
        configController.mostrarActiviActivos
    );

    //Ordenes
    router.get('/capturar_orden',
        isLoggedIn,
        ordenesController.capturarOrden
    );
    router.post('/ordenes',
        isLoggedIn,
        ordenesController.guardarOrden
    );
    router.get('/seguimiento_ordenes',
        isLoggedIn,
        ordenesController.seguimientoOrden
    );
    router.post('/seguimiento_ordenes',
        isLoggedIn,
        ordenesController.mostrarOrdenes
    );
    router.post('/asignar_orden',
        isLoggedIn,
        ordenesController.asignarOrden
    );
    router.get('/estatus_ordenes',
        isLoggedIn,
        ordenesController.statusOrdenes
    );
    router.get('/agenda_ordenes',
        isLoggedIn,
        ordenesController.agendaOrdenes
    );
    router.post('/print_orden',
        isLoggedIn,
        ordenesController.printOrden
    );
    router.get('/estatus_ordenes_cerrar',
        isLoggedIn,
        ordenesController.statusOrdsCerrar
    );
    router.get('/info_orden/:id',
        isLoggedIn,
        ordenesController.infoOrden
    );
    router.post('/cerrar_orden',
        isLoggedIn,
        ordenesController.cerrarOrden
    );

    router.post('/consultar_agenda',
        isLoggedIn,
        ordenesController.consultarAgenda
    );
    router.post('/exportar_agenda',
        isLoggedIn,
        ordenesController.exportAgenda
    );


    router.get('/municipios',
        isLoggedIn,
        ordenesController.mostrarMunic
    );

    return router;
    
}