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
  console.log("Nome aula = " + aula);
  addTitle(aula);

  getGiorni(aula);
}

function getGiorni(aula) {
  var days;
  var xmlhttpGiorno = new XMLHttpRequest();
  xmlhttpGiorno.onreadystatechange = function() {
      if (xmlhttpGiorno.readyState == 4 && xmlhttpGiorno.status == 200) {
          var risposta = xmlhttpGiorno.responseText;
          days = createDaysArray(risposta);
          getOre(aula, days);
      }
  };
  var indirizzo = "http://progettoindoor.altervista.org/getDays.php";
  xmlhttpGiorno.open("GET", indirizzo, true);
  xmlhttpGiorno.send();
}

function getOre(aula, days) {
  var xmlhttpOra = new XMLHttpRequest();
  xmlhttpOra.onreadystatechange = function() {
      if (xmlhttpOra.readyState == 4 && xmlhttpOra.status == 200) {
          var risposta = xmlhttpOra.responseText;
          var hours = createHoursArray(risposta);
          getTimetables(aula, days, hours);
          //alert("Numero ore ritornate = " + hours.length);
      }
  };
  var indirizzo = "http://progettoindoor.altervista.org/getHours.php";
  xmlhttpOra.open("GET", "http://progettoindoor.altervista.org/getHours.php", true);
  xmlhttpOra.send();
}

function getTimetables(aula, days, hours) {
  var xmlhttpOrarioH = new XMLHttpRequest();
  xmlhttpOrarioH.onreadystatechange = function() {
      if (xmlhttpOrarioH.readyState == 4 && xmlhttpOrarioH.status == 200) {
          var risposta = xmlhttpOrarioH.responseText;
          creaTabellaGrande(days, hours, risposta);
      }
  };
  var indH = "http://progettoindoor.altervista.org/getTimetablesHours.php?aula=\"" + aula + "\"";
  console.log("Indirrizo " + indH);
  xmlhttpOrarioH.open("GET", indH, true);
  xmlhttpOrarioH.send();

  var xmlhttpOrarioD = new XMLHttpRequest();
  xmlhttpOrarioD.onreadystatechange = function() {
      if (xmlhttpOrarioD.readyState == 4 && xmlhttpOrarioD.status == 200) {
          var risposta = xmlhttpOrarioD.responseText;
          creaTabellaPiccola(days, hours, risposta);
      }
  };
  var indD = "http://progettoindoor.altervista.org/getTimetablesDays.php?aula=\"" + aula + "\"";
  console.log("Indirizzo 2: " + indD);
  xmlhttpOrarioD.open("GET", indD, true);
  xmlhttpOrarioD.send();
}

function creaTabellaGrande(days, hours, risposta) {
  var orario = JSON.parse(risposta);
  var indexLesson = 0;
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
  var trold;
  for(var j=0; j<hours.length; j++) {
    var tr = document.createElement('tr');
    tr.appendChild(document.createElement('td'));
    var inizio = hours[j].inizio;
    var fine = hours[j].fine;
    inizio = inizio.replace(':00', '');
    fine = fine.replace(':00', '');
    var text = inizio + " - " + fine;
    tr.cells[0].appendChild(document.createTextNode(text));

    var index = 1;
    for(var i = 0; i < days.length; i++) {
      var lesson = orario[indexLesson];
      var s;
      if(lesson!=null && lesson['OraId'] == hours[j].id &&
          lesson['GiornoId'] == days[i].id) {
            s = lesson['NomeMateria'];
            if(trold != null) {
              if(trold.cells[index] != null &&
                trold.cells[index].innerHTML == s) {
                trold.cells[index].setAttribute("rowspan", "2");
              } else {
                tr.appendChild(document.createElement('td'));
                tr.cells[index].appendChild(document.createTextNode(s));
                index = index + 1;
              }
            } else {
              tr.appendChild(document.createElement('td'));
              tr.cells[index].appendChild(document.createTextNode(s));
              index = index + 1;
            }
          indexLesson = indexLesson + 1;
      } else {
        tr.appendChild(document.createElement('td'));
        s = "";
        tr.cells[index].appendChild(document.createTextNode(s));
        index = index + 1;
      }
    }
    trold = tr;
    table.appendChild(tr);
  }

  tablearea.appendChild(table);

}

function creaTabellaPiccola(days, hours, risposta) {
  var orario = JSON.parse(risposta);
  var indexLesson = 0;
  var tablearea = document.getElementById('tabellaPiccola');
  var table = document.createElement('table');
  table.setAttribute("class", "orarioRistretto");

  for(var i = 0; i < days.length; i++ ) {
    var trgg = document.createElement('tr');
    trgg.appendChild(document.createElement('th'));
    trgg.cells[0].setAttribute("colspan", "2");
    var nome = days[i].nome;
    trgg.cells[0].appendChild(document.createTextNode(nome));
    table.appendChild(trgg);

    for(var j=0; j<hours.length; j++) {
        var lesson = orario[indexLesson];
        if(lesson != null && lesson['OraId'] == hours[j].id &&
            lesson['GiornoId'] == days[i].id) {
              var idMat = lesson['MateriaId'];
              var nome = lesson['NomeMateria'];

              var indexLesson2 = indexLesson + 1;
              var inc = 0;
              var lastLess;
              while (indexLesson2 < orario.length && (j + inc) < hours.length
                && orario[indexLesson2]['MateriaId'] == idMat) {
                  inc = inc + 1;
                  lastLess = orario[indexLesson2];
                  indexLesson2 = indexLesson2 + 1;
              }

              var inizio = hours[j].inizio;

              if(inc != 0) {
                indexLesson = indexLesson + inc;
                j = j + inc;
                var fine = hours[j].fine;
              }

              inizio = inizio.replace(':00', '');
              fine = fine.replace(':00', '');
              var text = inizio + " - " + fine;

              var trless = document.createElement('tr');
              trless.appendChild(document.createElement('td'));
              trless.appendChild(document.createElement('td'));
              trless.cells[0].setAttribute("class", "time");
              trless.cells[0].appendChild(document.createTextNode(text));
              trless.cells[1].appendChild(document.createTextNode(nome));
              indexLesson = indexLesson + 1;

              table.appendChild(trless);
        }
    }
  }

  tablearea.appendChild(table);

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
