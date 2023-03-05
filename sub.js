const mqtt = require('mqtt');
const urlBroker = 'mqtt://broker.mqttdashboard.com';

const client = mqtt.connect(urlBroker, {
    port: 1883,
});

client.on('connect', function() {
    client.subscribe('my-teste');
    console.log('Inscrição do cliente realizada com sucesso');
});

client.on('message', function(topic, message) {
    console.log(`Mensagem recebida: "${message.toString()}"`);
});