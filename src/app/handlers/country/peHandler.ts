import { SQSHandler } from "aws-lambda";
import { ProcessAppointmentUseCase } from "../../../core/use-cases/processAppointmentUseCase";
import { EventBridgeService } from "../../../infrastructure/aws/eventBridgeService";
import { MySqlRepository } from "../../../infrastructure/repositories/MySqlRepository";
import { AppointmentDB } from "../../../core/types/appointment";
import { makeEventBridgeService } from "../../../infrastructure/factories/eventBridgeServiceFactory";

const PE_DB_CONFIG = {
  host: process.env.MYSQL_PE_HOST || "localhost-pe-sim",
  database: "pe_appointments_db",
};

const peRepository = new MySqlRepository(PE_DB_CONFIG);
const eventBridgeService = makeEventBridgeService();
const processAppointmentUseCase = new ProcessAppointmentUseCase(
  peRepository,
  eventBridgeService
);

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const snsMessage = JSON.parse(record.body);
      const appointmentData: AppointmentDB = JSON.parse(snsMessage.Message);

      await processAppointmentUseCase.execute(appointmentData);
      console.log(
        `[PE] Cita ${appointmentData.id} procesada y conformidad enviada.`
      );
    } catch (error) {
      console.error(
        `Error procesando mensaje SQS para PE. El mensaje será reintentado: ${error}`
      );
      throw error;
    }
  }
};