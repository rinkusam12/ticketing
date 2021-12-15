import {
  OrderCancelledEvent, OrderStatus
} from "@rinku12/new-common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listner = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId:'asdas',
    version:0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'asdas',
      price: 10,
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, data, msg, order };
};

it("updates the status of the order", async () => {
  const { listner, data, msg, order } = await setup();

  await listner.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listner, data, msg, order } = await setup();

  await listner.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
