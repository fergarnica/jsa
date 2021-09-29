const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db');
const Swal = require('sweetalert2');
const helpers = require('./helpers');
const moment = require('moment');


// local strategy - Login con credenciales propios (usuario y password)
passport.use('local.signin',
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'usuario',
            passwordField : 'password',
            passReqToCallback: true
        },
        async (req, usuario, password, done) => {

            const rows = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND status_usuario=1', [usuario]);

            if(rows.length > 0){
                //console.log(rows);
                const user = rows[0];
                const validPassword = await helpers.matchPassword(password, user.pass_usuario);
                if(validPassword){
                    //Ingresa
                    const dateLogin= moment().format('YYYY-MM-DD H:mm:ss');
                    await pool.query('UPDATE usuarios SET fecha_ultimologin= ? WHERE usuario = ?', [dateLogin, usuario]);
                    return done(null, user);
                }else{
                    //Contraseña incorrecta
                    return done(null, false, req.flash('error', 'Datos incorrectos.'));
                }
            }else{
                //Usuario no existe;
                return done(null, false, req.flash('error', 'Datos incorrectos.'));
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar
module.exports = passport;