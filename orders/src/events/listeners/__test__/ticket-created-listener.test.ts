import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@rinku12/new-common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  //create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  };

  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, msg, listener };
};

it("creates and saves a ticket", async () => {
  const { data, msg, listener } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  // call the onMessage function with the data object + message object
  // write assertions to make sure a ticket was created!
});
