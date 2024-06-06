document.getElementById('videoUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.src = URL.createObjectURL(file);
        videoPlayer.load();
        videoPlayer.play();
    }
});
