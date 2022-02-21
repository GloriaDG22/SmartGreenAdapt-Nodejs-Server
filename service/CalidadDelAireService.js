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
 * Eliminación de datos de la calidad del aire.
 * Eliminación de un dato de la calidad del aire guardado en la base de datos.
 *
 * idAirQuality Integer Id de la calidad del aire

 * returns String
 **/
module.exports.deleteAirQuality = function(req, res, next) {
    console.log("Delete air quality data");
    var query = 'DELETE FROM airquality WHERE id = ?';

    connection.query(query, [req.idAirQuality.originalValue], function (error, result) {
        if (error) throw error;

        res.send({
            message: result
        });
    });
};


/**
 * Devuelve todos los datos relacionados con la calidad del aire.
 * Devuelve todos los datos relacionados con la calidad del aire.
 *
 * date String Fecha de la recogida de la información

 * returns String
 **/
module.exports.getAirQuality = function(req, res, next) {
    console.log("get air quality data");

    var query = 'SELECT * FROM airquality WHERE date = ?';

    connection.query(query, [req.date.originalValue], function (error, results) {
        if (error) throw error;

        res.send({
            message: results
        });
    });
};


/**
 * Registra un nuevo dato de calidad del aire.
 * Creacion de nuevos datos asociados a la calidad del aire.
 *
 * airQuality AirQuality 

 * returns String
 **/
module.exports.postAirQuality = function(req, res, next) {
    console.log("Post air quality data");

    var query = 'INSERT INTO airquality SET ?';
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
            client.publish('air quality', req.undefined.originalValue.amount.toString(), options);
        }
    });

    client.on('error', function (error) {
        /** TODO no fuciona mqtt
         *  console.log('Error, cannot connect to MQTT ' + error);
         */
    });
};


/**
 * Modifica un dato de calidad del aire previamente registrado
 * Modifica un dato de calidad del aire previamente registrado
 *
 * airQuality AirQuality 

 * returns String
 **/
module.exports.putAirQuality = function(req, res, next) {
    console.log("Put air quality data");

    var query = 'UPDATE airquality SET ? WHERE id = ?';
    var data = {
        amount: Number((req.undefined.originalValue.amount).toFixed(2)),
        date: req.undefined.originalValue.date.toString()
    }

    connection.query(query, [data, req.undefined.originalValue.idAirQuality], function (error, results) {
        if (error) throw error;

        res.send({
            message: results
        });
    });
};




