import { SNSClient } from "@aws-sdk/client-sns";
import { SnsService } from "../aws/snsService";

export const makeSnsService = () => {
    const topicArn = process.env.APPOINTMENT_TOPIC_ARN!;
    const client = new SNSClient({});

    return new SnsService(client, topicArn);
};