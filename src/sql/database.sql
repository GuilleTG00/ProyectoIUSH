CREATE DATABASE users;

USE users;

CREATE TABLE administrador(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(255),
    nombre VARCHAR(255),
    rol VARCHAR(50) DEFAULT "administrador",
    passwordd VARCHAR(255),
    appellido VARCHAR(255),
    telefono int,
    email VARCHAR(255)

);


CREATE TABLE cliente(
    id_element INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    pass VARCHAR(255),
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    telefono VARCHAR(255),
    email VARCHAR(255),
    rol VARCHAR(50) DEFAULT "cliente"
);



CREATE TABLE vendedor(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    telefono int,
    email VARCHAR(255),
    rol VARCHAR(50) DEFAULT "vendedor"
);



DESCRIBE users;

SELECT * FROM users;





ALTER TABLE carrito
ADD state ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE';
