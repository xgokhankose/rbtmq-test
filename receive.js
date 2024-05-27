// amqplib modülünden 'connect' fonksiyonunu içe aktar
import { connect } from "amqplib";

// Asenkron bir fonksiyon olan 'receive'i tanımla
async function receive() {
  // Kuyruk adını tanımla
  const queue = "hello";

  try {
    // RabbitMQ sunucusuna bağlan
    const connection = await connect("amqp://localhost");
    // Bağlantı üzerinden bir kanal oluştur
    const channel = await connection.createChannel();

    // Belirtilen kuyruk adına sahip bir kuyruk oluştur (eğer yoksa)
    // durable: false, kuyruğun kalıcı olmadığını belirtir
    await channel.assertQueue(queue, {
      durable: false,
    });

    // Mesaj bekleniyor olduğunu konsola yazdır
    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    // Kuyruktan mesajları tüket
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        // Mesaj alındığında konsola yazdır
        console.log(`[x] Received ${msg.content.toString()}`);
        // Mesajı kabul et (acknowledge)
        channel.ack(msg);
      }
    });
  } catch (error) {
    // Hata oluştuğunda hatayı konsola yazdır
    console.error("Error:", error);
  }
}

// 'receive' fonksiyonunu çağırarak programı başlat
receive();
