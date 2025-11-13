import { IAppointmentRepository } from "@/core/ports/appointmentRepository";
import { CompleteAppointmentUseCase } from "@/core/use-cases/completeAppointmentUseCase";
describe('CompleteAppointmentUseCase', () => {
  let mockRepo: jest.Mocked<IAppointmentRepository>;
  let useCase: CompleteAppointmentUseCase;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    useCase = new CompleteAppointmentUseCase(mockRepo);
  });

  it('should update appointment status to "completed"', async () => {
    // Arrange
    const appointmentId = 'abc123';

    // Act
    await useCase.execute(appointmentId);

    // Assert
    expect(mockRepo.updateStatus).toHaveBeenCalledWith(appointmentId, 'completed');
    expect(mockRepo.updateStatus).toHaveBeenCalledTimes(1);
  });

  it('should throw if repository update fails', async () => {
    // Arrange
    mockRepo.updateStatus.mockRejectedValueOnce(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute('abc123')).rejects.toThrow('Database error');
  });
});