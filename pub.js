const mqtt = require('mqtt');
const urlBroker = 'mqtt://broker.mqttdashboard.com';

const client = mqtt.connect(urlBroker, {
    port: 1883,
});

client.on('connect', function() {
    setInterval(function () {
        const strLetras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const indice = Math.floor(Math.random() * 26);
        const letraAleatoria = strLetras[indice];
        const mensagem = `A letra sorteada foi: ${letraAleatoria}`;

        client.publish('my-teste', mensagem);

        console.log(`Mensagem publicada com sucesso. Mensagem: "${mensagem}".`)
    }, 1000);
});