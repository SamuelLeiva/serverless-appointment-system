import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { AppointmentRequest } from "../../core/types/appointment";
import { RegisterAppointmentUseCase } from "../../core/use-cases/registerAppointmentUseCase";
import { SnsService } from "../aws/snsService";
import { DynamoDBRepository } from "../database/DynamoDBRepository";

const appointmentRepository = new DynamoDBRepository();
const snsService = new SnsService();

const registerAppointmentUseCase = new RegisterAppointmentUseCase(
  appointmentRepository,
  snsService
);

// Función de utilidad para validar la entrada
function validateRequest(body: any): AppointmentRequest {
  const { insuredId, scheduleId, countryISO } = body;

  if (!insuredId || typeof insuredId !== "string" || insuredId.length !== 5) {
    throw new Error("insuredId inválido (debe ser string de 5 dígitos).");
  }
  if (!scheduleId || typeof scheduleId !== "number" || scheduleId <= 0) {
    throw new Error("scheduleId inválido (debe ser un número positivo).");
  }
  if (countryISO !== "PE" && countryISO !== "CL") {
    throw new Error('countryISO inválido (debe ser "PE" o "CL").');
  }

  // El objeto validado cumple con la interfaz AppointmentRequest
  return { insuredId, scheduleId, countryISO } as AppointmentRequest;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Cuerpo de la petición vacío." }),
      };
    }

    // Parseo y Validación
    const body = JSON.parse(event.body);
    const requestData = validateRequest(body);

    await registerAppointmentUseCase.execute(requestData);

    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message:
          "Agendamiento en proceso. Consulta el estado usando el GET /appointment/{insuredId}.",
      }),
    };
  } catch (error) {
    console.error("Error al procesar la petición:", error);

    if (
      error instanceof Error &&
      (error.message.includes("inválido") || error.message.includes("vacío"))
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error interno al iniciar el agendamiento.",
      }),
    };
  }
};