'use strict';


/**
 * Devuelve todos los datos relacionados con notificaciones.
 * Devuelve todos los datos relacionados con notificaciones.
 *
 * date String Fecha de la recogida de la información

 * returns String
 **/
module.exports.getNotification = function(req, res, next) {
    //Parameters
    console.log(req);
    res.send({
        message: 'This is the mockup controller for getNotification'
    });
};


/**
 * Registra una nueva notificación.
 * Creacion de nuevas notificaciones.
 *
 * notification Notification 

 * returns String
 **/
module.exports.postNotification = function(req, res, next) {
    //Parameters
    console.log(req);
    res.send({
        message: 'This is the mockup controller for postNotification'
    });
};




