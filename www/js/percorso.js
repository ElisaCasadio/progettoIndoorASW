$(document).ready(function() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var aula = url.searchParams.get("aula");
    document.getElementById("roomNameDirection").innerHTML = aula;
    var cat = url.searchParams.get("cat");
    getDirectionFromBeacon("00000001", aula, cat);

    $("#x").click(function() {
        startScanForBeacons();
    });
});

function print(string) {
  var div = document.getElementById("way");
  var p = document.createElement('p');
  p.innerHTML = string;
  div.appendChild(p);
}

function startScanForBeacons() {
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
        uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
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

    print(s);
  };

  delegate.didStartMonitoringForRegion = function(pluginResult)
  {
    if(pluginResult) {
      var s = 'didStartMonitoringForRegion:' + JSON.stringify(pluginResult);
    } else {
      var s = "didStartMonitoringForRegion is empty";
    }

    print(s);
  };

  delegate.didRangeBeaconsInRegion = function(pluginResult)
  {

  };

  delegate.didEnterRegion = function(result){
    if(result){
        var s = "ENTERED REGION! ";// + JSON.stringify(result);
        var region = result['region'];
        s = s + "\n - regione = " + JSON.stringify(region);
        s = s + "\n - uuid = " + region['uuid'];
    } else {
        var s = "didEnterRegion has no data.";
    }
    print(s);
  };

  cordova.plugins.locationManager.setDelegate(delegate);

  for (var i = 0; i < beaconRegions.length; i++)
  {
    var region = beaconRegions[i];

    /*print("Identificatore = " + region.id);
    print("UUID = " + region.uuid);
    print("Major = " + region.major);
    print("Minor = " + region.minor);
    print("-----");*/
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
      region.id, region.uuid, region.major, region.minor);

    print(beaconRegion);


    // Start monitoring.
    cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
      .fail(function(e) {print(e);})
      .done();

    // Start ranging.
    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
      .fail(function(e) {print(e);})
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
