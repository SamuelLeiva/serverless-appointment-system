// Payload de entrada a la apicación
export interface AppointmentRequest {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
}

// Estructura almacenada en dynamoDB
export interface AppointmentDB {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
    status: 'pending' | 'completed';
    createdAt: string;
}