// amqplib modülünden 'connect' fonksiyonunu içe aktar
import { connect } from "amqplib";

async function receive() {
  // Kullanılacak kuyruk adını tanımla
  var queue = "task_queue";

  try {
    // RabbitMQ sunucusuna bağlan
    const connection = await connect("amqp://localhost");
    // Bağlantı üzerinden bir kanal oluştur
    const channel = await connection.createChannel();

    // Belirtilen kuyruk adına sahip bir kuyruk oluştur (eğer yoksa)
    // durable: true, kuyruğun kalıcı olduğunu belirtir
    await channel.assertQueue(queue, {
      durable: true,
    });

    // Kuyruktan mesajları tüket
    channel.consume(
      queue,
      function (msg) {
        // Mesajın içerdiği noktaları say ve bu sayıyı 'secs' değişkenine ata
        var secs = msg.content.toString().split(".").length - 1;

        // Mesajın alındığını konsola yazdır
        console.log(" [x] Received %s", msg.content.toString());

        // Mesajın işlenmesinin tamamlandığını belirli bir süre sonra bildir
        setTimeout(function () {
          console.log(" [x] Done");
        }, secs * 1000);
      },
      {
        // Otomatik onaylama modu
        // noAck: true, mesajların alındığını otomatik olarak onaylar
        noAck: true,
      }
    );
  } catch (error) {
    // Hata oluştuğunda hatayı konsola yazdır
    console.error("Error:", error);
  }
}

// 'receive' fonksiyonunu çağırarak programı başlat
receive();
