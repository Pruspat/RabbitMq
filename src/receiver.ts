import amqp from "amqplib/callback_api";

// amqp.connect('amqp://localhost', (connError, connection) => {

//   if (connError) {
//     throw connError;
//   }

//   connection.createChannel((chError, channel) => {

//     if (chError) {
//       throw chError;
//     }

//     let queue = 'test_queue';

//     channel.assertQueue(queue, {
//       durable: true
//     });

//     channel.prefetch(1);

//     console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

//     channel.consume(
//          queue,
//          (msg) => {
//             var secs = msg.content.toString().split('.').length - 1;

//             console.log(" [x] Received %s", msg.content.toString());
//             setTimeout(function() {
//               console.log(" [x] Done");
//             }, secs * 1000);
//          }, 
//          {noAck: false}
//          );
//   });
// });


amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'logs';

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, function(msg) {
        if(msg.content) {
            console.log(" [x] %s", msg.content.toString());
          }
      }, {
        noAck: true
      });
    });
  });
});