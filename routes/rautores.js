module.exports = function(app, swig) {
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });
        res.send(respuesta);
    })
    app.get("/autores", function(req, res) {
        let autores = [ {
            "nombre" : "Tony Banks",
            "grupo" : "Genesis",
            "rol" : "Teclista",
        }, {
            "nombre" : "Stewart Copeland",
            "grupo" : "The Police",
            "rol" : "Batería",
        }, {
            "nombre" : "Jimi Hendrix",
            "grupo" : "The Jimi Hendrix Experience",
            "rol" : "Guitarrista",
        }, {
            "nombre" : "James Hetfield",
            "grupo" : "Metallica",
            "rol" : "Cantante",
        }, {
            "nombre" : "Pete wentz",
            "grupo" : "Fall Out Boy",
            "rol" : "Bajista",
        }]
        let respuesta = swig.renderFile('views/autores.html', {
            autores : autores
        });
        res.send(respuesta);
    });
    app.get("/autores/filtrar/:rol", function(req, res) {
        var rol = req.params.rol;
        let autores = [ {
            "nombre" : "Tony Banks",
            "grupo" : "Genesis",
            "rol" : "Teclista",
        }, {
            "nombre" : "Stewart Copeland",
            "grupo" : "The Police",
            "rol" : "Batería",
        }, {
            "nombre" : "Jimi Hendrix",
            "grupo" : "The Jimi Hendrix Experience",
            "rol" : "Guitarrista",
        }, {
            "nombre" : "James Hetfield",
            "grupo" : "Metallica",
            "rol" : "Cantante",
        }, {
            "nombre" : "Pete wentz",
            "grupo" : "Fall Out Boy",
            "rol" : "Bajista",
        }]
        let respuesta = swig.renderFile('views/autores.html', {
            autores : autores.filter((author=>author.rol.includes(rol)))
        });
        res.send(respuesta);
    });
    app.post("/autor", function(req, res) {
        let nombre = "Autor agregado: "+req.body.nombre;
        let grupo = " grupo: " +req.body.grupo;
        let rol = " rol: "+req.body.rol;
        if(nombre=="Autor agregado: ")
            nombre = "Nombre no enviado en la petición.";
        if(grupo==" grupo: ")
            grupo = "Grupo no enviado en la petición.";
        if(rol==" rol: ")
            rol = "Rol no enviado en la petición.";
        res.send( nombre + "<br>" + grupo + "<br>" + rol);
    });
    app.get('/autores/*', function (req, res) {
        res.redirect("/autores");
    })
};