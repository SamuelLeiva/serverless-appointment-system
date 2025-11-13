import { IAppointmentRepository } from "@/core/ports/appointmentRepository";
import { IIdGenerator } from "@/core/ports/idGenerator";
import { ISnsService } from "@/core/ports/snsService";
import { AppointmentRequest } from "@/core/types/appointment";
import { RegisterAppointmentUseCase } from "@/core/use-cases/registerAppointmentUseCase";

describe('RegisterAppointmentUseCase', () => {
  let mockRepo: jest.Mocked<IAppointmentRepository>;
  let mockSns: jest.Mocked<ISnsService>;
  let mockIdGen: jest.Mocked<IIdGenerator>;
  let useCase: RegisterAppointmentUseCase;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    mockSns = {
      publishAppointmentRequest: jest.fn(),
    };

    mockIdGen = {
      generate: jest.fn().mockReturnValue('gen-123'),
    };

    useCase = new RegisterAppointmentUseCase(mockRepo, mockSns, mockIdGen);
  });

  it('should generate an ID, persist the appointment and publish it to SNS', async () => {
    // Arrange
    const request: AppointmentRequest = {
      insuredId: '12345',
      scheduleId: 101,
      countryISO: 'PE',
    };

    // Act
    await useCase.execute(request);

    // Assert
    expect(mockIdGen.generate).toHaveBeenCalledTimes(1);
    expect(mockRepo.save).toHaveBeenCalledWith(
      request,
      'gen-123',
      'pending'
    );
    expect(mockSns.publishAppointmentRequest).toHaveBeenCalledWith(
      request,
      'gen-123'
    );
  });

  it('should handle repository save rejections gracefully', async () => {
    mockRepo.save.mockRejectedValueOnce(new Error('DB error'));

    const request: AppointmentRequest = {
      insuredId: '99999',
      scheduleId: 55,
      countryISO: 'CL',
    };

    await expect(useCase.execute(request)).rejects.toThrow('DB error');
  });
});