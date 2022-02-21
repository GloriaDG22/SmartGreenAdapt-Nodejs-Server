'use strict';

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smartgreenadapt'
});

connection.connect();

var options = {
    clientId: 'mqtthp'
}

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:1883', options);

/**
 * Eliminación de datos de humedad.
 * Eliminación un dato de humedad en la base de datos.
 *
 * idHumidity Integer Id del dato de humedad

 * returns String
 **/
module.exports.deleteHumidity = function(req, res, next) {
    console.log("Delete humidity data");
    var query = 'DELETE FROM humidity WHERE id = ?';

    connection.query(query, [req.idHumidity.originalValue], function (error, result) {
        if (error) throw error;

        res.send({
            message: result
        });
    });
};


/**
 * Devuelve todos los datos relacionados con la humedad.
 * Devuelve todos los datos relacionados con la humedad.
 *
 * date String Fecha de la recogida de la información

 * returns String
 **/
module.exports.getHumidity = function(req, res, next) {
    console.log("get humidity data");

    var query = 'SELECT * FROM humidity WHERE date = ?';

    connection.query(query, [req.date.originalValue], function (error, results) {
        if (error) throw error;

        res.send({
            message: results
        });
    });
};


/**
 * Registra un nuevo dato de humedad.
 * Creacion de nuevos datos asociados a la humedad.
 *
 * humidity Humidity 

 * returns String
 **/
module.exports.postHumidity = function(req, res, next) {
    console.log("Post humidity data");

    var query = 'INSERT INTO humidity SET ?';
    var date;

    if (!req.undefined.originalValue.date) date = new Date();
    else date = req.undefined.originalValue.date;

    var data = {
        amount: Number((req.undefined.originalValue.amount).toFixed(2)),
        date: date
    }

    connection.query(query, [data], function (error, results) {
        if (error) throw error;

        res.send({
            message: results
        });
    });

    /**
     * MQTT
     */

    client.on('connect', function () {

        let options = {
            retain: true,
            qos: 1
        };
        if (client.connected === true) {
            client.publish('humidity', req.undefined.originalValue.amount.toString(), options);
        }
    });

    client.on('error', function (error) {
        /** TODO no fuciona mqtt
         *  console.log('Error, cannot connect to MQTT ' + error);
         */
    });
};


/**
 * Modifica un dato de humedad previamente registrado
 * Modifica un dato de humedad previamente registrado
 *
 * humidity Humidity 

 * returns String
 **/
module.exports.putHumidity = function(req, res, next) {
    console.log("Put humidity data");

    var query = 'UPDATE humidity SET ? WHERE id = ?';
    var data = {
        amount: Number((req.undefined.originalValue.amount).toFixed(2)),
        date: req.undefined.originalValue.date.toString()
    }

    connection.query(query, [data, req.undefined.originalValue.idHumidity], function (error, results) {
        if (error) throw error;

        res.send({
            message: results
        });
    });
};




