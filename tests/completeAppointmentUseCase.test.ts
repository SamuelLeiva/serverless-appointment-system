import { IAppointmentRepository } from "@/core/ports/appointmentRepository";
import { CompleteAppointmentUseCase } from "@/core/use-cases/completeAppointmentUseCase";

describe('CompleteAppointmentUseCase', () => {
  it('debería actualizar el estado de la cita a completed', async () => {
    const mockRepo: jest.Mocked<IAppointmentRepository> = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new CompleteAppointmentUseCase(mockRepo);

    await useCase.execute('abc123');

    expect(mockRepo.updateStatus).toHaveBeenCalledWith('abc123', 'completed');
    expect(mockRepo.updateStatus).toHaveBeenCalledTimes(1);
  });
});