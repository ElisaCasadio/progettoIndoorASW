$(document).ready(function() {
  var aula = start();
  var nomeAula = aula.substring(1,aula.length-1);
  $("#go").click(function(){
    var percorso = 'scelta_percorso.html?aula='+nomeAula;
    console.log(percorso);
    window.location.href='percorso.html?aula='+nomeAula;
  });
  $("#time").click(function(){
    var percorso = 'scelta_percorso.html?aula='+nomeAula;
    console.log(percorso);
    window.location.href='orario.html?aula='+nomeAula;
  });
});

function start() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var aula = url.searchParams.get("aula");
  console.log(aula);
  roomDetail(aula);
  return aula;
}

function roomDetail(aula) {
  var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var info = JSON.parse(xmlhttp.responseText);
          var posti = info[0].Num_posti;
          var libera = info[1].Free;
          var nomeAula = aula.substring(1,aula.length-1);
          document.getElementById("roomName").innerHTML = nomeAula;
          document.getElementById("num_posti").innerHTML = posti;
          if (libera == true) {
            document.getElementById("libera").innerHTML = "libera";
          } else {
            document.getElementById("libera").innerHTML = "occupata";
          }
      }
  };
  xmlhttp.open("GET", "http://progettoindoor.altervista.org/getInfo.php?nome=" + aula + "", true);
  xmlhttp.send();
}
