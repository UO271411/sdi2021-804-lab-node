module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        //Comprobaciones
        if(propietario(req, criterio)) {

            gestorBD.eliminarCancion(criterio, function (canciones) {
                if (canciones == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(200);
                    res.send(JSON.stringify(canciones));
                }
            });
        }else{
            res.status(404);
            res.json({
                error: "se ha producido un error"
            })
        }
    });

    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        //Comprobaciones
        if(comprobarCampos(req.body.nombre,req.body.genero,req.body.precio)) {
            gestorBD.insertarCancion(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "canción insertada",
                        _id: id
                    })
                }
            });
        }
        else {
            res.status(404);
            res.json({
                error: "se ha producido un error, formato incorrecto"
            })
        }

    });

    function propietario(req, criterio){
        gestorBD.obtenerCanciones(criterio,function(canciones) {
            if (req.session.usuario == null || canciones == null)
                return false;
            else {
                return req.session.usuario == (canciones[0].autor);
            }
        });
    }

    function comprobarCampos(nombre, genero, precio){
        return (precio >= 0 && genero != "" && nombre!="" && genero!=null && nombre!=null && nombre.length > 1)
    }

    app.put("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        //Comprobaciones
        if(propietario(req, criterio)) {

            let cancion = {}; // Solo los atributos a modificar
            if (req.body.nombre != null)
                cancion.nombre = req.body.nombre;
            if (req.body.genero != null)
                cancion.genero = req.body.genero;
            if (req.body.precio != null)
                cancion.precio = req.body.precio;
            gestorBD.modificarCancion(criterio, cancion, function (result) {
                if (result == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(200);
                    res.json({
                        mensaje: "canción modificada",
                        _id: req.params.id
                    })
                }
            });
        }
        else {
            res.status(500);
            res.json({
                error: "se ha producido un error"
            })
        }
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });


    app.post("/api/autenticar/", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }
        // ¿Validar nombre, genero, precio?

        gestorBD.obtenerUsuarios(criterio, function(usuarios){
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json({
                    autenticado : false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado : true,
                    token : token
                })
            }
        });

    });
}
