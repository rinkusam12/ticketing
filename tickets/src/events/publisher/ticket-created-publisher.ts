import { Publisher, TicketCreatedEvent } from "@rinku12/new-common";
import { Subjects } from "@rinku12/new-common/build/events/subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}