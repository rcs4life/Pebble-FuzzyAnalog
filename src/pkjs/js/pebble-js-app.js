var initialised = false;

function appMessageAck(e) {
    console.log("options sent to Pebble successfully");
}

function appMessageNack(e) {
    console.log("options not sent to Pebble: " + e.error.message);
}

Pebble.addEventListener("ready", function() {
    initialised = true;
});

Pebble.addEventListener("showConfiguration", function() {
    var options = JSON.parse(localStorage.getItem('fuz_ana_opt'));
    console.log("read options: " + JSON.stringify(options));
    console.log("showing configuration");

	var chalk = Pebble.getActiveWatchInfo && Pebble.getActiveWatchInfo().platform === "chalk" ? 'yes' : 'no';
	var uri = 'http://panicman.github.io/config_fuzana.html?title=Fuzzy%20Analog%20v3.2&chalk='+chalk;

	if (options !== null) {
        uri +=
			'&theme=' + encodeURIComponent(options.theme) + 
			'&fsm=' + encodeURIComponent(options.fsm) + 
			'&inv=' + encodeURIComponent(options.inv) + 
			'&anim=' + encodeURIComponent(options.anim) + 
			'&sep=' + encodeURIComponent(options.sep) +
			'&datefmt=' + encodeURIComponent(options.datefmt) + 
			'&smart=' + encodeURIComponent(options.smart) + 
			'&vibr=' + encodeURIComponent(options.vibr);
    }
	console.log("Uri: "+uri);
    Pebble.openURL(uri);
});

Pebble.addEventListener("webviewclosed", function(e) {
    console.log("configuration closed");
    if (e.response !== '') {
        var options = JSON.parse(decodeURIComponent(e.response));
        console.log("storing options: " + JSON.stringify(options));
        localStorage.setItem('fuz_ana_opt', JSON.stringify(options));
        Pebble.sendAppMessage(options, appMessageAck, appMessageNack);
    } else {
        console.log("no options received");
    }
});
