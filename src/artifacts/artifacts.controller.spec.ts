import { Test, TestingModule } from '@nestjs/testing';
import { ArtifactsController } from './artifacts.controller';
import { ArtifactsService } from './artifacts.service';
import { BadRequestException } from '@nestjs/common';

describe('ArtifactsController', () => {
  let controller: ArtifactsController;
  let service: { uploadAvatar: jest.Mock; getAvatar: jest.Mock };

  beforeEach(async () => {
    service = {
      uploadAvatar: jest.fn(),
      getAvatar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtifactsController],
      providers: [
        {
          provide: ArtifactsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<ArtifactsController>(ArtifactsController);
  });

  describe('uploadAvatar', () => {
    it('deve lançar exceção se userId não existir', async () => {
      const file = { buffer: Buffer.from(''), mimetype: 'image/png', size: 10 };

      await expect(controller.uploadAvatar({}, file as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve usar req.user.id quando disponível', async () => {
      const req = { user: { id: '123', sub: '999' } };
      const file = { originalname: 'avatar.png' } as any;
      service.uploadAvatar.mockResolvedValue('ok');

      await expect(controller.uploadAvatar(req, file)).resolves.toBe('ok');
      expect(service.uploadAvatar).toHaveBeenCalledWith('123', file);
    });

    it('deve usar req.user.sub como fallback', async () => {
      const req = { user: { sub: '456' } };
      const file = { originalname: 'avatar.png' } as any;
      service.uploadAvatar.mockResolvedValue('ok');

      await controller.uploadAvatar(req, file);

      expect(service.uploadAvatar).toHaveBeenCalledWith('456', file);
    });
  });

  describe('getAvatar', () => {
    it('deve chamar service.getAvatar com userId', async () => {
      const req = { user: { id: '456' } };
      service.getAvatar.mockResolvedValue('avatarData');

      await expect(controller.getAvatar(req)).resolves.toBe('avatarData');
      expect(service.getAvatar).toHaveBeenCalledWith('456');
    });

    it('deve lançar exceção quando não houver id nem sub', async () => {
      await expect(controller.getAvatar({ user: {} })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
