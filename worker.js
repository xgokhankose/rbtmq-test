import { connect } from "amqplib";

// receive.js

async function receive() {
  var queue = "task_queue";

  try {
    const connection = await connect("amqp://localhost");
    const channel = await connection.createChannel();

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      function (msg) {
        var secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(function () {
          console.log(" [x] Done");
        }, secs * 1000);
      },
      {
        // automatic acknowledgment mode,
        // see /docs/confirms for details
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

receive();
