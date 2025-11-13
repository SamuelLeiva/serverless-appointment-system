import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { IAppointmentRepository } from "../../core/ports/appointmentRepository";
import { AppointmentDB, AppointmentRequest } from "../../core/types/appointment";

interface DynamoDBRepositoryConfig {
  tableName: string;
  gsiName: string;
}

/**
 * Implementación de AppointmentRepository usando DynamoDB
 * Inyecta el cliente y la configuración, sin dependencias duras.
 */
export class DynamoDBRepository implements IAppointmentRepository {
  private readonly db: DynamoDBDocumentClient;
  private readonly tableName: string;
  private readonly gsiName: string;

  constructor(db: DynamoDBDocumentClient, config: DynamoDBRepositoryConfig) {
    this.db = db;
    this.tableName = config.tableName;
    this.gsiName = config.gsiName;
  }

  async save(request: AppointmentRequest, id: string, status: "pending"): Promise<void> {
    const item: AppointmentDB = {
      id,
      insuredId: request.insuredId,
      scheduleId: request.scheduleId,
      countryISO: request.countryISO,
      status,
      createdAt: new Date().toISOString(),
    };

    await this.db.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  async findByInsuredId(insuredId: string): Promise<AppointmentDB[]> {
    const response = await this.db.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.gsiName,
        KeyConditionExpression: "insuredId = :i",
        ExpressionAttributeValues: { ":i": insuredId },
      })
    );

    return (response.Items as AppointmentDB[]) || [];
  }

  async updateStatus(id: string, newStatus: "completed"): Promise<void> {
    await this.db.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: "SET #status = :s, updatedAt = :u",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":s": newStatus,
          ":u": new Date().toISOString(),
        },
      })
    );
  }
}