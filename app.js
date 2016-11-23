var url_dedicada = 'https://cesjam7.github.io/dedicafy/';

var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var remitente = getParameterByName('from');
var destinatario = getParameterByName('to');
var idcancion = getParameterByName('id');

if (remitente.length > 0 && destinatario.length > 0 && idcancion.length > 0) {
    modulo_dedicar = false;
    modulo_recibir = true;
} else {
    modulo_dedicar = true;
    modulo_recibir = false;
}

var dedicar = new Vue({
    el : '#dedicar-cancion',
    data: {
        dedicar : modulo_dedicar,
        remitente : '',
        destinatario : '',
        consulta : '',
        canciones : [],
        buscarText : 'Buscar',
        seleccionado : false,
        seleccion : {},
        link : false
    },
    methods : {
        buscar : function () {
            this.buscarText = 'Buscando canciones';
            var apiUrl = "https://api.spotify.com/v1/search?q="+this.consulta+"&type=track";
            var xhr = new XMLHttpRequest();
            xhr.open('GET', apiUrl);
            xhr.onload = function () {
                resultados = JSON.parse(xhr.responseText)
                mostrarDatos(resultados.tracks.items)
            }
            xhr.send()
        },
        reproducir : function(preview_url) {
            var preview = new Audio(preview_url);
            preview.play();
        },
        seleccionar : function(id) {
            var result = this.canciones.filter(function( obj ) {
                return obj.id == id;
            });
            this.seleccion = {
                name : result[0].name,
                id : id,
                autor : result[0].autor
            }
            this.seleccionado = true;
        },
        generar : function() {
            this.link = url_dedicada + '?from=' + this.remitente + '&to=' + this.destinatario + '&id=' + this.seleccion.id;
        }
    }
})

var mostrarDatos = function(datos) {
    dedicar.canciones = [];
    for (var i=0; i < datos.length; i++) {
        if (datos[i].artists.length > 1) {
            var autores = [];
            for (var a=0; a < datos[i].artists.length; a++) {
                autores.push(datos[i].artists[a].name)
            }
            var autor = autores.join(', ');
        } else {
            var autor = datos[i].artists[0].name;
        }
        var cancion = {
            name : datos[i].name,
            id : datos[i].id,
            autor : autor,
            preview : datos[i].preview_url
        }
        dedicar.canciones.push(cancion);
    }
    dedicar.buscarText = 'Buscar';
}

var recibir = new Vue({
    el : '#recibir-cancion',
    data : {
        recibir : modulo_recibir,
        remitente : remitente,
        destinatario : destinatario,
        idcancion : idcancion,
        cancion : false
    },
    methods : {
        escuchar : function(id_cancion) {
            var apiUrl = "https://api.spotify.com/v1/tracks/"+id_cancion;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', apiUrl);
            xhr.onload = function () {
                resultado = JSON.parse(xhr.responseText)
                console.log(resultado);
                mostrarCancion(resultado);
                var preview = new Audio(resultado.preview_url);
                preview.play();
            }
            xhr.send()
        }
    }
});

var mostrarCancion = function(datos) {
    if (datos.artists.length > 1) {
        var autores = [];
        for (var a=0; a < datos.artists.length; a++) {
            autores.push(datos.artists[a].name)
        }
        var autor = autores.join(', ');
    } else {
        var autor = datos.artists[0].name;
    }
    recibir.cancion = {
        nombre : datos.name,
        cantante : autor,
        albun : datos.album.name,
        imagen : datos.album.images[0].url,
        link_spotify : datos.uri,
        link_web : datos.external_urls.spotify
    }
}
