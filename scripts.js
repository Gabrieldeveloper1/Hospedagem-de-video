const firebaseConfig = {
  apiKey: "AIzaSyDWJEnY187JF283iHKJa-K40ecK_4pcXwE",
  authDomain: "hellohosting-video.firebaseapp.com",
  databaseURL: "https://hellohosting-video-default-rtdb.firebaseio.com",
  projectId: "hellohosting-video",
  storageBucket: "hellohosting-video.appspot.com",
  messagingSenderId: "248239237943",
  appId: "1:248239237943:web:12a609b9d035badc4ec8b2",
  measurementId: "G-SNYZZFCDXB"
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
