import { currentUser, requireAuth, validateRequest } from "@rinku12/new-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater that 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = new Ticket({
      title,
      price,
      userId: req.currentUser?.id,
    });
    await ticket.save();
    console.log("Tickets  created");
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id:ticket.id,
      title:ticket.title,
      price:ticket.price,
      userId:ticket.userId,
      version: ticket.version
    })
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
