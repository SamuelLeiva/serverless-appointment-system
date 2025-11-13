import { ICountryRepository } from "@/core/ports/countryRepository";
import { IEventBridgeService } from "@/core/ports/eventBridgeService";
import { AppointmentDB } from "@/core/types/appointment";
import { ProcessAppointmentUseCase } from "@/core/use-cases/processAppointmentUseCase";

describe('ProcessAppointmentUseCase', () => {
  let mockCountryRepo: jest.Mocked<ICountryRepository>;
  let mockEventBridge: jest.Mocked<IEventBridgeService>;
  let useCase: ProcessAppointmentUseCase;

  beforeEach(() => {
    mockCountryRepo = {
      registerAppointment: jest.fn(),
    };

    mockEventBridge = {
      sendCompletionEvent: jest.fn(),
    };

    useCase = new ProcessAppointmentUseCase(mockCountryRepo, mockEventBridge);
  });

  it('should register appointment and send completion event', async () => {
    // Arrange
    const appointment: AppointmentDB = {
      id: 'a1',
      insuredId: '12345',
      scheduleId: 101,
      countryISO: 'PE',
      status: 'pending',
      createdAt: '2025-11-13',
    };

    // Act
    await useCase.execute(appointment);

    // Assert
    expect(mockCountryRepo.registerAppointment).toHaveBeenCalledWith(appointment);
    expect(mockEventBridge.sendCompletionEvent).toHaveBeenCalledWith('a1');
  });

  it('should throw if registration fails', async () => {
    // Arrange
    mockCountryRepo.registerAppointment.mockRejectedValueOnce(new Error('Registration failed'));

    const appointment: AppointmentDB = {
      id: 'a2',
      insuredId: '99999',
      scheduleId: 303,
      countryISO: 'CL',
      status: 'pending',
      createdAt: '2025-11-13',
    };

    // Act & Assert
    await expect(useCase.execute(appointment)).rejects.toThrow('Registration failed');
  });

  it('should throw if event sending fails', async () => {
    // Arrange
    mockEventBridge.sendCompletionEvent.mockRejectedValueOnce(new Error('EventBridge error'));

    const appointment: AppointmentDB = {
      id: 'a3',
      insuredId: '55555',
      scheduleId: 404,
      countryISO: 'AR',
      status: 'pending',
      createdAt: '2025-11-13',
    };

    // Act & Assert
    await expect(useCase.execute(appointment)).rejects.toThrow('EventBridge error');
  });
});