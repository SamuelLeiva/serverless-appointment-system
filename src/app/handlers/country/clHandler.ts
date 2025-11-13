import { SQSHandler } from "aws-lambda";
import { ProcessAppointmentUseCase } from "../../../core/use-cases/processAppointmentUseCase";
import { EventBridgeService } from "../../../infrastructure/aws/eventBridgeService";
import { AppointmentDB } from "../../../core/types/appointment";
import { MySqlRepository } from "../../../infrastructure/repositories/MySqlRepository";
import { makeEventBridgeService } from "../../../infrastructure/factories/eventBridgeServiceFactory";

const CL_DB_CONFIG = { 
    host: process.env.MYSQL_CL_HOST || 'localhost-cl-sim', 
    database: 'cl_appointments_db' 
};

const clRepository = new MySqlRepository(CL_DB_CONFIG);
const eventBridgeService = makeEventBridgeService();
const processAppointmentUseCase = new ProcessAppointmentUseCase(clRepository, eventBridgeService);

export const handler: SQSHandler = async (event) => {
    for (const record of event.Records) {
        try {
            const snsMessage = JSON.parse(record.body); 
            const appointmentData: AppointmentDB = JSON.parse(snsMessage.Message);
            
            await processAppointmentUseCase.execute(appointmentData);
            console.log(`[CL] Cita ${appointmentData.id} procesada y conformidad enviada.`);

        } catch (error) {
            console.error(`Error procesando mensaje SQS para CL. El mensaje será reintentado: ${error}`);
            throw error; 
        }
    }
};