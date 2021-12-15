import { NotFoundError } from "@rinku12/new-common";
import { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
      console.log("From request params", req.params.id);

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
  return res.send(ticket);
});

export { router as showTicketRouter };
