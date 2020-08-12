import amqp from "amqplib/callback_api";

amqp.connect('amqp://localhost', (connError, connection) => {

    if (connError) {
      throw connError;
    }
  
    connection.createChannel( (chError, channel) => {
  
      if (chError) {
        throw chError;
      }
  
      let queue = 'test_queue';
      let msg = process.argv.slice(2).join(' ') || "TEST DEFAULT MSG!";
  
      channel.assertQueue(queue, {
        durable: true
      });
  
      channel.sendToQueue(
          queue, 
          Buffer.from(msg), 
          {persistent: true}
          );

      console.log(` [x] Sent, ${msg} , into ${queue} queue.`);

    });

    setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
  });
  