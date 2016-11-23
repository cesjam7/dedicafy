var url_dedicada = 'file:///Users/hedwig/Documents/learning/buscador/dedicado.html';

var dedicar = new Vue({
    el : '#dedicar-cancion',
    data: {
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
