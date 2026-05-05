import { ArtifactsService } from './artifacts.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ArtifactsService', () => {
  let service: ArtifactsService;

  const createService = (config?: Record<string, string | undefined>) => {
    const configService = {
      get: jest.fn((key: string) => config?.[key]),
    } as any;
    return new ArtifactsService(configService);
  };

  beforeEach(() => {
    service = createService({
      AWS_REGION: 'us-east-1',
      ARTIFACTS_S3_BUCKET: 'bucket',
      ARTIFACTS_AVATARS_TABLE: 'table',
    });
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve usar fallback de região, bucket e tabela quando config não existir', () => {
    const fallbackService = createService({});

    expect((fallbackService as any).region).toBe('us-east-1');
    expect((fallbackService as any).bucketName).toBe('softsolutions-uploads-a');
    expect((fallbackService as any).tableName).toBe('softsolutions_avatars');
  });

  it('deve lançar BadRequestException se file for nulo', async () => {
    await expect(service.uploadAvatar('userId', null as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve fazer upload de avatar com arquivo válido', async () => {
    const file = {
      buffer: Buffer.from('fake'),
      mimetype: 'image/png',
      size: 123,
      originalname: 'avatar.png',
    };
    (service as any).s3Client.send = jest.fn().mockResolvedValue({});
    (service as any).ddbDocClient.send = jest.fn().mockResolvedValue({});

    const result = await service.uploadAvatar('userId', file as any);

    expect((service as any).s3Client.send).toHaveBeenCalled();
    expect((service as any).ddbDocClient.send).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        userId: 'userId',
        mimeType: 'image/png',
        fileSize: 123,
        message: 'Upload realizado com sucesso',
      }),
    );
    expect(result.s3Key).toMatch(/^avatars\/userId\/.+\.png$/);
  });

  it('deve construir url pública removendo barra final', () => {
    const serviceWithUrl = createService({
      AWS_REGION: 'us-east-1',
      ARTIFACTS_S3_BUCKET: 'bucket',
      ARTIFACTS_AVATARS_TABLE: 'table',
      ARTIFACTS_PUBLIC_BASE_URL: 'https://meusite.com/',
    });

    expect((serviceWithUrl as any).buildAvatarUrl('avatars/user/aid.png')).toBe(
      'https://meusite.com/avatars/user/aid.png',
    );
  });

  it('deve construir url padrão se publicBaseUrl não estiver definido', () => {
    expect((service as any).buildAvatarUrl('avatars/user/aid.png')).toBe(
      'https://bucket.s3.us-east-1.amazonaws.com/avatars/user/aid.png',
    );
  });

  it('deve lançar NotFoundException se avatar não for encontrado', async () => {
    (service as any).ddbDocClient.send = jest.fn().mockResolvedValue({ Items: [] });

    await expect(service.getAvatar('userId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve retornar o avatar mais recente', async () => {
    const now = new Date();
    const items = [
      {
        createdAt: new Date(now.getTime() - 1000).toISOString(),
        s3Key: 'old',
        avatarId: '1',
        userId: 'u',
        mimeType: 'image/png',
        fileSize: 1,
      },
      {
        createdAt: now.toISOString(),
        s3Key: 'new',
        avatarId: '2',
        userId: 'u',
        mimeType: 'image/png',
        fileSize: 2,
      },
    ];
    (service as any).ddbDocClient.send = jest.fn().mockResolvedValue({ Items: items });
    jest.spyOn(service as any, 'buildAvatarUrl').mockReturnValue('url');

    const result = await service.getAvatar('userId');

    expect(result.avatarId).toBe('2');
    expect(result.url).toBe('url');
  });

  it('deve lançar NotFoundException quando a redução não encontrar avatar válido', async () => {
    (service as any).ddbDocClient.send = jest.fn().mockResolvedValue({
      Items: [undefined],
    });

    await expect(service.getAvatar('userId')).rejects.toThrow(NotFoundException);
  });

  it('deve extrair extensão do arquivo pelo originalname', () => {
    const file = { originalname: 'foto.jpeg', mimetype: 'image/png' };

    expect((service as any).extractExtension(file as any)).toBe('jpeg');
  });

  it('deve extrair extensão do mimetype se originalname não existir', () => {
    const file = { originalname: '', mimetype: 'image/png' };

    expect((service as any).extractExtension(file as any)).toBe('png');
  });

  it('deve retornar undefined se não houver extensão nem mimetype', () => {
    const file = { originalname: '', mimetype: '' };

    expect((service as any).extractExtension(file as any)).toBe(undefined);
  });

  it('deve montar chave S3 sem extensão quando ela não existir', () => {
    expect((service as any).buildS3Key('user', 'avatar', undefined)).toBe(
      'avatars/user/avatar',
    );
  });
});
