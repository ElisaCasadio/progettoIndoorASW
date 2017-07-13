$(document).ready(function() {
    typeRoute();
});

function typeRoute() {
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var allRoute = JSON.parse(xmlhttp.responseText);
            parseRoute(allRoute);
        }
    };
    xmlhttp.open("GET", "http://progettoindoor.altervista.org/getAllTypeRoute.php", true);
    xmlhttp.send();
}

function parseRoute(allRoute) {
    var out = "";
    var i;
    for (i = 0; i < allRoute.length; i++) {
        out += '<button id=\"' + allRoute[i].Tipo + 
                    '" class="button" type="button" onclick="window.location.href=\'percorso.html?cat=' + (i+1) + '\';">' + 
                    allRoute[i].Descrizione + '</button>';
    }
    document.getElementById("route-choice").innerHTML = out;
}