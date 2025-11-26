import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  DynamoDBClient,
  DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { UploadAvatarResponseDto } from './dto/upload-avatar.dto';
import { GetAvatarResponseDto } from './dto/get-avatar.dto';
import { MulterFile } from './types';

interface AvatarRecord {
  avatarId: string;
  userId: string;
  s3Key: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

@Injectable()
export class ArtifactsService {
  private readonly s3Client: S3Client;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly bucketName: string;
  private readonly tableName: string;
  private readonly region: string;
  private readonly publicBaseUrl?: string;

  constructor(private readonly configService: ConfigService) {
    this.region =
      this.configService.get<string>('AWS_REGION') ||
      this.configService.get<string>('AWS_DEFAULT_REGION') ||
      'us-east-1';

    this.bucketName =
      this.configService.get<string>('ARTIFACTS_S3_BUCKET') ||
      'softsolutions-uploads-a';
    this.tableName =
      this.configService.get<string>('ARTIFACTS_AVATARS_TABLE') ||
      'softsolutions_avatars';
    this.publicBaseUrl = this.configService.get<string>(
      'ARTIFACTS_PUBLIC_BASE_URL',
    );

    this.s3Client = new S3Client({ region: this.region });

    const dynamoConfig: DynamoDBClientConfig = { region: this.region };
    this.ddbDocClient = DynamoDBDocumentClient.from(
      new DynamoDBClient(dynamoConfig),
      { marshallOptions: { removeUndefinedValues: true } },
    );
  }

  async uploadAvatar(
    userId: string,
    file?: MulterFile,
  ): Promise<UploadAvatarResponseDto> {
    if (!file) {
      throw new BadRequestException('Arquivo de imagem é obrigatório');
    }

    const avatarId = randomUUID();
    const extension = this.extractExtension(file);
    const s3Key = this.buildS3Key(userId, avatarId, extension);
    const createdAt = new Date().toISOString();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    const record: AvatarRecord = {
      avatarId,
      userId,
      s3Key,
      mimeType: file.mimetype,
      fileSize: file.size,
      createdAt,
    };

    await this.ddbDocClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: record,
      }),
    );

    const url = this.buildAvatarUrl(s3Key);

    return {
      ...record,
      url,
      message: 'Upload realizado com sucesso',
    };
  }

  async getAvatar(userId: string): Promise<GetAvatarResponseDto> {
    const result = await this.ddbDocClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
      }),
    );

    const items = result.Items as AvatarRecord[] | undefined;
    if (!items || items.length === 0) {
      throw new NotFoundException('Avatar não encontrado para este usuário');
    }

    const latest = items.reduce((latestItem, current) => {
      if (!latestItem) return current;
      return new Date(current.createdAt) > new Date(latestItem.createdAt)
        ? current
        : latestItem;
    }, items[0] as AvatarRecord | undefined);

    if (!latest) {
      throw new NotFoundException('Avatar não encontrado para este usuário');
    }

    return {
      ...latest,
      url: this.buildAvatarUrl(latest.s3Key),
    };
  }

  private buildS3Key(userId: string, avatarId: string, extension?: string) {
    const sanitizedExt = extension ? extension.replace('.', '') : '';
    const extSuffix = sanitizedExt ? `.${sanitizedExt}` : '';
    return `avatars/${userId}/${avatarId}${extSuffix}`;
  }

  private buildAvatarUrl(s3Key: string) {
    const baseUrl = this.publicBaseUrl?.replace(/\/$/, '');
    if (baseUrl) {
      return `${baseUrl}/${s3Key}`;
    }

    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${s3Key}`;
  }

  private extractExtension(file: MulterFile) {
    const ext = extname(file.originalname || '');
    if (ext) return ext.replace('.', '');

    const mime = file.mimetype || '';
    const [, subtype] = mime.split('/');
    return subtype || undefined;
  }
}
