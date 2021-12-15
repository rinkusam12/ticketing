import mongoose from "mongoose";
import { app } from "./app";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log("Starting....");
  
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEYU not defined");
  }
  if (!process.env.MONGO_URI) {
    throw Error("Mongo URI is not defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw Error("Mongo URI is not defined");
  }
  if (!process.env.NATS_URL) {
    throw Error("Mongo URI is not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw Error("Mongo URI is not defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Order Database connected");
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});

start();
