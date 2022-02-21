'use strict';

const superagent = require('superagent');

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
 * MQTT
 */
client.on('connect', function () {
    console.log('Successful connected to MQTT');
});

client.on('error', function (error) {
    /** TODO no fuciona mqtt
 *  console.log('Error, cannot connect to MQTT ' + error);
 */
});


function calculateSeason(date) {
    var month = date.getMonth() + 1;
    if (month > 2 && month < 6)
        return 'Spring';
    else if (month > 5 && month < 9)
        return 'Summer';
    else if (month > 8 && month < 12)
        return 'Autumn';
    else if (month < 3 || month > 11)
        return 'Winter';
}

function calculateCelsius(tempk) {
    return Number(((tempk - 273.15).toFixed(2)));
}

module.exports.postWeather = function () {
    superagent
        .get('https://api.openweathermap.org/data/2.5/weather')
        .query({ lat: 39.4789255, lon: -6.3423358, APPID: '0db5d912986a7c8d9443ea0ccc7e19b8' })
        .end((err, res) => {
            if (err) { return console.log(err); }

            /**
             * MySQL
             */

            var date = new Date();
            var query = 'INSERT INTO weather SET ?';
            let temp = calculateCelsius(res.body.main.temp);
            let temp_feel = calculateCelsius(res.body.main.feels_like);
            let temp_min = calculateCelsius(res.body.main.temp_min);
            let temp_max = calculateCelsius(res.body.main.temp_max);
            var weather = {
                state: res.body.weather[0].main,
                temp: temp,
                temp_feel: temp_feel,
                temp_min: temp_min,
                temp_max: temp_max,
                pressure: res.body.main.pressure,
                humidity: res.body.main.humidity,
                wind: res.body.wind.speed,
                date: date,
                season: calculateSeason(date)
            }
            connection.query(query, [weather], function (error, results, fields) {
                if (error) throw error;
            });

            /**
             * MQTT
             */

            client.on('connect', function () {
                console.log('Successful connected to MQTT');

                let options = {
                    retain: true,
                    qos: 1
                };
                if (client.connected == true) {
                    client.publish('weather_temp', temp.toString(), options);
                    client.publish('weather_temp_min', temp_min.toString(), options);
                    client.publish('weather_temp_max', temp_max.toString(), options);
                    client.publish('weather_temp_feels', temp_feel.toString(), options);
                    client.publish('weather_humidity', res.body.main.humidity.toString(), options);
                }
            });

            client.on('error', function (error) {
                /** TODO no fuciona mqtt
                 *  console.log('Error, cannot connect to MQTT ' + error);
                 */
            });
        });
};