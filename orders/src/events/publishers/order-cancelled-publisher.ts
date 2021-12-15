import { OrderCancelledEvent, Publisher } from "@rinku12/new-common";
import { Subjects } from "@rinku12/new-common/build/events/subjects";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
