import supertest from "supertest";
import { app } from "../../app";

const createTicket = async () => {
  const title = "concert",
    price = 20;
  return supertest(app).post("/api/tickets").set("Cookie", signin()).send({
    title,
    price,
  });
};

it("can fetch all ticket", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await supertest(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
