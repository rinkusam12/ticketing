import { TicketUpdatedEvent } from "@rinku12/new-common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  //Create and save a ticket
  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  //create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "new concert",
    price: 999,
    userId: new Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, msg, listener, ticket };
};

it("finds, updates, and saves a ticket", async () => {
  const { data, msg, listener, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { data, msg, listener, ticket } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
  // call the onMessage function with the data object + message object
  // write assertions to make sure a ticket was created!
});

it("does not call ack if event has a skipped version number", async () => {
  const { data, msg, listener, ticket } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
