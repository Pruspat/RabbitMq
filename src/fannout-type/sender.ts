import amqp from "amqplib/callback_api";

amqp.connect('amqp://localhost', (connError, connection) => {

    if (connError) {
      throw connError;
    }
  
    connection.createChannel( (chError, channel) => {
  
      if (chError) {
        throw chError;
      }
  
      let exchange = 'logs';
      let msg = process.argv.slice(2).join(' ') || "DEFAULT MSG!";

    channel.assertExchange(exchange, 'fanout', {
        durable: false
      });

      channel.publish(exchange, '', Buffer.from(msg));
      console.log(" [x] Sent %s", msg);

    });

    setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
  });
  