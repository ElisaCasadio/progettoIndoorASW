$(document).ready(function() {
    createNewDirection("img/ahead.png","Freccia dritto","Dritto");
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

/*FOR AJAX:
 * 
 * http://progettoindoor.altervista.org/getInstructions.php?UUID=00000001&dest='Aula B'&cat=1
 * 
 * */