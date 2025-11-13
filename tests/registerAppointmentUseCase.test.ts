import { IAppointmentRepository } from "@/core/ports/appointmentRepository";
import { IIdGenerator } from "@/core/ports/idGenerator";
import { ISnsService } from "@/core/ports/snsService";
import { AppointmentRequest } from "@/core/types/appointment";
import { RegisterAppointmentUseCase } from "@/core/use-cases/registerAppointmentUseCase";

describe('RegisterAppointmentUseCase', () => {
  it('debería guardar la cita y publicarla en SNS', async () => {
    const mockRepo: jest.Mocked<IAppointmentRepository> = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const mockSns: jest.Mocked<ISnsService> = {
      publishAppointmentRequest: jest.fn(),
    };

    const mockIdGenerator: jest.Mocked<IIdGenerator> = {
      generate: jest.fn().mockReturnValue('gen-123'),
    };

    const useCase = new RegisterAppointmentUseCase(mockRepo, mockSns, mockIdGenerator);

    const request: AppointmentRequest = {
      insuredId: '12345',
      scheduleId: 101,
      countryISO: 'PE',
    };

    await useCase.execute(request);

    expect(mockIdGenerator.generate).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalledWith(request, 'gen-123', 'pending');
    expect(mockSns.publishAppointmentRequest).toHaveBeenCalledWith(request, 'gen-123');
  });
});