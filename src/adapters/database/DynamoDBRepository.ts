import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { IAppointmentRepository } from "../../core/ports/appointmentRepository";
import { AppointmentDB, AppointmentRequest } from "../../core/types/appointment";

const client = new DynamoDBClient({});
const dbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.APPOINTMENTS_TABLE_NAME;
const GSI_NAME = process.env.INSURED_ID_GSI_NAME;

export class DynamoDBRepository implements IAppointmentRepository {
    async save(request: AppointmentRequest, id: string, status: 'pending'): Promise<void> {
        const item:  AppointmentDB = {
            id,
            insuredId: request.insuredId,
            scheduleId: request.scheduleId,
            countryISO: request.countryISO,
            status,
            createdAt: new Date().toISOString()
        }

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        });

        await dbDocClient.send(command);
    }

    async findByInsuredId(insuredId: string): Promise<AppointmentDB[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI_NAME,
      KeyConditionExpression: "insuredId = :i", // La condición de búsqueda
      ExpressionAttributeValues: {
        ":i": insuredId,
      },
    });

    const response = await dbDocClient.send(command);

    return (response.Items as AppointmentDB[]) || []
  }

  async updateStatus(id: string, newStatus: "completed"): Promise<void> {
    const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'SET #status = :s, updatedAt = :u',
            ExpressionAttributeNames: {
                '#status': 'status',
            },
            ExpressionAttributeValues: {
                ':s': newStatus,
                ':u': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        });

        await dbDocClient.send(command);
  }
}