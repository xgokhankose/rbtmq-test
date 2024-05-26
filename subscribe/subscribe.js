import { connect } from 'amqplib';

async function subscribeMessage() {
    try {
        // RabbitMQ sunucusuna bağlan
        const connection = await connect('amqp://localhost');
        // Kanal oluştur
        const channel = await connection.createChannel();

        const exchange = 'logs';

        // Exchange tanımla
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Geçici bir kuyruk tanımla
        const q = await channel.assertQueue('', { exclusive: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

        // Kuyruğu exchange'e bağla
        await channel.bindQueue(q.queue, exchange, '');

        // Kuyruktan mesajları tüket
        channel.consume(q.queue, (msg) => {
            if (msg.content) {
                console.log(" [x] %s", msg.content.toString());
            }
        }, { noAck: true });
    } catch (error) {
        console.error('Error:', error);
    }
}

subscribeMessage();
