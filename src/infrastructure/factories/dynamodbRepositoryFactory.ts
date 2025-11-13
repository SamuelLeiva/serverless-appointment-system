import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBRepository } from "../repositories/dynamodbRepository";

export const makeDynamoDBRepository = () => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const config = {
    tableName: process.env.APPOINTMENTS_TABLE_NAME!,
    gsiName: process.env.INSURED_ID_GSI_NAME!,
  };

  return new DynamoDBRepository(docClient, config);
};