const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('LA CONEXION CON LA BASE DE DATOS FUE CERRADA');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DEMASIADAS CONEXIONES A LA BASE DE DATOS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('LA CONEXION A LA DB FUE RECHAZADA');
        }
    } else {

        if (connection) connection.release();
        console.log('DB is Connected');
        return;
    }

});

pool.query = promisify(pool.query);

module.exports = pool;