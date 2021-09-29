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
