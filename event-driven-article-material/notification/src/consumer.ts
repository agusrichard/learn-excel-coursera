import amqp, { Message } from 'amqplib/callback_api'

const createMQConsumer = (amqpURl: string, queueName: string) => {
  console.log('Connecting to RabbitMQ...')
  return () => {
    amqp.connect(amqpURl, (errConn, conn) => {
      if (errConn) {
        throw errConn
      }

      conn.createChannel((errChan, chan) => {
        if (errChan) {
          throw errChan
        }

        console.log('Connected to RabbitMQ')
        chan.assertQueue(queueName, { durable: true })
        chan.consume(queueName, (msg: Message | null) => {
          if (msg) {
            const parsed = JSON.parse(msg.content.toString())
            switch (parsed.action) {
              case 'CREATE':
                console.log('CREATE', parsed.data)
                break
              case 'UPDATE':
                console.log('UPDATE', parsed.data)
                break
              case 'DELETE':
                console.log('DELETE', parsed.data)
                break
              default:
                break
            }
          }
        }, { noAck: true })
      })
    })
  }
}

export default createMQConsumer
