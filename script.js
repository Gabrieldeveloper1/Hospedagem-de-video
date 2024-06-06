document.getElementById('uploadButton').addEventListener('click', () => {
    const file = document.getElementById('videoUpload').files[0];
    if (file) {
        const storageRef = storage.ref('videos/' + file.name);
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.getElementById('statusMessage').innerText = 'Upload está ' + progress + '% concluído';
            }, 
            (error) => {
                console.error(error);
                document.getElementById('statusMessage').innerText = 'Erro ao enviar o vídeo';
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    const newVideoKey = database.ref().child('videos').push().key;
                    const videoData = {
                        url: downloadURL,
                        name: file.name
                    };
                    const updates = {};
                    updates['/videos/' + newVideoKey] = videoData;
                    database.ref().update(updates).then(() => {
                        document.getElementById('statusMessage').innerText = 'Vídeo enviado com sucesso! Acesse: ' + window.location.origin + '/video.html?id=' + newVideoKey;
                    });
                });
            }
        );
    } else {
        document.getElementById('statusMessage').innerText = 'Selecione um vídeo primeiro';
    }
});
