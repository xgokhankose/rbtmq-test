import { connect } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}

async function fibonacciRpc(num) {
    try {
        // RabbitMQ sunucusuna bağlan
        const connection = await connect('amqp://localhost');
        // Kanal oluştur
        const channel = await connection.createChannel();

        // Geçici bir cevap kuyruğu oluştur
        const replyQueue = await channel.assertQueue('', { exclusive: true });
        const correlationId = uuidv4();

        console.log(' [x] Requesting fib(%d)', num);

        // Cevap kuyruğunda bir tüketici ayarla
        channel.consume(replyQueue.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
                console.log(' [.] Got %s', msg.content.toString());
                setTimeout(() => {
                    connection.close();
                    process.exit(0);
                }, 500);
            }
        }, { noAck: true });

        // RPC isteği gönder
        channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
            correlationId: correlationId,
            replyTo: replyQueue.queue,
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

const num = parseInt(args[0], 10);
fibonacciRpc(num);



/* import { connect } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

async function fibonacciRpc(n) {
    try {
        const connection = await connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queue = 'rpc_queue';
        const replyQueue = await channel.assertQueue('', { exclusive: true });

        const correlationId = uuidv4();

        channel.consume(replyQueue.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
                console.log(' [.] Got %s', msg.content.toString());
                setTimeout(() => {
                    connection.close();
                    process.exit(0);
                }, 500);
            }
        }, { noAck: true });

        channel.sendToQueue(queue, Buffer.from(n.toString()), {
            correlationId,
            replyTo: replyQueue.queue,
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

const num = parseInt(process.argv[2], 10) || 10;
console.log(' [x] Requesting fib(%d)', num);
fibonacciRpc(num);
 */

/* import { connect } from "amqplib";

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
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
    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        var correlationId = generateUuid();
        var num = parseInt(args[0]);

        console.log(" [x] Requesting fib(%d)", num);

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.properties.correlationId == correlationId) {
              console.log(" [.] Got %s", msg.content.toString());
              setTimeout(function () {
                connection.close();
                process.exit(0);
              }, 500);
            }
          },
          {
            noAck: true,
          }
        );

        channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
          correlationId: correlationId,
          replyTo: q.queue,
        });
      }
    );
  });
});

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
 */