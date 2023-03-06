const mqtt = require('mqtt');
const urlBroker = 'mqtt://broker.mqttdashboard.com';

const client = mqtt.connect(urlBroker, {
    port: 1883,
});

let numeroCelular = '';
let apiKey = '';

process.argv.forEach(function (chaveValor) {
    if(/^--phone=\d{13}$/.test(chaveValor)){
        numeroCelular = chaveValor.match(/^--phone=(\d{13})$/)[1];
    }
    
    if(/^--apikey=\d{4,12}$/.test(chaveValor)){
        apiKey = chaveValor.match(/^--apikey=(\d{4,12})$/)[1];
    }
});

client.on('connect', function() {
    client.subscribe('smart_piggy_bank/message');
    console.log('Inscrição do cliente realizada com sucesso');
});

client.on('message', function(topic, message) {
    console.log(`Mensagem recebida: "${message.toString()}"`);
    
    const paramUrlServidor = "https://api.callmebot.com/whatsapp.php?";
    const paramCelular = `phone=${numeroCelular}`;
    const paramMensagem = `&text=${message.toString()}`;
    const paramApiKey = `&apikey=${apiKey}`;

    const requestUrl = `${paramUrlServidor}${paramCelular}${paramMensagem}${paramApiKey}`;

    fetch(requestUrl)
});