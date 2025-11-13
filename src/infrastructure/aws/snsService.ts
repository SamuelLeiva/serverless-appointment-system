import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { ISnsService } from "../../core/ports/snsService";
import { AppointmentRequest } from "../../core/types/appointment";

export class SnsService implements ISnsService {
  constructor(
    private readonly client: SNSClient,
    private readonly topicArn: string
  ) {
    if (!topicArn)
      throw new Error("SnsService: APPOINTMENT_TOPIC_ARN no definido.");
  }

  async publishAppointmentRequest(
    data: AppointmentRequest,
    appointmentId: string
  ): Promise<void> {
    const payload = { ...data, id: appointmentId };

    console.log(`[SNS] Publicando agendamiento ${appointmentId}`);

    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(payload),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: data.countryISO,
        },
      },
    });

    try {
      const result = await this.client.send(command);
      console.log(`[SNS] Publicado correctamente: ${result.MessageId}`);
    } catch (err) {
      console.error(`[SNS] Error publicando ${appointmentId}`, err);
      throw new Error(`Fallo publicando en SNS para ${appointmentId}.`);
    }
  }
}