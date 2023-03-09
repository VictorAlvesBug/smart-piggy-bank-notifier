# Notificador do smart-piggy-bank para o Whatsapp com Node.js

Sistema desenvolvido em **node.js**, responsável por notificar via **Whatsapp** 
(**[CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/)**)
quando uma **mensagem for publicada** no tópico MQTT do **smart-piggy-bank**

Para testar, é necessário primeiro enviar a mensagem 
**I allow callmebot to send me messages** para o [**WhatsApp do CallMeBot**](https://api.whatsapp.com/send?phone=34621342227&text=I%20allow%20callmebot%20to%20send%20me%20messages), para **habilitar** o recebimento de mensagens.

Após receber a mensagem "**CallMeBot API Activated for ...**", anote seu apikey
e execute o comando abaixo no **Terminal**, informando seu celular e sua apikey:

```bash
# Execute o notificador
$ node notifier.js --phone=<seu_celular> --apikey=<sua_apikey>
```

**Obs**: Informe o número do celular com **DDI** (Brasil: 55) e 
**DDD** (São Paulo: 11), 
ficando no seguinte formato: 5511912345678

Referências:
 - [Projeto smart-piggy-bank](https://github.com/VictorAlvesBug/smart-piggy-bank)
 - [API do CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
 - [Integração Interfone-Whatsapp](https://github.com/EijiTomonari/interfone-whatsapp)
