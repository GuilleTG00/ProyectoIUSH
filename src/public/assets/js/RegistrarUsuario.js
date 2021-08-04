var direccion;
var nombre;
var edad;
var nombreUsuario;
var contraseña;
var telefono;
var cantidadUsuarios =[];
class usuario{
    constructor(nombreUsuario, contraseña,nombre, apellido, direccion,edad,telefono){
    this.nombreUsuario=nombreUsuario;
    this.contraseña=contraseña;
    this.nombre=nombre;
    this.direccion=direccion;
    this.edad=edad;
    this.telefono=telefono;
    this.apellido=apellido;
    }
}

function registrarUsuario(){
    let nombreUsuario = document.getElementById("username").value;
    let contraseña = document.getElementById("password").value;
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let direccion = document.getElementById("direccion").value;
    let edad = document.getElementById("edad").value;
    let telefono = document.getElementById("telefono").value;
    var usuarioNuevo = new usuario(nombreUsuario,contraseña,nombre,apellido, direccion,edad,telefono);
    cantidadUsuarios.push(usuarioNuevo);
    console.log(nombreUsuario);
    console.log (usuarioNuevo.nombreUsuario);
    alert("El usuario: "+usuarioNuevo.nombreUsuario+" se ha registrado correctamente.")
}

function comprobarUsuario(){
    let usernameCheck = document.getElementById("usernameCheck").value;
    let passwordCheck = document.getElementById("passwordCheck").value;
    for(let i=0;i<cantidadUsuarios.length;i++){
        if(cantidadUsuarios[i].nombreUsuario==usernameCheck){
            if(cantidadUsuarios[i].contraseña==passwordCheck){
                alert("El usuario: "+ cantidadUsuarios[i].nombreUsuario+" existe en la plataforma y coincide con los datos ingresados. Bienvenido")
            }else{
                alert("La contraseña ingresada es incorrecta. Intente nuevamente.")
            }
        }else{
            alert("No existe un usuario con username: "+usernameCheck+", por favor intente nuevamente.")
        }
    }
}