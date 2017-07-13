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

      //print(s);
    };

    delegate.didStartMonitoringForRegion = function(pluginResult)
    {
      if(pluginResult) {
        var s = 'didStartMonitoringForRegion:' + JSON.stringify(pluginResult);
      } else {
        var s = "didStartMonitoringForRegion is empty";
      }

      //print(s);
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
            //$('#orarioRistretto').append('<div><font size = \"15\"> '+ s +' </div>');
      } else {
          var s = "didEnterRegion has no data.";
      }
      //print(s);
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

        //print(beaconRegion);

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

