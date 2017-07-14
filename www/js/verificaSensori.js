function onReady() {
    try {
        cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
            if (!enabled) {
                createAlert("LOCALIZZAZIONE NON ATTIVA", "Per poter utilizzare l'app è necessario attivare la localizzazione.");
            }
        }, function(error) {
            console.error("A plugin error occured: " + error);
        });
    } catch(e) {
        console.error("An exeption occurred: " + e);
    }
    try {
        cordova.plugins.diagnostic.isBluetoothEnabled(function(enabled) {
            if (!enabled) {
                createAlert("BLUETOOTH NON ATTIVO", "Per poter utilizzare l'app è necessario attivare il bluetooth.");
            }
        }, function(error) {
            console.error("A plugin error occured: " + error);
        });
    } catch(e) {
        console.error("An exeption occurred: " + e);
    }
    
    try {
        if (navigator.connection.type == Connection.NONE) {
            createAlert("RETE NON DISPONIBILE", "Per poter utilizzare l'app è necessario attivare una connessione di rete.");
        }
    } catch(e) {
        console.error("An exeption occurred: " + e);
    }
}

function createAlert(title, message) {
    navigator.notification.alert(message, null, title, "OK");
}

document.addEventListener("deviceready", onReady, false);



