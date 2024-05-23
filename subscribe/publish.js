import { connect } from "amqplib";

connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
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
});

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
