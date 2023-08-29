import { CameraDevice, Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

type CodeItem = {
    ai: string;
    title: string;
    data: string;
    unit: string
};
declare function parseBarcode(s: string): {
    codeName: string;
    parsedCodeItems: CodeItem[];
}


document.body.onload = () => {
    const HTML_READER_ELEMENT_ID = 'reader';
    const HTML_OUTPUT_ELEMENT_ID = 'output';
    const HTML_CAM_ELEMENT_ID = 'cam-change'

    const output_elem: HTMLInputElement = document.getElementById(HTML_OUTPUT_ELEMENT_ID) as HTMLInputElement;
    const cam_elem: HTMLButtonElement = document.getElementById(HTML_CAM_ELEMENT_ID) as HTMLButtonElement;

    var camId = '';
    var cameras: CameraDevice[] = [];
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
                    html5QrCode.stop().then(
                        () => {
                            canContinue = true;
                        }
                    ).catch(
                        (err) => {
                            console.error(err);
                        }
                    );
                }

                const startCode = () => {
                    if (!canContinue) {
                        setTimeout(() => startCode(), 150);
                        return;
                    }
                    html5QrCode.start(
                        camId,
                        {
                            fps: 10,
                            qrbox: {width: 250, height: 250}
                        },
                        (decodedText, decodedResult) => {
                            const markCode = '\u001d';
                            while (decodedText.indexOf(markCode) > -1) {
                                decodedText = decodedText.replace(markCode, '');
                            }

                            const data = parseBarcode(decodedText);
                            console.log(data);

                            var out = '';
                            const codeItems: CodeItem[] = data.parsedCodeItems;
                            for (let each of codeItems) {
                                out += each.ai + ': ' + each.data + ';';
                            }
                            output_elem.value = out;
                        },
                        (errorMessage) => {
                            if (errorMessage.indexOf('No MultiFormat Readers were able to detect the code.') < 0) {
                                console.error(errorMessage);
                            }
                        }
                    ).catch((err) => {
                        console.error(err);
                    });
                }
                startCode();
            }

            cam_elem.click();

        }
    }).catch(err => console.error(err));
}

