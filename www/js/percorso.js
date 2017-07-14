var listUUID;

$(document).ready(function() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var room = url.searchParams.get("aula");
    document.getElementById("roomNameDirection").innerHTML = room;
    typeRoute(room);
    listUUID = new Array();
});

function typeRoute(room) {
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var allRoute = JSON.parse(xmlhttp.responseText);
            parseRoute(allRoute, room);
        }
    };
    xmlhttp.open("GET", "http://progettoindoor.altervista.org/getAllTypeRoute.php", true);
    xmlhttp.send();
}

function parseRoute(allRoute, room) {
    var out = "";
    var i;
    for (i = 0; i < allRoute.length; i++) {
        out += '<button id=\"' + allRoute[i].Tipo +
                '" class="button" type="button" onclick="startScanForBeacons(\'' + room + '\', ' + (i+1) + ');">' +
                allRoute[i].Descrizione + '</button>';
    }
    document.getElementById("route-choice").innerHTML = out;
}

function print(string) {
  var div = document.getElementById("way");
  var p = document.createElement('p');
  p.innerHTML = string;
  div.appendChild(p);
}

function showElement() {
    document.getElementById("rootTitle").style.display = 'block';
    document.getElementById("way").style.display = 'block';
}

function hiddenElement() {
    document.getElementById("choice").style.display = 'none';
    document.getElementById("route-choice").style.display = 'none';
}

function startScanForBeacons(room, cat) {

    hiddenElement();
    showElement();

  var beaconRegions = [
  {
        id: 'd0e7eb3102d7',
        uuid:'B9407F30-F5F8-466E-AFF9-25556B57FEED',
        major: 727,
        minor: 60209
      },
    {
        id: 'ef0859f9b2ea',
        uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
        major: 45802,
        minor: 23033
      },
    {
        id: 'd89b71d1f85b',
        uuid:'083A8F19-7CAE-9B2A-BDAF-5CDFBC9AA7DB',
        major: 63579,
        minor: 29137
      }
    ];

  var delegate = new cordova.plugins.locationManager.Delegate();

  delegate.didDetermineStateForRegion = function(pluginResult)
  {
    if(pluginResult) {
      var s = '[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult);
    } else {
      var s = 'didDetermineStateForRegion did not return data';
    }
  };

  delegate.didStartMonitoringForRegion = function(pluginResult)
  {
    if(pluginResult) {
      var s = 'didStartMonitoringForRegion:' + JSON.stringify(pluginResult);
    } else {
      var s = "didStartMonitoringForRegion is empty";
    }
  };

  delegate.didRangeBeaconsInRegion = function(pluginResult){ };

  delegate.didEnterRegion = function(result){
    if(result){
        var region = result['region'];
        var UUID = region['uuid'];
        var found = false;
        for(var i=0; i<listUUID.length; i++) {
          if(listUUID[i] == UUID) {
            found = true;
          }
        }
        s = s + "\n - regione = " + JSON.stringify(region);
        s = s + "\n - uuid = " + region['uuid'];
        if(found == false) {
          getDirectionFromBeacon(UUID, room, cat);
          listUUID.push(UUID);
        }
    } else {
        var s = "didEnterRegion has no data.";
    }
  };

  cordova.plugins.locationManager.setDelegate(delegate);

  for (var i = 0; i < beaconRegions.length; i++)
  {
    var region = beaconRegions[i];

    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
      region.id, region.uuid, region.major, region.minor);

    // Start monitoring.
    cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
      .fail(function(e) {/*print(e);*/})
      .done();

    // Start ranging.
    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
      .fail(function(e) {/*print(e);*/})
      .done();
  }

}

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
          //print("Risposta ricevuta " + xmlhttp.responseText);
            var allDirectionFromBeacon = JSON.parse(xmlhttp.responseText);
            //print("Direzione ricevute " + allDirectionFromBeacon.length);
            var i;
            for (i = 0; i < allDirectionFromBeacon.length; i++) {
                createNewDirection(allDirectionFromBeacon[i].Immagine,
                    allDirectionFromBeacon[i].Alt,
                    allDirectionFromBeacon[i].Testo);
            }
        }
    };
    var ind = "http://progettoindoor.altervista.org/getInstructions.php?UUID=\"" +
            uuid + "\"&dest=\"" + room + "\"&cat=" + cat;
    xmlhttp.open("GET", ind, true);
    xmlhttp.send();
}

/*FOR AJAX:
 *
 * http://progettoindoor.altervista.org/getInstructions.php?UUID=00000001&dest='Aula B'&cat=1
 *
 * */
