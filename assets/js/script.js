var  take_photo_btn = document.querySelector('#take-photo'),
     btn = document.querySelector('button[type=\'submit\']'),
     image = document.querySelector('#snap'),
     download_photo_btn = document.querySelector('#download-photo'),
     video = document.querySelector('#video');


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    var constraints = {
        video: { facingMode: { exact: "environment" } }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
        })
        .catch(function(err) {
            console.log (err);
        });
}
else {
    console.log ("navigator.mediaDevices not supported")
}

    take_photo_btn.addEventListener("click", function(e){

        e.preventDefault();

        var snap = takeSnapshot();

        // Show image.
        image.setAttribute('src', snap);
        document.querySelector('#username').setAttribute('value', snap);

        // Pause video playback of stream.
        video.pause();
        setTimeout(btn.click(), 1000);
    });

    function takeSnapshot(){
        // Here we're using a trick that involves a hidden canvas element.

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        var width = video.videoWidth,
            height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return hidden_canvas.toDataURL('image/png');
        }
    }



var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

getStream().then(getDevices).then(gotDevices);

function getDevices() {
    // AFAICT in Safari this only gets default devices until gUM is called :/
    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
    window.deviceInfos = deviceInfos; // make available to console
    console.log('Available input and output devices:', deviceInfos);
    for (const deviceInfo of deviceInfos) {
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
            audioSelect.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        }
    }
}

function getStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioSelect.value;
    const videoSource = videoSelect.value;
    const constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
    window.stream = stream; // make stream available to console
    audioSelect.selectedIndex = [...audioSelect.options].
    findIndex(option => option.text === stream.getAudioTracks()[0].label);
    videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
    videoElement.srcObject = stream;
}

function handleError(error) {
    console.error('Error: ', error);
}
