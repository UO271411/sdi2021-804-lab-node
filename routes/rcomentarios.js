module.exports = function(app, swig, gestorBD) {
    app.post("/comentarios/:cancion_id", function(req, res) {
        if ( req.session.usuario == null){
            res.send("Error al insertar el comentario, usuario no identificado");
        }
        else {
            let comentario = {
                autor: req.session.usuario,
                texto: req.body.texto,
                cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id)
            }
            // Conectarse
            gestorBD.insertarComentario(comentario, function (id) {
                if (id == null) {
                    res.send("Error al insertar el comentario");
                } else {
                    res.send("Agregado comentario id: " + id);
                }
            });
        }
    });
    app.get('/comentarios/borrar/:id', function (req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        gestorBD.obtenerComentarios(criterio,function(comentarios) {
            if (comentarios == null) {
                res.send("Comentario no encontrado");
            } else {
                if(comentarios[0] == null){
                    res.send("El comentario especificado no existe");
                }
                else  if (req.session.usuario != comentarios[0].autor) {
                    res.send("No tiene permiso para borrar este comentario");
                } else {
                    gestorBD.borrarComentario(criterio, function (comentarios) {
                        res.send("Comentario borrado");
                    });
                }
            }
        });
    });
};