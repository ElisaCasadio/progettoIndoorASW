$(document).ready(function() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var cat = url.searchParams.get("cat");
    getDirectionFromBeacon("00000001", "Aula B", cat);
});

function createNewDirection(src, alt, text) {
    var newDirection = document.createElement("div");
    newDirection.className = "direction";
    var newImageDirection = document.createElement("div");
    newImageDirection.className = "direction-image";
    var imageDirection = document.createElement("IMG");
    imageDirection.src = src;
    imageDirection.alt = alt;
    newImageDirection.appendChild(imageDirection);
    newDirection.appendChild(newImageDirection);
    var newTextDirection = document.createElement("div");
    newTextDirection.className = "direction-text";
    var textDirection = document.createElement("p");
    var text = document.createTextNode(text);
    textDirection.appendChild(text);
    newTextDirection.appendChild(textDirection);
    newDirection.appendChild(newTextDirection);
    document.getElementById("way").appendChild(newDirection);
}

function getDirectionFromBeacon(uuid, room, cat) {
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var allDirectionFromBeacon = JSON.parse(xmlhttp.responseText);
            var i;
            for (i = 0; i < allDirectionFromBeacon.length; i++) {
                createNewDirection(allDirectionFromBeacon[i].Immagine,
                    allDirectionFromBeacon[i].Alt,
                    allDirectionFromBeacon[i].Testo);
            }
        }
    }
    xmlhttp.open("GET", "http://progettoindoor.altervista.org/getInstructions.php?UUID=" + 
            uuid + "&dest=\'" + room + "\'&cat=" + cat, true);
    xmlhttp.send();
}

/*FOR AJAX:
 * 
 * http://progettoindoor.altervista.org/getInstructions.php?UUID=00000001&dest='Aula B'&cat=1
 * 
 * */