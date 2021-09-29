const pool = require('../config/db');
const helpers = require('../config/helpers');
//const enviarEmail = require('../handlers/email');

const passport = require('passport');
const crypto = require('crypto');
const moment = require('moment');


exports.iniciarSesion = async (req, res) => {
    res.render('auth/signin', {
        nombrePagina: 'Iniciar Sesión'
    });
}

exports.autenticarUsuario = (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true,
        badRequestMessage: 'Ambos Campos son Obligatorios'
    })(req, res, next)

};

exports.formChangePassword = async (req, res) => {
    res.render('auth/cambiar_password', {
        nombrePagina: 'Cambiar Contraseña'
    });
}

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/signin');
}


exports.formRestablecer = async (req, res) => {
    res.render('auth/restablecer', {
        nombrePagina: 'Restablecer Contraseña'
    });
}

exports.notFound = async (req, res) => {
    res.render('modulos/error/404', {
        nombrePagina: '404 Error Page'
    });
}


exports.cambiarPassword = async (req, res) => {
    
    const { nickUser, passUser, newPass, newPass2 } = req.body;

    const infoUser = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND status_usuario=1', [nickUser]);

    if(infoUser.length > 0){
        const user = infoUser[0];
        const validPassword = await helpers.matchPassword(passUser, user.pass_usuario);

        if(validPassword){

            const validNewPass = await helpers.matchPassword(newPass, user.pass_usuario);

            if(validNewPass){

                res.send('Igual');

            }else{

                var pass_usuario = await helpers.encryptPassword(newPass);

                await pool.query('UPDATE usuarios SET pass_usuario=? WHERE usuario=?',[pass_usuario,nickUser]);

                res.status(200).send('Contraseña Actualizada');

            }

        }else{
            res.send('Incorrecta');
        }

    }else{
        res.send('Inexistente');
    }

}