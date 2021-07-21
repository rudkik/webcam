var  take_photo_btn = document.querySelector('#take-photo'),
    btn = document.querySelector('button[type=\'submit\']'),
    image = document.querySelector('#snap'),
    download_photo_btn = document.querySelector('#download-photo'),
    video = document.querySelector('#video');


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    var constraints = {
        video: {
            height: 720,
            width: 1080,
            facingMode: {
                exact: 'environment'
            },
        },
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
