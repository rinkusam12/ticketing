import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw Error("JWT_KEYU not defined")
  }
  if(!process.env.MONGO_URI) {
    throw Error("MONGO_URI is not defined")
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("authentication Database connected");
  } catch (error) {
    console.log("error", error);
    process.exit(1)
  }
};

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});

start();
