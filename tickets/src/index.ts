import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log("Starting up....");
  
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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    await mongoose.connect(process.env.MONGO_URI);
    console.log("ticket Database connected");
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});

start();
