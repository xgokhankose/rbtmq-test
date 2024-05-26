// send.js
// amqplib modülünden 'connect' fonksiyonunu içe aktar
import { connect } from "amqplib";

// Asenkron bir fonksiyon olan 'send'i tanımla
async function send() {
  // Kuyruk adı ve gönderilecek mesajı tanımla
  const queue = "hello";
  const message = "Hello World!";

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

    // Mesajı belirli kuyruğa gönder
    // Mesaj, Buffer.from kullanılarak bir Buffer nesnesine dönüştürülür
    channel.sendToQueue(queue, Buffer.from(message));
    // Mesajın başarıyla gönderildiğini konsola yazdır
    console.log(`[x] Sent ${message}`);

    // Bağlantıyı kapatmak için kısa bir süre bekle
    // Bu, mesajın tam olarak gönderildiğinden emin olmak içindir
    setTimeout(() => {
      connection.close(); // Bağlantıyı kapat
      process.exit(0);    // Programı sonlandır
    }, 500);
  } catch (error) {
    // Hata oluştuğunda hatayı konsola yazdır
    console.error("Error:", error);
  }
}

// 'send' fonksiyonunu çağırarak programı başlat
send();
