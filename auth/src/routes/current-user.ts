import { currentUser } from "@rinku12/new-common";
import express from "express";
const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
  // res.send("Hi There!");
});

export { router as currentUserRouter };

