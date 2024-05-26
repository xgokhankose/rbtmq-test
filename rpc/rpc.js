import { connect } from 'amqplib';

async function startServer() {
    try {
        // RabbitMQ sunucusuna bağlan
        const connection = await connect('amqp://localhost');
        // Kanal oluştur
        const channel = await connection.createChannel();
        
        const queue = 'rpc_queue';

        // Kuyruk tanımla
        await channel.assertQueue(queue, { durable: false });
        channel.prefetch(1);
        console.log(" [x] Awaiting RPC requests");

        // Kuyruktan mesajları tüket
        channel.consume(queue, async (msg) => {
            const n = parseInt(msg.content.toString());
            console.log(" [.] fib(%d)", n);

            const r = fibonacci(n);

            // Sonucu cevap kuyruğuna gönder
            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(r.toString()),
                { correlationId: msg.properties.correlationId }
            );

            // Mesajı onayla
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
