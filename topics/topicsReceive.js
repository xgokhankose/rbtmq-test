import { connect } from 'amqplib';

// Komut satırından alınan argümanları değişkene ata
const args = process.argv.slice(2);

// Eğer argümanlar boşsa, kullanım bilgisini yazdır ve çık
if (args.length === 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

async function receiveLogs() {
    try {
        // RabbitMQ sunucusuna bağlan
        const connection = await connect('amqp://localhost');
        // Bir kanal oluştur
        const channel = await connection.createChannel();

        const exchange = 'topic_logs';

        // Exchange oluştur
        await channel.assertExchange(exchange, 'topic', { durable: false });

        // Geçici bir kuyruk oluştur
        const q = await channel.assertQueue('', { exclusive: true });

        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        // Kuyruğu verilen routing key'ler ile exchange'e bağla
        for (const key of args) {
            await channel.bindQueue(q.queue, exchange, key);
        }

        // Kuyruktan mesajları tüket
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