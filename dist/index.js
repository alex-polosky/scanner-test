import { Html5Qrcode } from "html5-qrcode";
const HTML_ELEMENT_ID = 'reader';
var camId = '';
Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
        camId = devices[0].id;
        const html5QrCode = new Html5Qrcode(HTML_ELEMENT_ID);
        html5QrCode.start(camId, {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        }, (decodedText, decodedResult) => {
            console.log(decodedText);
        }, (errorMessage) => {
            console.error(errorMessage);
        }).catch((err) => {
            console.error(err);
        });
    }
}).catch(err => console.error(err));
//# sourceMappingURL=index.js.map