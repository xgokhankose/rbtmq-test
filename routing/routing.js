#!/usr/bin/env node

import { connect } from 'amqplib';

async function publishMessage() {
    try {
        // Connect to RabbitMQ server
        const connection = await connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'direct_logs';
        const args = process.argv.slice(2);
        const msg = args.slice(1).join(' ') || 'Hello World!';
        const severity = (args.length > 0) ? args[0] : 'info';

        // Declare exchange
        await channel.assertExchange(exchange, 'direct', { durable: false });

        // Publish message to exchange
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);

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
    var exchange = 'direct_logs';
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(' ') || 'Hello World!';
    var severity = (args.length > 0) ? args[0] : 'info';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
}); */