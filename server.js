const express = require('express');
const routes = require('./routes');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const expressValidator = require('express-validator');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
var createError = require('http-errors');

const { database } = require('./config/keys');
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env' });

/*=============================================
INICIALIZACION DE EXPRESS
=============================================*/
const app = express();

/*=============================================
CONFIGURACIONES
=============================================*/
//app.set('port', process.env.PORT || 4000);
//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));
//Habilitar HBS
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');
//Donde cargar los archivos estaticos
app.use(express.static('public'));

/*=============================================
MIDDLEWARES
=============================================*/
// validación de campos
app.use(expressValidator());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'shhhhhhhhh',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(database),
  /* cookie: {
    maxAge: 60 * 60 * 1000,
    path: '/',
    httpOnly: false,
    secure: false
  } */
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*=============================================
VARIABLES LOCALES
=============================================*/
app.use((req, res, next) => {
  res.locals.usuario = { ...req.user } || null;
  app.locals.error = req.flash('error');
  app.locals.success = req.flash('success');
  app.locals.warning = req.flash('warning');
  app.locals.info = req.flash('info');
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});


/*=============================================
ROUTES
=============================================*/
app.use('/', routes());

//404 pagina no existente
app.use((req, res, next) => {
  next(createError(404, 'No Encontrado'))

});
/*=============================================
ADMINISTRACION DE LOS ERRORES
=============================================*/
app.use((error, req, res, next) => {

  if (error.status === 404) {
    res.render('modulos/error/404');
  }

})

/*=============================================
CONFIGURACIONES
=============================================*/
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

/*=============================================
STARTING SERVER
=============================================*/
/* app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
}); */
var server = app.listen(port, host, () => {
  //server.setTimeout(300000);
  console.log('Server is in port ', port);
});