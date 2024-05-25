import { connect } from 'amqplib';

async function startServer() {
    try {
        const connection = await connect('amqp://localhost');
        const channel = await connection.createChannel();
        
        const queue = 'rpc_queue';

        await channel.assertQueue(queue, { durable: false });
        channel.prefetch(1);
        console.log(" [x] Awaiting RPC requests");

        channel.consume(queue, async (msg) => {
            const n = parseInt(msg.content.toString());
            console.log(" [.] fib(%d)", n);

            const r = fibonacci(n);

            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(r.toString()),
                { correlationId: msg.properties.correlationId }
            );

            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function fibonacci(n) {
    if (n == 0 || n == 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

startServer();
