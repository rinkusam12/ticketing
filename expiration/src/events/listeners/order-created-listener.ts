import { Listener, OrderCreatedEvent, OrderStatus } from "@rinku12/new-common";
import { Subjects } from "@rinku12/new-common/build/events/subjects";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting this many seconds to process the job:`, delay);
      
    await expirationQueue.add({ orderId: data.id }, {
        delay,
    });
    msg.ack();
  }
}
 