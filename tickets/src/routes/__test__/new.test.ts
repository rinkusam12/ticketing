import supertest from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from '../../nats-wrapper'


it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await supertest(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await supertest(app).post("/api/tickets").send({}).expect(401);
});

it("not return 401 if user is signed in", async () => {
  const response = await supertest(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await supertest(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await supertest(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("return an error if invalid price is provided", async () => {
  await supertest(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "sadasd",
    })
    .expect(400);

  await supertest(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "sadas",
      price: -10,
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  //Add in check to make sure ticket was created and saved to database.
  const title = "dfasdas";
  await supertest(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "dfasdas";
  await api
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);
    console.log(natsWrapper);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
