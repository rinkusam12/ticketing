import { ExpirationCompleteEvent } from "@rinku12/new-common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../../models/orders";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asdas",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  const data: ExpirationCompleteEvent['data'] = {
      orderId: order.id
  }

  //@ts-ignore
  const msg:Message = {
      ack: jest.fn()
  }

  return { listener, ticket, data, order, msg };
};


it('updates the order status to cancelled', async () => {
    const { listener, ticket, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
});

it('emits an order cancelled event', async () => {
    const { listener, ticket, data, order, msg } = await setup();

    await listener.onMessage(data, msg);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData =  JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, ticket, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});