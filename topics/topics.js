#!/usr/bin/env node

import { connect } from 'amqplib';

async function publishMessage() {
    try {
        // Connect to RabbitMQ server
        const connection = await connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'topic_logs';
        const args = process.argv.slice(2);
        const key = (args.length > 0) ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || 'Hello World!';

        // Declare exchange
        await channel.assertExchange(exchange, 'topic', { durable: false });

        // Publish message to exchange
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);

        // Close the connection after a short delay to ensure message is sent
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