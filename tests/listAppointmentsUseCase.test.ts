import { IAppointmentRepository } from "@/core/ports/appointmentRepository";
import { AppointmentDB } from "@/core/types/appointment";
import { ListAppointmentsUseCase } from "@/core/use-cases/listAppointmentsUseCase";

describe('ListAppointmentsUseCase', () => {
  it('debería lanzar un error si insuredId no tiene longitud 5', async () => {
    const mockRepo: jest.Mocked<IAppointmentRepository> = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new ListAppointmentsUseCase(mockRepo);

    await expect(useCase.execute('123')).rejects.toThrow('Formato de insuredId es incorrecto.');
  });

  it('debería retornar las citas cuando insuredId es válido', async () => {
    const mockAppointments: AppointmentDB[] = [
      { id: '1', insuredId: '12345', scheduleId: 101, countryISO: 'PE', status: 'pending', createdAt: '2025-11-13' },
    ];

    const mockRepo: jest.Mocked<IAppointmentRepository> = {
      save: jest.fn(),
      findByInsuredId: jest.fn().mockResolvedValue(mockAppointments),
      updateStatus: jest.fn(),
    };

    const useCase = new ListAppointmentsUseCase(mockRepo);

    const result = await useCase.execute('12345');

    expect(result).toEqual(mockAppointments);
    expect(mockRepo.findByInsuredId).toHaveBeenCalledWith('12345');
  });
});