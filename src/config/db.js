const mysql = require("mysql");
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database:process.env.DB_DATABASE
});

//probar si la bd se conecta bien

connection.connect((err)=>{
    if (err){
        console.log("el error de conexión es " + err);
        return;
    }else{  
        console.log("Conectado exitosamente a BD.")
    }
})

module.exports = connection;
