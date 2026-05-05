import whisper from 'whisper-node';
import { WhisperService } from './whisper.service';

jest.mock('whisper-node', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('WhisperService', () => {
  let service: WhisperService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new WhisperService();
  });

  it('deve concatenar os trechos transcritos', async () => {
    (whisper as jest.Mock).mockResolvedValue([
      { speech: 'ola' },
      { speech: 'mundo' },
    ]);

    await expect(service.transcribe('audio.wav')).resolves.toBe('ola mundo');
    expect(whisper).toHaveBeenCalledWith('audio.wav');
  });

  it('deve retornar string vazia quando o resultado não for array', async () => {
    (whisper as jest.Mock).mockResolvedValue('invalido');

    await expect(service.transcribe('audio.wav')).resolves.toBe('');
  });

  it('deve remover espaços excedentes do resultado final', async () => {
    (whisper as jest.Mock).mockResolvedValue([
      { speech: '  ola ' },
      { speech: ' mundo  ' },
    ]);

    await expect(service.transcribe('audio.wav')).resolves.toBe('ola   mundo');
  });
});
