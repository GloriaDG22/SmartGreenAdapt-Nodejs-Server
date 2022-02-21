'use strict';

var Notificacion = require('../service/NotificacionService');

module.exports.getNotification = function getNotification (req, res, next) {

    Notificacion.getNotification(req.swagger.params, res, next);

};

module.exports.postNotification = function postNotification (req, res, next) {

    Notificacion.postNotification(req.swagger.params, res, next);

};
