import supertest from "supertest";
import { app } from "../../app";

it("return a 404 if ticket is not found", async () => {
  return supertest(app)
    .get("/api/ticket/adsfasdfasd")
    .send()
    .expect(404);
});

it("return the ticket if it is found", async () => {
  const title = "concert",
    price = 20;
  const response = await supertest(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await supertest(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
