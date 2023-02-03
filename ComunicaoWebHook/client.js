const WebSocket = require('ws');
let clients = [
    new WebSocket('ws://localhost:8080'),
    new WebSocket('ws://localhost:8080')
];

async function teste() {
    clients.map(client => {
        client.on('message', msg => console.log(msg.toString()));
    });

    // Esperamos o cliente conectar com o servidor usando async/await
    await new Promise(resolve => clients[0].once('open', resolve));

    // Imprimi "Hello!" duas vezes, um para cada cliente
    setInterval(() => {
        clients[0].send('Hello!');
    }, 2000)
}

teste()