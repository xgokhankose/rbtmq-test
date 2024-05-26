// amqplib modülünden 'connect' fonksiyonunu içe aktar
import { connect } from "amqplib";

// Komut satırı argümanlarından gelen mesajı al
var msg = process.argv.slice(2).join(" ") || "Hello World!";

// Asenkron bir fonksiyon olan 'queue'u tanımla
async function queue() {
  // Kuyruk adını tanımla
  var queue = "task_queue";

  try {
    // RabbitMQ sunucusuna bağlan
    const connection = await connect("amqp://localhost");
    // Bağlantı üzerinden bir kanal oluştur
    const channel = await connection.createChannel();

    // Belirtilen kuyruk adına sahip bir kuyruk oluştur (eğer yoksa)
    // durable: true, kuyruğun kalıcı olduğunu belirtir
    channel.assertQueue(queue, {
      durable: true,
    });

    // Kuyruğa mesaj gönder
    // persistent: true, mesajın kalıcı olduğunu belirtir
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });

    // Mesajın gönderildiğini konsola yazdır
    console.log(" [x] Sent '%s'", msg);
  } catch (error) {
    // Hata oluştuğunda hatayı konsola yazdır
    console.error("Error:", error);
  }
}

// 'queue' fonksiyonunu çağırarak programı başlat
queue();
