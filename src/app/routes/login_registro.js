//rutas
const connection = require("../../config/db");
const bcryptjs = require("bcryptjs");
module.exports = app => {

    app.get('/login', (req, res) => {
        res.render("../views/logueo.ejs");
    });

    app.get('/vistas', (req, res) => {
        if (req.session.loggedin && req.session.rol == "administrador") {
            res.render("../views/vistaadmin.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            });
        } else if (req.session.loggedin && req.session.rol == "cliente") {

            res.render("../views/vistacliente.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id_element
            });

        } else if (req.session.loggedin && req.session.rol == "vendedor") {
            res.render("../views/vistavendedor.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            });

        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }
    });

    //holis
    app.get('/agregareliminar', (req, res) => {
        if (req.session.loggedin && req.session.rol == "administrador") {
            connection.query('SELECT * FROM productos', (err, result1) => {

                connection.query("SELECT * FROM servicios", (err, result2) => {
                    res.render("../views/agregareliminar.ejs", {
                        productos: result1,
                        servicios: result2,
                        name: req.session.name
                    })

                })
            })
        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }
        if (req.session.loggedin && req.session.rol == "vendedor") {
            connection.query('SELECT * FROM productos', (err, result1) => {

                connection.query("SELECT * FROM servicios", (err, result2) => {
                    res.render("../views/agregareliminar.ejs", {
                        productos: result1,
                        servicios: result2,
                        name: req.session.name
                    })

                })
            })
        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }
    });

    app.get('/verproser', (req, res) => {
        if (req.session.loggedin && req.session.rol == "cliente") {
            connection.query('SELECT * FROM productos', (err, result1) => {

                connection.query('SELECT * FROM servicios', (err, result2) => {
                    res.render("../views/verproser.ejs", {
                        productos: result1,
                        servicios: result2,
                        name: req.session.name,
                        id: req.session.id_element
                    })

                })
            })

        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }

    });

    app.get('/hacerpedido', (req, res) => {
        if (req.session.loggedin && req.session.rol == "cliente") {
            connection.query('SELECT * FROM productos', (err, result1) => {

                connection.query('SELECT * FROM servicios', (err, result2) => {
                    res.render("../views/hacerpedido.ejs", {
                        productos: result1,
                        servicios: result2,
                        name: req.session.name,
                        id:req.session.id_element
                    })

                })
            })

        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }

    });

    app.get('/vermispedidos', (req, res) => {
        const idcliente = req.session.id_element;
        if (req.session.loggedin && req.session.rol == "cliente") {
           

                connection.query('SELECT * FROM carrito WHERE idcliente = ?',[idcliente], (err, resultadofinal) => {
                    res.render("../views/vermispedidos.ejs", {
                        resultadofinal:resultadofinal,
                        name: req.session.name,
                        id:req.session.id_element
                    })

                })
            

        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }

    });

    app.get('/vertodospedidos', (req, res) => {
        const idcliente = req.session.id_element;
        if (req.session.loggedin && (req.session.rol == "administrador" || req.session.rol == "vendedor")) {
           

                connection.query('SELECT * FROM carrito', (err, resultadofinal) => {
                    res.render("../views/vertodospedidos.ejs", {
                        resultadofinal:resultadofinal,
                        name: req.session.name,
                        id:req.session.id_element
                    })

                })
            

        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }

    });


    app.get("/productocarrito/:id", (req, res) => {
        const IDproducto = req.params.id;
        const idcliente = req.session.id_element;
        
        connection.query("SELECT MAX(id) as id FROM carrito WHERE idcliente = ?", [idcliente], (err, result2) => {
            console.log(req.session);
            console.log(result2);
            let idcarritotest =result2[0].id;
            console.log(result2.id);
            console.log("final");
            //Puedo tener el id del carrito (factura) desde aquí en result2.id_carrito
            if (result2.length === 0) {
                connection.query("INSERT INTO carrito SET ?", { idcliente: idcliente },
                (error, results3) => {
                    if (error) {
                        res.send(error);
                    };
                    connection.query("SELECT MAX(id) as id FROM carrito where idcliente = ?",[idcliente],(error, results) =>{
                        idcarritotest=result2.id; });
                    //Consulto el número de factura del usuario SELECT * FROM factura WHERE id_uyser = ?
                });
                

                //Guardado el idCarrito (Fatura)
            };
            
            
            connection.query("INSERT INTO carritoaux SET ?",{idproducto:IDproducto,idcarrito:idcarritotest,idcliente:idcliente},(error, results5) =>{
                if (error) {
                    res.send(error);
                } else {
                    connection.query('SELECT * FROM productos', (err, resProdMostrar) => {

                        connection.query('SELECT * FROM servicios', (err, resSerMostrar) => {
                            res.render("../views/hacerpedido.ejs", {
                                productos: resProdMostrar,
                                servicios: resSerMostrar,
                                name: req.session.name,
                                id:req.session.id_element,
                                alert: true,
                                alertTitle: "Producto agregado",
                                alertMessage: "Producto agregado al carrito",
                                alertIcon: "success",
                                showConfirmButton: true,
                                timer: false,
                                ruta: "hacerpedido"
                            })
        
                        })
                    })
                }
            });
           

            //Redirija a /hacerpedido






        });
        });

        app.get("/serviciocarrito/:id", (req, res) => {
            const IDproducto = req.params.id;
            const idcliente = req.session.id_element;
            
            connection.query("SELECT MAX(id) AS id FROM carrito WHERE idcliente = ?", [idcliente], (err, result2) => {
                console.log(req.session);
                console.log(result2);
                let idcarritotest =result2[0].id;
                console.log(result2.id);
                console.log("final");
                //Puedo tener el id del carrito (factura) desde aquí en result2.id_carrito
                if (result2.length === 0) {
                    connection.query("INSERT INTO carrito SET ?", { idcliente: idcliente },
                    (error, results3) => {
                        if (error) {
                            res.send(error);
                        };
                        connection.query("SELECT MAX(id) AS id carrito where idcliente = ?",[idcliente],(error, results) =>{
                            idcarritotest=result2.id; });
                        //Consulto el número de factura del usuario SELECT * FROM factura WHERE id_uyser = ?
                    });
                    
    
                    //Guardado el idCarrito (Fatura)
                };
                
                
                connection.query("INSERT INTO carritoser SET ?",{idservicio:IDproducto,idcarrito:idcarritotest,idcliente:idcliente},(error, results5) =>{
                    if (error) {
                        res.send(error);
                    } else {
                        connection.query('SELECT * FROM productos', (err, resProdMostrar) => {
    
                            connection.query('SELECT * FROM servicios', (err, resSerMostrar) => {
                                res.render("../views/hacerpedido.ejs", {
                                    productos: resProdMostrar,
                                    servicios: resSerMostrar,
                                    name: req.session.name,
                                    id:req.session.id_element,
                                    alert: true,
                                    alertTitle: "Producto agregado",
                                    alertMessage: "Producto agregado al carrito",
                                    alertIcon: "success",
                                    showConfirmButton: true,
                                    timer: false,
                                    ruta: "hacerpedido"
                                })
            
                            })
                        })
                    }
                });
               
    
                //Redirija a /hacerpedido
    
    
    
    
    
    
            });
            });


        app.get('/carrito', (req, res) => {
            
            const queryproductos = `
                SELECT * FROM carrito
                    JOIN carritoaux
                    ON carritoaux.idcarrito = carrito.id
                    JOIN cliente ON carrito.idcliente = cliente.id_element 
                        WHERE id_element = ?`; //AND carrito.state = 'ACTIVE'
             const joinproductos = `
                SELECT * FROM carritoaux
                    JOIN productos
                        ON carritoaux.idproducto = productos.id
                     JOIN cliente ON carritoaux.idcliente = cliente.id_element 
                        WHERE id_element = ?`;

             const queryservicios = `
                SELECT * FROM carrito
                    JOIN carritoser
                    ON carritoser.idcarrito = carrito.id
                    JOIN cliente ON carrito.idcliente = cliente.id_element 
                        WHERE id_element = ?`; //AND carrito.state = 'ACTIVE'

             const joinservicios = `
                SELECT * FROM carritoser
                    JOIN servicios
                        ON carritoser.idservicio = servicios.id
                     JOIN cliente ON carritoser.idcliente = cliente.id_element 
                        WHERE id_element = ?`;

            if (req.session.loggedin && req.session.rol == "cliente") {
                connection.query(queryproductos,[req.session.id_element], (err, resultadotodo) => {
                    console.log(resultadotodo);
                    let vacio=[];
                    for (let b=0;b<resultadotodo.length;b++) {
                        vacio[b]=resultadotodo[b].idproducto;
                    }
                    console.log(vacio);

                    connection.query(queryservicios,[req.session.id_element], (err, resultadotodoser) => {
                        console.log(resultadotodoser);
                        let vacio1=[];
                        for (let n=0;n<resultadotodoser.length;n++) {
                            vacio1[n]=resultadotodoser[n].idservicio;
                        }
                        
                    connection.query(joinservicios,[req.session.id_element], (err, resultadosServicios) => {
                        
                       
    
                    
                    connection.query(joinproductos,[req.session.id_element], (err, resultadosProductos) => {
                        console.log(resultadosProductos);
                        res.render("../views/carrito.ejs", {
                            todo:resultadotodo,
                            productos:vacio,
                            servicios:vacio1,
                            resultadosProductos:resultadosProductos,
                            resultadosServicios:resultadosServicios,
                            name: req.session.name
                        })
    
                    })
                    
                })
            });
        });
            } else {
                res.render("../views/index.ejs", {
                    login: false,
                    name: "por favor inicie sesión"
                });
            }
    
        });    
        app.get("/eliminarcarritoproducto/:id", (req, res) => {
            const IDproducto = req.params.id;
            const idcliente = req.session.id_element;
            const queryborrado = `DELETE FROM carritoaux
                                  WHERE id = ? AND idcliente = ?
                                  LIMIT ?`; 
           
                         connection.query(queryborrado,[IDproducto,,idcliente,`1`], (err, resSerMostrar) => {
                                const queryproductos = `
                                SELECT * FROM carrito
                                    JOIN carritoaux
                                    ON carritoaux.idcarrito = carrito.id
                                    JOIN cliente ON carrito.idcliente = cliente.id_element 
                                        WHERE id_element = ?`; //AND carrito.state = 'ACTIVE'
                             const joinproductos = `
                                SELECT * FROM carritoaux
                                    JOIN productos
                                        ON carritoaux.idproducto = productos.id
                                     JOIN cliente ON carritoaux.idcliente = cliente.id_element 
                                        WHERE id_element = ?`;
                
                             const queryservicios = `
                                SELECT * FROM carrito
                                    JOIN carritoser
                                    ON carritoser.idcarrito = carrito.id
                                    JOIN cliente ON carrito.idcliente = cliente.id_element 
                                        WHERE id_element = ?`; //AND carrito.state = 'ACTIVE'
                
                             const joinservicios = `
                                SELECT * FROM carritoser
                                    JOIN servicios
                                        ON carritoser.idservicio = servicios.id
                                     JOIN cliente ON carritoser.idcliente = cliente.id_element 
                                        WHERE id_element = ?`;
                
                            if (req.session.loggedin && req.session.rol == "cliente") {
                                connection.query(queryproductos,[req.session.id_element], (err, resultadotodo) => {
                                    console.log(resultadotodo);
                                    let vacio=[];
                                    for (let b=0;b<resultadotodo.length;b++) {
                                        vacio[b]=resultadotodo[b].idproducto;
                                    }
                                    console.log(vacio);
                
                                    connection.query(queryservicios,[req.session.id_element], (err, resultadotodoser) => {
                                        console.log(resultadotodoser);
                                        let vacio1=[];
                                        for (let n=0;n<resultadotodoser.length;n++) {
                                            vacio1[n]=resultadotodo[n].idservicio;
                                        }
                                        
                                    connection.query(joinservicios,[req.session.id_element], (err, resultadosServicios) => {
                                        
                                       
                    
                                    
                                    connection.query(joinproductos,[req.session.id_element], (err, resultadosProductos) => {
                                        console.log(resultadosProductos);
                                        res.render("../views/carrito.ejs", {
                                            todo:resultadotodo,
                                            productos:vacio,
                                            servicios:vacio1,
                                            resultadosProductos:resultadosProductos,
                                            resultadosServicios:resultadosServicios,
                                            name: req.session.name,
                                            alert: true,
                                            alertTitle: "Producto eliminado del carrito",
                                            alertMessage: "Producto eliminado del carrito",
                                            alertIcon: "success",
                                            showConfirmButton: true,
                                            timer: false,
                                            ruta: "carrito"
                                        })
                    
                    
                                    })
                                    
                                })
                            });
                        });
                            } else {
                                res.render("../views/index.ejs", {
                                    login: false,
                                    name: "por favor inicie sesión"
                                });
                            }
                    
                                
                                
                                
                            })
                        });
    
                
    
    
    
    
    
    
        
        
/*

        connection.query(query, [idcliente]
            , (error, results4) => {
                if (error) {
                    res.send(error);
                } else {
                    conexion: results4
                }

            })
        //https://qastack.mx/programming/19035373/how-do-i-redirect-in-expressjs-while-passing-some-context
        connection.query("INSERT INTO carritoaux SET idproducto = ? WHERE idcarrito = ?", { //la interrogacion indica que lo que sigue es lo que se manda,  
            idproducto: ID

        }, (error, results) => {
            if (error) {
                res.send(error);
            } else {
                res.render("../views/carrito.ejs", {  //aún está en desarrollo
                    alert: true,
                    alertTitle: "Agregado exitosamente",
                    alertMessage: "¡Agregado exitosamente!",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ""
                })
            }

        })

    })
*/

    


    app.get('/habilitardeshabilitar', (req, res) => {
        if (req.session.loggedin && req.session.rol == "administrador") {
            connection.query('SELECT * FROM productos', (err, result1) => {

                connection.query("SELECT * FROM servicios", (err, result2) => {
                    res.render("../views/habilitardeshabilitar.ejs", {
                        productos: result1,
                        servicios: result2,
                        name: req.session.name
                    })

                })
            })
        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }

    });


    app.post("/carrito", (req, res) => {
        const ID = req.params.ID;
        const idcliente = req.session.id_element;
        const {idproducto,descripcionproducto,precio,idservicio,descripcionservicio,precioservicios,preciototal} = req.body
        console.log(req.body);
        connection.query("SELECT MAX(id) AS id FROM carrito WHERE idcliente = ?",[idcliente],(error, results) =>{
            if (error){
                res.send(error);
            }else{
                let maximoid=results[0].id;
            connection.query("UPDATE carrito SET total = ? WHERE id = ? ",[preciototal,maximoid],(err,result) => {
                if (err){
                    res.send(err);
                }
            })
            
            connection.query("INSERT into carrito SET idcliente = ?",[idcliente],
        (err, result) => {
        if (err){
            res.send(err);
        }else{
            res.render("../views/vistacliente.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id_element,
                alert: true,
                alertTitle: "¡Compra exitosa!",
                alertMessage: "¡Compra exitosa!",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            })
        }
        
        })
        }
    });
        
        
    })



    app.post("/editservicio/:ID", (req, res) => {
        const ID = req.params.ID;
        const { option } = req.body
        console.log(req.body);
        connection.query("UPDATE servicios SET deshabilitado = ? WHERE id = ?", [option, ID], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/gestionaraplicacion");
            }
        })
    })

    app.post("/editproducto/:ID", (req, res) => {
        const ID = req.params.ID;
        const { option } = req.body
        console.log(req.body);
        connection.query("UPDATE productos SET deshabilitado = ? WHERE id = ?", [option, ID], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/gestionaraplicacion");
            }
        })
    })

    app.post("/verproser", (req, res) => {
        const IDpro = req.params.ID;
        const { option } = req.body
        console.log(req.body);
        connection.query("UPDATE productos SET deshabilitado = ? WHERE id = ?", [option, IDpro], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/gestionaraplicacion");
            }
        })
    })

    app.get('/modificar-datos', (req, res) => {
        if (req.session.loggedin && req.session.rol == "administrador") {
            console.log(req.session.idd);
            connection.query("SELECT * FROM administrador WHERE id = ?", [req.session.idd], (err, result) => {
                res.render("../views/modificardatosadmin.ejs", {
                    admin: result
                });
            })

        } else if (req.session.loggedin && req.session.rol == "cliente") {
            connection.query("SELECT * FROM cliente WHERE id_element = ?", [req.session.id_element], (err, result) => {
                console.log(result);
                res.render("../views/modificardatoscliente.ejs", {
                    cliente: result
                });
            })

        } else if (req.session.loggedin && req.session.rol == "vendedor") {
            connection.query("SELECT * FROM vendedor WHERE id = ?", [req.session.id], (err, result) => {
            res.render("../views/modificardatosvendedor.ejs", {
                login: true,
                admin:result,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            })
            });

        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }
    });

    app.get('/manejarcatalogo', (req, res) => {
        if (req.session.loggedin && req.session.rol == "administrador") {
            res.render("../views/manejarcatalogo.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            });
        } else if (req.session.loggedin && req.session.rol == "vendedor") {
            res.render("../views/manejarcatalogo.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            });

        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        } 
    });

    app.get('/', (req, res) => {
        res.render("../views/index.ejs");

    })

    app.get('/registro', (req, res) => {
        res.render("../views/registro.ejs");

    })


 
    app.get('/gestionaraplicacionv', (req, res) => {
         if (req.session.loggedin && req.session.rol == "vendedor") {
            res.render("../views/gestionaraplicacionv.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            });
        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        } 
            
    });




    app.get('/gestionaraplicacion', (req, res) => {
        if (req.session.loggedin && req.session.rol == "administrador") {
            res.render("../views/gestionaraplicacion.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            });
        } else if (req.session.loggedin && req.session.rol == "vendedor") {
            res.render("../views/gestionaraplicacionv.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                id: req.session.id
            });
        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        } 
            
    });

    app.get('/administrarvendedores', (req, res) => {
        if (req.session.loggedin && req.session.rol == "administrador") {
            connection.query('SELECT * FROM vendedor', (err, result) => {

                res.render("../views/administrarvendedores.ejs", {
                    login: true,
                    name: req.session.name,
                    rol: req.session.rol,
                    id: req.session.id,
                    vendedores: result
                });
            })
        } else {
            res.render("../views/index.ejs", {
                login: false,
                name: "por favor inicie sesión"
            });
        }
    });

    app.post("/agregareliminar", async (req, res) => {
        console.log(req.body);
        const { nombre, descripcion, precio, seccion, deshabilitado, opcion } = req.body;
        if (opcion == "Producto") {
            connection.query("INSERT INTO productos SET ?", {
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                seccion: seccion,
                deshabilitado: deshabilitado
            }, async (error, results) => {
                if (error) {
                    res.send(error);
                } else {
                    res.render("../views/vistas.ejs", {
                        alert: true,
                        alertTitle: "¡Producto agregado exitosamente!",
                        alertMessage: "¡Producto agregado exitosamente!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "manejarcatalogo"
                    })
                }

            })
        } else if (opcion == "Servicio") {
            connection.query("INSERT INTO servicios SET ?", {
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                seccion: seccion,
                deshabilitado: deshabilitado
            }, async (error, results) => {
                if (error) {
                    res.send(error);
                } else {
                    res.render("../views/vistas.ejs", {
                        alert: true,
                        alertTitle: "Servicio agregado exitosamente!",
                        alertMessage: "Servicio agregado exitosamente!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "manejarcatalogo"
                    })
                }

            })
        }



    })

    app.get('/index', (req, res) => {
        res.render("../views/index.ejs");
    })

    app.get("/register", (req, res) => {
        res.render("../views/register.ejs")
    })

    app.get("/logout", (req, res) => {  //CERRAR SESION
        req.session.destroy(() => {
            res.redirect("/");
        })
    })

    //Solicitud metodo POST en el registro
    app.post("/registro", async (req, res) => {  //recibo los datos de register
        console.log(req.body);          //req.body es lo que recibe los datos
        const { user, pass, nombre, apellido, telefono, email } = req.body;
        let passwordHaash = await bcryptjs.hash(pass, 8); //ASINCRONO, pero el AWAIT espera a que termine. encriptación contraseña 8 caracteres
        //query
        connection.query("INSERT INTO cliente SET ?", { //la interrogacion indica que lo que sigue es lo que se manda,  
            username: user,
            nombre: nombre,
            apellido: apellido,
            pass: passwordHaash,
            telefono: telefono,
            email: email
        }, async (error, results) => {
            if (error) {
                res.send(error);
            } else {
                res.render("../views/registro.ejs", {
                    alert: true,
                    alertTitle: "Registro Exitoso",
                    alertMessage: "¡Registro exitoso!",
                    alertIcon: "sucess",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ""
                })
            }

        })

    })

    //metodo POST para autenticar en el login
    app.post("/auth", async (req, res) => {
        console.log(req.body);
        const { user, pass, option } = req.body;
        let passwordHaash = await bcryptjs.hash(pass, 8);
        console.log("hasta aca bien")

        if (user && pass) {
            console.log("ayuda por favor")
            if (option == "Cliente") {
                console.log("aquí ocurria el problema")
                connection.query("SELECT * FROM cliente WHERE username = ?", [user], async (error, results) => {
                    if (error) {
                        res.send(error);
                    } else {
                        if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                            //SWAL2 para errores
                            res.render("../views/logueo.ejs", {
                                alert: true,
                                alertTitle: "ERROR",
                                alertMessage: "Usuario y/o contraseña Incorrectas",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer: false,
                                ruta: "login"
                            })
                        } else {
                            req.session.loggedin = true;
                            req.session.name = results[0].nombre;
                            req.session.rol = results[0].rol;
                            req.session.id_element = results[0].id_element;
                            
                            //SWAL2 para login correcto
                            res.render("../views/logueo.ejs", {
                                alert: true,
                                alertTitle: "Conexion exitosa",
                                alertMessage: "Usuario y/o contraseña correctos",
                                alertIcon: "success",
                                showConfirmButton: true,
                                timer: false,
                                ruta: "vistas"
                            })
                        }
                    }

                })


            } else if (option == "Administrador") {
                console.log("entro en admin")
                connection.query("SELECT * FROM administrador WHERE user = ?", [user], async (error, results) => {
                    console.log("jelou")
                    if (error) {
                        res.send(error);
                    } else {
                        if (results.length === 0 || !(pass === results[0].passwordd)) {
                            //SWAL2 para errores
                            res.render("../views/logueo.ejs", {
                                alert: true,
                                alertTitle: "ERROR",
                                alertMessage: "Usuario y/o contraseña Incorrectas",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer: false,
                                ruta: "login"
                            })
                        } else {
                            req.session.loggedin = true;
                            req.session.name = results[0].nombre;
                            console.log(req.session.name);
                            req.session.rol = results[0].rol;
                            req.session.idd = results[0].id;

                            console.log(results[0].id);
                            console.log(req.session.idd);
                            console.log(results[0].rol);
                            //SWAL2 para login correcto
                            res.render("../views/logueo.ejs", {
                                alert: true,
                                alertTitle: "Conexion exitosa",
                                alertMessage: "Usuario y/o contraseña correctos",
                                alertIcon: "success",
                                showConfirmButton: true,
                                timer: false,
                                ruta: "vistas"
                            })
                        }
                    }

                })
            } else if (option == "Vendedor") {
                connection.query("SELECT * FROM vendedor WHERE username = ?", [user], async (error, results) => {
                    if (error) {
                        res.send(error);
                    } else {
                        if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].password))) {
                            //SWAL2 para errores
                            res.render("../views/logueo.ejs", {
                                alert: true,
                                alertTitle: "ERROR",
                                alertMessage: "Usuario y/o contraseña Incorrectas",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer: false,
                                ruta: "vistas"
                            })
                        } else {
                            req.session.loggedin = true;
                            req.session.name = results[0].nombre;
                            req.session.rol = results[0].rol;
                            console.log(results[0].rol);
                            //SWAL2 para login correcto
                            res.render("../views/logueo.ejs", {
                                alert: true,
                                alertTitle: "Conexion exitosa",
                                alertMessage: "Usuario y/o contraseña correctos",
                                alertIcon: "success",
                                showConfirmButton: true,
                                timer: false,
                                ruta: "vistas"
                            })
                        }
                    }

                })
            }
        }

    })


    app.post("/modificar-datos", async (req, res) => {
        console.log(req.body);
        console.log(req.session.idd)
        const { user, pass, nombre, apellido, telefono, email } = req.body;

        let sql = "";
        let lista = [user, nombre, pass, apellido, telefono, email];
        let listaDepurada = [];
        for (let z = 0; z < lista.length; z++) {
            if (lista[z] != null || lista[z] != '') {
                listaDepurada.push(lista[z]);
            }
        }
        let tablas = ["user", "nombre", "passwordd", "appellido", "telefono", "email"]
        for (let i = 0; i < listaDepurada.length; i++) {
            console.log(listaDepurada[i]);
            let data = [lista[i], req.session.idd]
            let valor = tablas[i];

            sql = `UPDATE administrador SET ? WHERE id = ?`;
            connection.query("UPDATE administrador SET " + valor + " = ? WHERE id = ?", [listaDepurada[i], req.session.idd], async (error, results) => {
                if (error) {
                    res.send(error);
                } else {
                    res.render("../views/index.ejs", {
                        alert: true,
                        alertTitle: "Modificación de datos exitosa",
                        alertMessage: "Modificación exitosa",
                        alertIcon: "sucess",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "/logout"

                    })
                }

            })
        }
    })

    app.post("/modificar-datosvend", async (req, res) => {
        console.log(req.body);
        console.log(req.session.idd)
        const { user, pass, nombre, apellido, telefono, email } = req.body;

        let sql = "";
        let lista = [user, nombre, pass, apellido, telefono, email];
        let listaDepurada = [];
        for (let z = 0; z < lista.length; z++) {
            if (lista[z] != null || lista[z] != '') {
                listaDepurada.push(lista[z]);
            }
        }
        let tablas = ["user", "nombre", "passwordd", "appellido", "telefono", "email"]
        for (let i = 0; i < listaDepurada.length; i++) {
            console.log(listaDepurada[i]);
            let data = [lista[i], req.session.idd]
            let valor = tablas[i];

            sql = `UPDATE administrador SET ? WHERE id = ?`;
            connection.query("UPDATE administrador SET " + valor + " = ? WHERE id = ?", [listaDepurada[i], req.session.idd], async (error, results) => {
                if (error) {
                    res.send(error);
                } else {
                    res.render("../views/index.ejs", {
                        alert: true,
                        alertTitle: "Modificación de datos exitosa",
                        alertMessage: "Modificación exitosa",
                        alertIcon: "sucess",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "/logout"

                    })
                }

            })
        }
    })

    

    app.get("/deletevendedor/:id", (req, res) => {
        const id = req.params.id;
        connection.query("DELETE FROM vendedor WHERE id = ?", [id], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                connection.query("SELECT * FROM vendedor", (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.render("../views/gestionaraplicacion.ejs", {
                            name: req.session.name,
                            rol: req.session.rol,
                            id: req.session.id,

                            ruta: ""
                        });
                    }
                })
            }
        })
    })

    app.post("/modificar-datos-cliente", async (req, res) => {
        console.log(req.body);
        console.log(req.session.id_element)
        const { user, pass, nombre, apellido, telefono, email } = req.body;

        let sql = "";
        let lista = [user, nombre, pass, apellido, telefono, email];
        let listaDepurada = [];
        for (let z = 0; z < lista.length; z++) {
            if (lista[z] != null || lista[z] != '') {
                listaDepurada.push(lista[z]);
            }
        }
        let tablas = ["user", "nombre", "passwordd", "appellido", "telefono", "email"]
        for (let i = 0; i < listaDepurada.length; i++) {
            console.log(listaDepurada[i]);
            let data = [lista[i], req.session.idd]
            let valor = tablas[i];

            sql = `UPDATE administrador SET ? WHERE id = ?`;
            connection.query("UPDATE administrador SET " + valor + " = ? WHERE id = ?", [listaDepurada[i], req.session.idd], async (error, results) => {
                if (error) {
                    res.send(error);
                } else {
                    res.render("../views/index.ejs", {
                        alert: true,
                        alertTitle: "Modificación de datos exitosa",
                        alertMessage: "Modificación exitosa",
                        alertIcon: "sucess",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "/logout"

                    })
                }

            })
        }
    })

    app.get("/deletevendedor/:id", (req, res) => {
        const id = req.params.id;
        connection.query("DELETE FROM vendedor WHERE id = ?", [id], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                connection.query("SELECT * FROM vendedor", (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.render("../views/gestionaraplicacion.ejs", {
                            name: req.session.name,
                            rol: req.session.rol,
                            id: req.session.id,

                            ruta: ""
                        });
                    }
                })
            }
        })
    })

    app.get("/deleteservicio/:id", (req, res) => {
        const id = req.params.id;
        connection.query("DELETE FROM servicios WHERE id = ?", [id], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.render("../views/manejarcatalogo.ejs", {
                    name: req.session.name,
                    rol: req.session.rol,
                    id: req.session.id,
                    vendedores: result,
                    ruta: "manejarcatalogo"
                });

            }
        })
    })

    app.get("/deleteproducto/:id", (req, res) => {
        const id = req.params.id;
        connection.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.render("../views/manejarcatalogo.ejs", {
                    name: req.session.name,
                    rol: req.session.rol,
                    id: req.session.id,
                    vendedores: result,
                    ruta: "manejarcatalogo"
                });

            }
        })
    })

    app.post("/crearvendedor", async (req, res) => {  //recibo los datos de register
        console.log(req.body);          //req.body es lo que recibe los datos
        const { user, pass, nombre, apellido, telefono, email } = req.body;
        let passwordHaash = await bcryptjs.hash(pass, 8); //ASINCRONO, pero el AWAIT espera a que termine. encriptación contraseña 8 caracteres
        //query
        connection.query("INSERT INTO vendedor SET ?", { //la interrogacion indica que lo que sigue es lo que se manda,  
            username: user,
            nombre: nombre,
            apellido: apellido,
            password: passwordHaash,
            telefono: telefono,
            email: email
        }, async (error, results) => {
            if (error) {
                res.send(error);
            } else {
                res.render("../views/gestionaraplicacion.ejs", {
                    name: req.session.name,
                    alert: true,
                    alertTitle: "Creacion de vendedor exitosa!",
                    alertMessage: "¡Creación de vendedor exitosa!",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "gestionaraplicacion"
                })
            }

        })

    })

    app.post("/eliminarvendedor", async (req, res) => {  //recibo los datos de register
        console.log(req.body);          //req.body es lo que recibe los datos
        const { id } = req.body;
        //query
        connection.query(`DELETE FROM vendedor WHERE id = ${id}`, async (error, results) => {
            if (error) {
                res.send(error);
            } else {
                res.render("../views/index.ejs", {
                    alert: true,
                    alertTitle: "Eliminación de vendedor exitosa!",
                    alertMessage: "Eliminación de vendedor exitosa!",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "gestionaraplicacion"
                })
            }

        })

    })
}


