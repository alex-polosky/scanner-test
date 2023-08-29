// import { Html5Qrcode } from "html5-qrcode";
document.body.onload = () => {
    const HTML_READER_ELEMENT_ID = 'reader';
    const HTML_OUTPUT_ELEMENT_ID = 'output';
    const output_elem = document.getElementById(HTML_OUTPUT_ELEMENT_ID);
    var camId = '';
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            camId = devices[0].id;
            const html5QrCode = new Html5Qrcode(HTML_READER_ELEMENT_ID);
            html5QrCode.start(camId, {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            }, (decodedText, decodedResult) => {
                // console.log(decodedText);
                output_elem.value = decodedText;
            }, (errorMessage) => {
                if (errorMessage.indexOf('No MultiFormat Readers were able to detect the code.') < 0) {
                    console.error(errorMessage);
                }
            }).catch((err) => {
                console.error(err);
            });
        }
    }).catch(err => console.error(err));
};
//# sourceMappingURL=index.js.map