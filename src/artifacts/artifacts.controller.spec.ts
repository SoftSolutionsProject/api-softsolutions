import { BadRequestException } from '@nestjs/common';
import { ArtifactsController } from './artifacts.controller';

describe('ArtifactsController', () => {
  const service = { uploadAvatar: jest.fn(), getAvatar: jest.fn() };
  const controller = new ArtifactsController(service as any);

  beforeEach(() => jest.clearAllMocks());

  it('exige usuario autenticado', async () => {
    await expect(controller.uploadAvatar({}, {} as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(controller.getAvatar({})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('usa id ou sub do usuario', async () => {
    service.uploadAvatar.mockResolvedValue({ avatarId: 'a' });
    service.getAvatar.mockResolvedValue({ avatarId: 'a' });
    await controller.uploadAvatar({ user: { id: 10 } }, {} as any);
    await controller.getAvatar({ user: { sub: 20 } });
    expect(service.uploadAvatar).toHaveBeenCalledWith('10', {});
    expect(service.getAvatar).toHaveBeenCalledWith('20');
  });
});
