import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@rinku12/new-common";
import { paymentCreationRouter } from "./routes/new";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);
app.use(paymentCreationRouter);



app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
