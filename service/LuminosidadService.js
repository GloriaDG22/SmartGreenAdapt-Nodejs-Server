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
 * Eliminación de datos de luminosidad.
 * Eliminación un dato de luminosidad en la base de datos.
 *
 * idLuminosity Integer Id del dato de luminosidad

 * returns String
 **/
module.exports.deleteLuminosity = function(req, res, next) {
    console.log("Delete luminosity data");
    var query = 'DELETE FROM luminosity WHERE id = ?';

    connection.query(query, [req.idLuminosity.originalValue], function (error, result) {
        if (error) throw error;

        res.send({
            message: result
        });
    });
};


/**
 * Devuelve todos los datos relacionados con la luminosidad.
 * Devuelve todos los datos relacionados con la luminosidad.
 *
 * date String Fecha de la recogida de la información

 * returns String
 **/
module.exports.getLuminosity = function(req, res, next) {
    console.log("get luminosity data");

    var query = 'SELECT * FROM luminosity WHERE date = ?';

    connection.query(query, [req.date.originalValue], function (error, results) {
        if (error) throw error;

        res.send({
            message: results
        });
    });
};


/**
 * Registra un nuevo dato de luminosidad.
 * Creacion de nuevos datos asociados a la luminosidad.
 *
 * luminosity Luminosity 

 * returns String
 **/
module.exports.postLuminosity = function(req, res, next) {
    console.log("Post luminosity data");

    var query = 'INSERT INTO luminosity SET ?';
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
            client.publish('luminosity', req.undefined.originalValue.amount.toString(), options);
        }
    });

    client.on('error', function (error) {
        /** TODO no fuciona mqtt
         *  console.log('Error, cannot connect to MQTT ' + error);
         */
    });
};


/**
 * Modifica un dato de luminosidad previamente registrado
 * Modifica un dato de luminosidad previamente registrado
 *
 * luminosity Luminosity 

 * returns String
 **/
module.exports.putLuminosity = function(req, res, next) {
    console.log("Put luminosity data");

    var query = 'UPDATE luminosity SET ? WHERE id = ?';
    var data = {
        amount: Number((req.undefined.originalValue.amount).toFixed(2)),
        date: req.undefined.originalValue.date.toString()
    }

    connection.query(query, [data, req.undefined.originalValue.idLuminosity], function (error, results) {
        if (error) throw error;

        res.send({
            message: results
        });
    });
};




