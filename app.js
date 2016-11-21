var preview = null

var buscar = new Vue({
    el : '#buscar-cancion',
    data: {
        consulta : '',
        canciones : [],
        buscarText : 'Buscar'
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
        }
    }
})

var mostrarDatos = function(datos) {
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
            autor : autor,
            preview : datos[i].preview_url
        }
        buscar.canciones.push(cancion);
    }
    buscar.buscarText = 'Buscar';
    console.log(datos);
}
