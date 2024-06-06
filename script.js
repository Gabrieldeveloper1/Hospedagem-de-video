let username = "";
let localStream = null;
let mediaRecorder = null;
let audioChunks = [];

function enterChat() {
    const usernameInput = document.getElementById("usernameInput");
    username = usernameInput.value.trim();
    if (username !== "") {
        document.getElementById("authSection").style.display = "none";
        document.getElementById("chatSection").style.display = "block";
        showMessage("Bem-vindo ao chat, " + username + "!");
    } else {
        alert("Por favor, insira um nome de usuário válido.");
    }
}

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    if (message !== "") {
        showMessage("<strong>" + username + ":</strong> " + message);
        messageInput.value = "";
    }
}

function sendImage() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];
    if (file) {
        // Envie o arquivo para o servidor ou manipule de acordo com sua necessidade
        showMessage("<strong>" + username + ":</strong> <img src='" + URL.createObjectURL(file) + "'/>");
    } else {
        console.error("Nenhuma imagem selecionada.");
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            localStream = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start();
        })
        .catch((error) => {
            console.error("Erro ao acessar o microfone:", error);
        });
}

function handleDataAvailable(event) {
    audioChunks.push(event.data);
}

function sendAudio() {
    if (mediaRecorder && localStream) {
        mediaRecorder.stop();
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        showMessage("<strong>" + username + ":</strong> <audio controls src='" + URL.createObjectURL(blob) + "'></audio>");
        audioChunks = [];
    } else {
        console.error("Nenhuma gravação de áudio disponível.");
    }
}

function logout() {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("chatSection").style.display = "none";
    showMessage(username + " saiu do chat.");
    username = "";

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    if (mediaRecorder) {
        mediaRecorder = null;
    }
    audioChunks = [];
}

function showMessage(message) {
    const messages = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = message;
    messages.appendChild(messageElement);
}
