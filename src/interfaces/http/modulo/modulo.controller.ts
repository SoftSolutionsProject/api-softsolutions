import { Controller, UseGuards } from '@nestjs/common';
import { ModuloService } from '../../../application/modulo/use-cases/modulo.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('modulos')
@UseGuards(AuthGuard)
export class ModuloController {
  constructor(private readonly moduloService: ModuloService) {}
}
