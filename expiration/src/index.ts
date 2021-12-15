
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  
  if (!process.env.NATS_CLIENT_ID) {
    throw Error("NATS_CLIENT_ID is not defined");
  }
  if (!process.env.NATS_URL) {
    throw Error("NATS_URL is not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw Error("NATS_CLUSTER_ID is not defined");
  }
  if (!process.env.REDIS_HOST) {
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
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

start();
