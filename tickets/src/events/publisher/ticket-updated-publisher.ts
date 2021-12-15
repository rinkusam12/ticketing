import { Publisher, TicketUpdatedEvent } from "@rinku12/new-common";
import { Subjects } from "@rinku12/new-common/build/events/subjects";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}