const bodyDom = document.querySelector(".body");
                
//Ahora revisamos la ESTACION DEL AÑO:
// Obtener la fecha actual
let fechaActual = new Date();
// Obtener el mes (0-11)
let mes = fechaActual.getMonth() + 1;

// Determinar la estación según el mes
if (mes < 4) {//Colocamos la imagen de invierno
    bodyDom.style.background = "url('https://www.telemundo.com/sites/nbcutelemundo/files/images/article/cover/2018/08/31/muneco-de-nieve.jpg')";
} else if (mes < 7) {//Colocamos la imagen de primavera
    bodyDom.style.background = "url('https://www.blogdelfotografo.com/wp-content/uploads/2014/03/Raining-petals_skoeber.jpg')";
} else if (mes < 10) {//Colocamos la imagen de verano
    bodyDom.style.background = "url('https://cadena100-cdnmed.cadena100.es/resources/jpg/0/9/1654690973290.jpg')";
} else {//Colocamos la imagen de otoño
    bodyDom.style.background = "url('http://cdn06.overnature.net/1920/810-otono-en-el-fondo-de-pantalla-del-bosque.jpg')";
}

bodyDom.style.backgroundSize = "cover";