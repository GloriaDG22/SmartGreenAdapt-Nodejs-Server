CREATE DATABASE SmartGreenAdapt;
USE SmartGreenAdapt;
CREATE TABLE AirQuality (
	id INT NOT NULL AUTO_INCREMENT,
    amount INT,  
    date TIMESTAMP,
	PRIMARY KEY(id)
);
CREATE TABLE Luminosity (
	id INT NOT NULL AUTO_INCREMENT,
    amount INT,  
    date TIMESTAMP,
    PRIMARY KEY(id)    
);
CREATE TABLE Notification (
	id INT NOT NULL AUTO_INCREMENT,
    amount INT,  
    date TIMESTAMP,
    PRIMARY KEY(id)    
);
CREATE TABLE Humidity (
	id INT NOT NULL AUTO_INCREMENT,
    amount INT,  
    date TIMESTAMP,
    PRIMARY KEY(id)    
);
CREATE TABLE Temperature (
	id INT NOT NULL AUTO_INCREMENT,
    amount DECIMAL(4,2),  
    date TIMESTAMP,
    PRIMARY KEY(id)    
);
CREATE TABLE Weather (
	id INT NOT NULL AUTO_INCREMENT,
    state VARCHAR(10),  
    temp DECIMAL(4,2),
    temp_feel DECIMAL(4,2),
    temp_min DECIMAL(4,2),
    temp_max DECIMAL(4,2),
    pressure INT,
    humidity INT,
    wind DECIMAL(5,2),
    date TIMESTAMP,
    season VARCHAR(10),
    PRIMARY KEY(id)    
);