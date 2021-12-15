import { PaymentCreatedEvent, Publisher, Subjects } from "@rinku12/new-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    
}