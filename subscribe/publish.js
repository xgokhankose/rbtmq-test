/* import { connect } from 'amqplib';

async function publishMessage() {
    try {
        // Connect to RabbitMQ server
        const connection = await connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'logs';
        const msg = 'Hello World!';

        // Declare exchange
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Publish message to exchange
        channel.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

        // Close the connection after a short delay to ensure message is sent
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error:', error);
    }
}

publishMessage(); */


import { connect } from 'amqplib';

async function publishMessage() {
    try {
        // Connect to RabbitMQ server
        const connection = await connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'logs';
        const msg = process.argv.slice(2).join(' ') || 'Hello World!';

        // Declare exchange
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Publish message to exchange
        channel.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

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



/* function publish() {
  console.log("girdi1");
  connect("amqp://localhost", function (error0, connection) {
    console.log("girdi10");

    if (error0) {
      console.log("error0", error0);

      throw error0;
    }
    console.log("girdi2");

    connection.createChannel(function (error1, channel) {
      console.log("girdi3");

      if (error1) {
        throw error1;
      }
      console.log("girdi4");

      var exchange = "logs";
      var msg = process.argv.slice(2).join(" ") || "Hello World!";

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });
      channel.publish(exchange, "", Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  }); */

////

/*  const queue = "hello";
  const message = "Hello World!";

  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`[x] Sent ${message}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error:", error);
  } 
}

publish();
*/
