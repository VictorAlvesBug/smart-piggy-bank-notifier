const mqtt = require('mqtt');

const fetch = require('node-fetch');
globalThis.fetch = fetch;

main();

function main() {
  const { phone, apikey } = recuperarParametros();

  if (phone && apikey) {
    const urlBroker = 'mqtt://broker.mqttdashboard.com:1883';

    // Tópico de Mensagem WhatsApp
    inscreverTopico({
      urlBroker,
      nomeTopico: 'smart_piggy_bank/mensagem',
      callback: (message) => {
        enviarMensagemWhatsapp(phone, apikey, message)
          .then((result) => {
            if (result.status === 200) {
              return console.log(`Mensagem enviada: "${message}".`);
            }

            console.log(
              `Mensagem não enviada. Favor verificar se o número de celular e apikey estão corretos.`
            );
          })
          .catch((err) => {
            console.log(`Erro: ${err}`);
          });
      },
    });

    // Tópico de Meta Alterada
    inscreverTopico({
      urlBroker,
      nomeTopico: 'smart_piggy_bank/meta_alterada',
      callback: (valor) => {
        notificarTagoIo('meta_principal', valor);
      },
    });

    // Tópico de Valor Guardado Alterado
    inscreverTopico({
      urlBroker,
      nomeTopico: 'smart_piggy_bank/valor_guardado',
      callback: (valor) => {
        notificarTagoIo('valor_guardado', valor);
      },
    });
  }
}

function recuperarParametros() {
  const parametros = {
    phone: {
      regex: /^--phone=(\d{9,15})$/,
      value: null,
      requiredErrorMessage:
        'Erro: Informe o parâmetro --phone=<seu_celular> no formato (DDI)(DDD)(SEU_NUMERO).',
    },
    apikey: {
      regex: /^--apikey=(\d{4,12})$/,
      value: null,
      requiredErrorMessage: `Erro: Informe o parâmetro --apikey=<sua_apikey>. Caso não possua uma apikey, clique em https://api.whatsapp.com/send?phone=34621342227&text=I%20allow%20callmebot%20to%20send%20me%20messages e envie a mensagem "I allow callmebot to send me messages".`,
    },
  };

  process.argv.forEach(function (chaveValor) {
    Object.values(parametros).forEach((parametro) => {
      if (parametro.regex.test(chaveValor)) {
        parametro.value = chaveValor.match(parametro.regex)[1];
      }
    });
  });

  Object.values(parametros).forEach((parametro) => {
    if (!parametro.value) {
      console.log(parametro.requiredErrorMessage);
    }
  });

  const retorno = {};

  Object.entries(parametros).forEach(([nomeParametro, parametro]) => {
    retorno[nomeParametro] = parametro.value;
  });

  return retorno;
}

function inscreverTopico({ urlBroker, nomeTopico, callback }) {
  const client = mqtt.connect(urlBroker);

  client.on('connect', function () {
    client.subscribe(nomeTopico);
    console.log('Inscrição do cliente realizada com sucesso.');
    console.log(`Aguardando por atualizações do tópico "${nomeTopico}"...`);
  });

  client.on('message', function (topic, message) {
    if (topic === nomeTopico) {
      const mensagem = message.toString();
      callback(mensagem);
    }
  });
}

function enviarMensagemWhatsapp(phone, apikey, message) {
  return new Promise((resolve, reject) => {
    const paramUrlServidor = 'https://api.callmebot.com/whatsapp.php?';
    const paramCelular = `phone=${phone}`;
    const paramMensagem = `&text=${message}`;
    const paramApiKey = `&apikey=${apikey}`;

    const requestUrl = `${paramUrlServidor}${paramCelular}${paramMensagem}${paramApiKey}`;

    fetch(requestUrl)
      .then((retorno) => resolve(retorno))
      .catch((err) => reject(err));
  });
}

function notificarTagoIo(nomeVariavel, valorVariavel) {
  const urlBrokerTagoIo = 'mqtt.tago.io';

  const clientTagoIo = mqtt.connect({
    host: urlBrokerTagoIo,
    port: 1883,
    username: 'SmartPiggyBankDevice',
    password: 'b026c8d3-ac69-498f-acbf-338bcc7ea136',
  });

  const payload = {
    variable: nomeVariavel,
    value: valorVariavel,
  };

  clientTagoIo.publish('tago/data/post', JSON.stringify(payload));
}
