import { ExpirationCompleteEvent, Publisher } from "@rinku12/new-common";
import { Subjects } from "@rinku12/new-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}