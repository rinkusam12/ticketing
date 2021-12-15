import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/orders";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("return an error if ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  return api
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("return an error if ticket is reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "Ticket",
  });

  await ticket.save();

  const order = Order.build({
    ticket: ticket,
    userId: "lasdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await api
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  await api
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("Published order created event", async () => {
  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await api
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
