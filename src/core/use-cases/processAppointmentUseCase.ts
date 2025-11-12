import { ICountryRepository } from "../ports/countryRepository";
import { IEventBridgeService } from "../ports/eventBridgeService";
import { AppointmentDB } from "../types/appointment";

export class ProcessAppointmentUseCase {
    constructor(
        private countryRepository: ICountryRepository,
        private eventBridgeService: IEventBridgeService
    ) {}

    async execute(request: AppointmentDB): Promise<void> {
        
        // Registrar en la base de datos MySQL
        await this.countryRepository.registerAppointment(request);

        // Notificación de Conformidad
        await this.eventBridgeService.sendCompletionEvent(request.id);
    }
}