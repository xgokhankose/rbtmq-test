// send.js
import { connect } from "amqplib";

async function send() {
  const queue = "hello";
  const message = "Hello World!";

  try {
    const connection = await connect("amqp://localhost");
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

send();
