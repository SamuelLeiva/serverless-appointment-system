import { AppointmentDB, AppointmentRequest } from "../types/appointment";

export interface IAppointmentRepository {
    save(request: AppointmentRequest, id: string, status: 'pending'): Promise<void>;
    findByInsuredId(insuredId: string): Promise<AppointmentDB[]>;
    updateStatus(id: string, newStatus: "completed"): Promise<void>;
}