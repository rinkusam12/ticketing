import { OrderCreatedEvent, OrderStatus } from "@rinku12/new-common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listner = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "sda",
    userId: "dsaf",
    status: OrderStatus.Created,
    ticket: {
      id: "dsaf",
      price: 10,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, data, msg };
};

it("replicates the order info", async () => {
  const { listner, data, msg } = await setup();

  await listner.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listner, data, msg } = await setup();
  await listner.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
