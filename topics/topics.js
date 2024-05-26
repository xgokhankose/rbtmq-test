#!/usr/bin/env node

import { connect } from 'amqplib';

async function publishMessage() {
    try {
        // RabbitMQ sunucusuna bağlan
        const connection = await connect('amqp://localhost');
        // Bir kanal oluştur
        const channel = await connection.createChannel();

        const exchange = 'topic_logs';
        const args = process.argv.slice(2);
        const key = (args.length > 0) ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || 'Hello World!';

        // Exchange'i tanımla
        await channel.assertExchange(exchange, 'topic', { durable: false });

        // Mesajı exchange'e yayınla
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);

        // Mesajın gönderildiğinden emin olmak için kısa bir gecikme sonrası bağlantıyı kapat
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error('Error:', error);
    }
}

publishMessage();



/* import { connect } from "amqplib";

connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'topic_logs';
    var args = process.argv.slice(2);
    var key = (args.length > 0) ? args[0] : 'anonymous.info';
    var msg = args.slice(1).join(' ') || 'Hello World!';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s:'%s'", key, msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
}); */