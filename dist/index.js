"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html5_qrcode_1 = require("html5-qrcode");
var HTML_ELEMENT_ID = 'reader';
var camId = null;
html5_qrcode_1.Html5Qrcode.getCameras().then(function (devices) {
    if (devices && devices.length) {
        camId = devices[0].id;
        var html5QrCode = new html5_qrcode_1.Html5Qrcode(HTML_ELEMENT_ID);
        html5QrCode.start(camId, {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        }, function (decodedText, decodedResult) {
            console.log(decodedText);
        }, function (errorMessage) {
            console.error(errorMessage);
        }).catch(function (err) {
            console.error(err);
        });
    }
}).catch(function (err) { return console.error(err); });
//# sourceMappingURL=index.js.map