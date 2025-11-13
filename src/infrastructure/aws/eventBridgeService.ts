import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { IEventBridgeService } from "../../core/ports/eventBridgeService";

export class EventBridgeService implements IEventBridgeService {
  constructor(
    private readonly client: EventBridgeClient,
    private readonly source: string,
    private readonly eventBusName = "default"
  ) {
    if (!source) throw new Error("EventBridgeService: source no definido.");
  }

  async sendCompletionEvent(appointmentId: string): Promise<void> {
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: this.source,
          DetailType: "AppointmentCompleted",
          Detail: JSON.stringify({ appointmentId }),
          EventBusName: this.eventBusName,
        },
      ],
    });

    try {
      await this.client.send(command);
      console.log(`[EventBridge] Evento enviado: ${appointmentId}`);
    } catch (err) {
      console.error(`[EventBridge] Error enviando evento ${appointmentId}`, err);
      throw new Error("Error enviando evento a EventBridge.");
    }
  }
}