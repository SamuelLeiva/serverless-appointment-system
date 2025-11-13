import { IAppointmentRepository } from "@/core/ports/appointmentRepository";
import { AppointmentDB } from "@/core/types/appointment";
import { ListAppointmentsUseCase } from "@/core/use-cases/listAppointmentsUseCase";

describe('ListAppointmentsUseCase', () => {
  let mockRepo: jest.Mocked<IAppointmentRepository>;
  let useCase: ListAppointmentsUseCase;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    useCase = new ListAppointmentsUseCase(mockRepo);
  });

  it('should throw if insuredId length is invalid', async () => {
    // Arrange
    const invalidId = '123';

    // Act & Assert
    await expect(useCase.execute(invalidId))
      .rejects
      .toThrow('Formato de insuredId es incorrecto.');
  });

  it('should return appointments when insuredId is valid', async () => {
    // Arrange
    const validId = '12345';
    const mockAppointments: AppointmentDB[] = [
      {
        id: '1',
        insuredId: validId,
        scheduleId: 101,
        countryISO: 'PE',
        status: 'pending',
        createdAt: '2025-11-13',
      },
    ];

    mockRepo.findByInsuredId.mockResolvedValueOnce(mockAppointments);

    // Act
    const result = await useCase.execute(validId);

    // Assert
    expect(mockRepo.findByInsuredId).toHaveBeenCalledWith(validId);
    expect(result).toEqual(mockAppointments);
  });

  it('should throw if repository call fails', async () => {
    // Arrange
    mockRepo.findByInsuredId.mockRejectedValueOnce(new Error('Repo failure'));

    // Act & Assert
    await expect(useCase.execute('12345')).rejects.toThrow('Repo failure');
  });
});