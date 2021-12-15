import { OrderCreatedEvent, Publisher } from "@rinku12/new-common";
import { Subjects } from "@rinku12/new-common/build/events/subjects";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}