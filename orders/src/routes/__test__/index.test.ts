import { Types } from "mongoose";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  //Create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = signin();
  const userTwo = signin();
  //Create 1 order as User #1;
  await api
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  //Create 2 order as User #2;
  await api
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  await api
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);
  // Make request to get orders for User #2;
    const { body: orderOne } = await api.get('/api/orders')
    .set("Cookie", userTwo)
    .expect(200)
    
    const { body: orderTwo } = await api.get('/api/orders')
    .set("Cookie", userOne)
    .expect(200)
  // Make sure we only get orders for user #2;

  expect(orderOne.length).toEqual(2);
  expect(orderTwo.length).toEqual(1);
  expect(orderTwo[0].ticket.id).toEqual(ticketOne.id);
  
});
