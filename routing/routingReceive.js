#!/usr/bin/env node

import { connect } from 'amqplib';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

async function receiveLogs() {
    try {
        // RabbitMQ sunucusuna bağlan
        const connection = await connect('amqp://localhost');
        // Bir kanal oluştur
        const channel = await connection.createChannel();

        const exchange = 'direct_logs';

        // Exchange'i tanımla
        await channel.assertExchange(exchange, 'direct', { durable: false });

        // Geçici bir kuyruk tanımla
        const q = await channel.assertQueue('', { exclusive: true });

        console.log(' [*] Logları bekliyor. Çıkmak için CTRL+C tuşlayın');

        // Kuyruğu belirtilen severity seviyeleriyle exchange'e bağla
        args.forEach(function(severity) {
          channel.bindQueue(q.queue, exchange, severity);
        });

        // Kuyruktan mesajları tüket
        channel.consume(q.queue, (msg) => {
            console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
        }, { noAck: true });

    } catch (error) {
        console.error('Error:', error);
    }
}

receiveLogs();




/* import { connect } from "amqplib";


var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'direct_logs';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
      }, function(error2, q) {
        if (error2) {
          throw error2;
        }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function(severity) {
        channel.bindQueue(q.queue, exchange, severity);
      });

      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
}); */