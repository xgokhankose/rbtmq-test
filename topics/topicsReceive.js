#!/usr/bin/env node

import { connect } from 'amqplib';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

async function receiveLogs() {
    try {
        // Connect to RabbitMQ server
        const connection = await connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'topic_logs';

        // Declare exchange
        await channel.assertExchange(exchange, 'topic', { durable: false });

        // Declare a temporary queue
        const q = await channel.assertQueue('', { exclusive: true });

        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        // Bind the queue to the exchange with the given routing keys
        for (const key of args) {
            await channel.bindQueue(q.queue, exchange, key);
        }

        // Consume messages from the queue
        channel.consume(q.queue, (msg) => {
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
        }, { noAck: true });

    } catch (error) {
        console.error('Error:', error);
    }
}

receiveLogs();


/* import { connect } from "amqplib";

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = "topic_logs";

    channel.assertExchange(exchange, "topic", {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(" [*] Waiting for logs. To exit press CTRL+C");

        args.forEach(function (key) {
          channel.bindQueue(q.queue, exchange, key);
        });

        channel.consume(
          q.queue,
          function (msg) {
            console.log(
              " [x] %s:'%s'",
              msg.fields.routingKey,
              msg.content.toString()
            );
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
 */