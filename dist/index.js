// import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
document.body.onload = () => {
    const HTML_READER_ELEMENT_ID = 'reader';
    const HTML_OUTPUT_ELEMENT_ID = 'output';
    const HTML_CAM_ELEMENT_ID = 'cam-change';
    const output_elem = document.getElementById(HTML_OUTPUT_ELEMENT_ID);
    const cam_elem = document.getElementById(HTML_CAM_ELEMENT_ID);
    var camId = '';
    var cameras = [];
    var currentCam = -1;
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            for (let device of devices) {
                cameras.push(device);
            }
            const html5QrCode = new Html5Qrcode(HTML_READER_ELEMENT_ID);
            cam_elem.onclick = () => {
                currentCam += 1;
                if (currentCam > cameras.length - 1) {
                    currentCam = 0;
                }
                camId = cameras[currentCam].id;
                var canContinue = true;
                if (html5QrCode.getState() == Html5QrcodeScannerState.SCANNING) {
                    canContinue = false;
                    html5QrCode.stop().then(() => {
                        canContinue = true;
                    }).catch((err) => {
                        console.error(err);
                    });
                }
                const startCode = () => {
                    if (!canContinue) {
                        setTimeout(() => startCode(), 150);
                        return;
                    }
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
                };
                startCode();
            };
            cam_elem.click();
        }
    }).catch(err => console.error(err));
};
