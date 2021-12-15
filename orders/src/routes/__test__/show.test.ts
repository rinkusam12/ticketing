import { Types } from "mongoose";
import { Ticket } from "../../models/ticket";

it("should fetches the order", async () => {
  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: "hello",
    price: 20,
  });
  await ticket.save();

  const user = signin();
  

  const { body: order } = await api
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await api
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});



it("return error if one user fetched another user order", async () => {
    const ticket = Ticket.build({
      id: new Types.ObjectId().toHexString(),
      title: "hello",
      price: 20,
    });
    await ticket.save();
  
    const user = signin();
    
  
    const { body: order } = await api
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);
  
    await api
      .get(`/api/orders/${order.id}`)
      .set("Cookie", signin())
      .send()
      .expect(401);
  
  });