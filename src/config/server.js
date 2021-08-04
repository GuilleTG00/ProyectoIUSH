
const express = require("express"); //creacion y configuracion del servidor web
const path =require("path"); //estandarizar y organizar las rutas del aplicativo
const dotenv = require("dotenv"); //configurar la ruta de las variables de entorno
const bcryptjs = require("bcryptjs"); //seguridad: encriptar datos
const session = require("express-session"); //manejo de las cookies que contienen info de la sesion
const app = express();


//Configuraciones
//configurar puertos
app.set("port",process.env.PORT || 3000);
//configurar gestor de plantillas
app.set("view engine", "ejs");
//configurar ruta de las vistas
app.set("views",path.join(__dirname,"../app/views"));

//middleware (manejo de informacion)
app.use(express.urlencoded({extended:false}));
app.use(express.json());


//configurar dotenv (variables de entorno)
dotenv.config({path: path.join(__dirname,"../env/.env")});

//configurar el css externo (configuracion de la carpeta public)
app.use("/resources", express.static(path.join(__dirname, "../public")));

//Configurar el manejo de sesiones:
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized:true
}));

module.exports = app;
