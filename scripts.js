const firebaseConfig = {
    apiKey: "<Quando eu terminar de fazer isto ja vai esta privado!>",
    authDomain: "<YOUR_FIREBASE_AUTH_DOMAIN>",
    projectId: "<YOUR_FIREBASE_PROJECT_ID>",
    storageBucket: "<YOUR_FIREBASE_STORAGE_BUCKET>",
    messagingSenderId: "<YOUR_FIREBASE_MESSAGING_SENDER_ID>",
    appId: "<YOUR_FIREBASE_APP_ID>",
    databaseURL: "<YOUR_FIREBASE_DATABASE_URL>"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();

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
