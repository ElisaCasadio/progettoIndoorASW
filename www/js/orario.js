$(window, document, undefined).ready(function() {
  start();
});

function addTitle(aula) {
  var div = document.getElementById("titolo");
  var h = document.createElement('h1');
  h.setAttribute("id", "orarioAula");
  h.setAttribute("class", "titles");
  var titolo = "Orario " + aula;
  titolo = titolo.replace('\"', '');
  titolo = titolo.replace('\"', '');
  h.innerHTML = titolo;
  div.appendChild(h);
}

function start() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var aula = url.searchParams.get("aula");

  addTitle(aula);

  getTimetables(aula);
}

function getTimetables(aula) {
  var days;
  var hours;
  var xmlhttpGiorno = new XMLHttpRequest();
  xmlhttpGiorno.onreadystatechange = function() {
      if (xmlhttpGiorno.readyState == 4 && xmlhttpGiorno.status == 200) {
          var risposta = xmlhttpGiorno.responseText;
          days = createDaysArray(risposta);
      }
  };
  var indirizzo = "http://progettoindoor.altervista.org/getDays.php";
  xmlhttpGiorno.open("GET", indirizzo, true);
  xmlhttpGiorno.send();

  var xmlhttpOra = new XMLHttpRequest();
  xmlhttpOra.onreadystatechange = function() {
      if (xmlhttpOra.readyState == 4 && xmlhttpOra.status == 200) {
          var risposta = xmlhttpOra.responseText;
          hours = createHoursArray(risposta);
          //alert("Numero ore ritornate = " + hours.length);
      }
  };
  var indirizzo = "http://progettoindoor.altervista.org/getHours.php";
  //alert("indirizzo ore = " + indirizzo);
  xmlhttpOra.open("GET", "http://progettoindoor.altervista.org/getHours.php", true);
  xmlhttpOra.send();

  var xmlhttpOrario = new XMLHttpRequest();
  xmlhttpOrario.onreadystatechange = function() {
      if (xmlhttpOrario.readyState == 4 && xmlhttpOrario.status == 200) {
          var risposta = xmlhttpOrario.responseText;
          //alert("Risposta = " + risposta);
          analizzaRisposta(days, hours, risposta);
      }
  };
  xmlhttpOrario.open("GET", "http://progettoindoor.altervista.org/getTimetables.php?aula=" + aula, true);
  xmlhttpOrario.send();
}

function analizzaRisposta(days, hours, risposta) {
  var orario = JSON.parse(risposta);
  var indexLesson = 0;
  //var lezione1 = JSON.stringify(orario[0]);
  for (var i = 0; i < orario.length; i++) {
    var lezione1 = orario[i];

    var inizio = lezione1['OraInizio'];
    var fine = lezione1['OraFine'];
    var idora = lezione1['OraId'];
    var gg = lezione1['NomeGiorno'];
    var idgg = lezione1['GiornoId'];
    var mat = lezione1['NomeMateria'];
    /*alert("Ora di inizio = " + inizio + " \n Ora di fine = " + fine +
        "\n Giorno = " + gg + "\n Materia = " + mat);*/
  }

  var tablearea = document.getElementById('tabellaGrande');
  var table = document.createElement('table');
  table.setAttribute("class", "tabellaOrario");

  //prima riga
  var tr = document.createElement('tr');
  for(var i = 0; i <= days.length; i++) {
    tr.appendChild(document.createElement('th'));
  }
  tr.cells[0].setAttribute("id", "timeColumn");
  tr.cells[0].appendChild(document.createTextNode(''));
  for(var i = 0; i < days.length; i++) {
    var index = i+1;
    var giorno = days[i].nome;
    tr.cells[index].appendChild(document.createTextNode(giorno));
  }
  table.appendChild(tr);

  //altrerighe
  for(var j=0; j<hours.length; j++) {
    var tr = document.createElement('tr');
    for(var i = 0; i <= days.length; i++) {
      tr.appendChild(document.createElement('td'));
    }
    var inizio = hours[j].inizio;
    var fine = hours[j].fine;
    inizio = inizio.replace(':00', '');
    fine = fine.replace(':00', '');
    var text = inizio + " - " + fine;
    tr.cells[0].appendChild(document.createTextNode(text));

    for(var i = 0; i < days.length; i++) {
      var index = i+1;
      tr.cells[index].appendChild(document.createTextNode("Ciao"));
    }
    table.appendChild(tr);
  }

  tablearea.appendChild(table);

  tabellaFake();
}

function tabellaFake() {
  var tablearea = document.getElementById('tablearea');
  table = document.createElement('table');

  for (var i = 1; i < 4; i++) {
    var tr = document.createElement('tr');

    tr.appendChild( document.createElement('td') );
    tr.appendChild( document.createElement('td') );

    tr.cells[0].appendChild( document.createTextNode('Text1') )
    tr.cells[1].appendChild( document.createTextNode('Text2') );

    table.appendChild(tr);
  }

  var tr = document.createElement('tr');

  tr.appendChild( document.createElement('td') );
  tr.appendChild( document.createElement('td') );

  tr.cells[0].setAttribute("rowspan", 2);
  tr.cells[0].appendChild( document.createTextNode('textper2') );
  tr.cells[1].appendChild( document.createTextNode('textnormal') );

  table.appendChild(tr);

  var tr = document.createElement('tr');

  tr.appendChild( document.createElement('td') );

  tr.cells[0].appendChild( document.createTextNode('textnormal') );

  table.appendChild(tr);

  tablearea.appendChild(table);
}

function createDaysArray(risposta) {
  var giorni = JSON.parse(risposta);
  var days = [];
  for(var i = 0; i < giorni.length; i++) {
    var giorno = giorni[i];
    var ggid =  giorno['ID'];
    var ggnome = giorno['Nome'];
    days.push({id: ggid, nome: ggnome});
  }

  return days;
}

function createHoursArray(risposta) {
  var ore = JSON.parse(risposta);
  var hours = [];
  for(var i = 0; i < ore.length; i++) {
    var ora = ore[i];
    var hid =  ora['ID'];
    var hinizio = ora['OraInizio'];
    var hfine = ora['OraFine'];
    hours.push({id: hid, inizio: hinizio, fine: hfine});
  }

  return hours;
}
