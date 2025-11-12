import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { IAppointmentRepository } from "../../core/ports/appointmentRepository";
import { AppointmentDB, AppointmentRequest } from "../../core/types/appointment";

const client = new DynamoDBClient({});
const dbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.APPOINTMENTS_TABLE_NAME;

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
}