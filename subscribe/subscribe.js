import { connect } from 'amqplib';

async function subscribeMessage() {
    try {
        // Connect to RabbitMQ server
        const connection = await connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'logs';

        // Declare exchange
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // Declare a queue
        const q = await channel.assertQueue('', { exclusive: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

        // Bind queue to exchange
        await channel.bindQueue(q.queue, exchange, '');

        // Consume messages from the queue
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





