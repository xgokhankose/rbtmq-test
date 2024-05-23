import { connect } from "amqplib";

var msg = process.argv.slice(2).join(" ") || "Hello World!";

async function queue() {
  var queue = "task_queue";

  try {
    const connection = await connect("amqp://localhost");
    const channel = await connection.createChannel();

    channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
    console.log(" [x] Sent '%s'", msg);
  } catch (error) {
    console.error("Error:", error);
  }
}

queue();

