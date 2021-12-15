import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("return a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await api
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(404);
});

it("return a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await api
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(401);
});

it("return a 401 if the user does not own the ticket", async () => {
  const resp = await api.post("/api/tickets").set("Cookie", signin()).send({
    title: "sadasd",
    price: 20,
  });

  await api
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", signin())
    .send({
      title: "asdasdsad",
      price: 100,
    })
    .expect(401);
});

it("return a 400 if the user provided an invalid title or price", async () => {
  const cookie = signin();
  const resp = await api.post("/api/tickets").set("Cookie", cookie).send({
    title: "sadasd",
    price: 20,
  });

  await api
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 100,
    })
    .expect(400);

  await api
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "sad",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
    const cookie = signin();
    const resp = await api.post("/api/tickets").set("Cookie", cookie).send({
      title: "sadasd",
      price: 20,
    });


    await api
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Hello",
      price: 100,
    })
    .expect(200);

    const ticketResponse = await api.get(`/api/tickets/${resp.body.id}`).send()

    expect(ticketResponse.body.title).toEqual('Hello');
    expect(ticketResponse.body.price).toEqual(100);

});


it('reject update if ticket is reserved',async ()=>{
  const cookie = signin();
    const resp = await api.post("/api/tickets").set("Cookie", cookie).send({
      title: "sadasd",
      price: 20,
    });

    const ticket = await Ticket.findById(resp.body.id);

    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await ticket!.save();

    await api
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Hello",
      price: 100,
    })
    .expect(400);

})