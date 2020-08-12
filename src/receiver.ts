import amqp from "amqplib/callback_api";

amqp.connect('amqp://localhost', (connError, connection) => {

  if (connError) {
    throw connError;
  }

  connection.createChannel((chError, channel) => {

    if (chError) {
      throw chError;
    }

    let queue = 'test_queue';

    channel.assertQueue(queue, {
      durable: true
    });

    channel.prefetch(1);

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(
         queue,
         (msg) => {
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
              console.log(" [x] Done");
            }, secs * 1000);
         }, 
         {noAck: false}
         );
  });
});
