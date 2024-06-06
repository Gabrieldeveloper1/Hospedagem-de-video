document.addEventListener('DOMContentLoaded', () => {
    // Lógica do cliente
    const socket = io('http://localhost:3000');

    // Receber mensagem do servidor
    socket.on('receiveMessage', (message) => {
        showMessage(message);
    });

    // Enviar mensagem
    function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        if (message !== '') {
            // Aqui você pode enviar a mensagem para o servidor
            showMessage(`<strong>Você:</strong> ${message}`);
            socket.emit('sendMessage', message);
            messageInput.value = '';
        }
    }

    // Mostrar mensagem na lista de mensagens
    function showMessage(message) {
        const messageList = document.getElementById('messageList');
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = message;
        messageList.appendChild(div);
        messageList.scrollTop = messageList.scrollHeight;
    }
});
