import { AppointmentDB } from "../types/appointment";


export interface ICountryRepository {
    registerAppointment(data: AppointmentDB): Promise<void>
}