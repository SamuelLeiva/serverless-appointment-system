import { ICountryRepository } from "@/core/ports/countryRepository";
import { IEventBridgeService } from "@/core/ports/eventBridgeService";
import { AppointmentDB } from "@/core/types/appointment";
import { ProcessAppointmentUseCase } from "@/core/use-cases/processAppointmentUseCase";

describe('ProcessAppointmentUseCase', () => {
  it('debería registrar la cita y enviar el evento de completado', async () => {
    const mockCountryRepo: jest.Mocked<ICountryRepository> = {
      registerAppointment: jest.fn(),
    };

    const mockEventBridge: jest.Mocked<IEventBridgeService> = {
      sendCompletionEvent: jest.fn(),
    };

    const useCase = new ProcessAppointmentUseCase(mockCountryRepo, mockEventBridge);

    const appointment: AppointmentDB = {
      id: 'a1',
      insuredId: '12345',
      scheduleId: 101,
      countryISO: 'PE',
      status: 'pending',
      createdAt: '2025-11-13',
    };

    await useCase.execute(appointment);

    expect(mockCountryRepo.registerAppointment).toHaveBeenCalledWith(appointment);
    expect(mockEventBridge.sendCompletionEvent).toHaveBeenCalledWith('a1');
  });
});