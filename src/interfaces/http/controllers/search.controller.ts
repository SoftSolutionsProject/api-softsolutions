import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchCursosUseCase } from 'src/application/use-cases/search/search-cursos.use-case';
import { SearchResultDto } from '../dtos/responses/search-result.dto';

@ApiTags('Busca')
@Controller('busca')
export class SearchController {
  constructor(private readonly searchCursos: SearchCursosUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Buscar cursos com base em similaridade semântica' })
  @ApiQuery({ name: 'query', required: true, type: String })
  async search(@Query('query') query: string): Promise<SearchResultDto[]> {
    const sanitized = query?.trim();
    if (!sanitized || sanitized.length < 2) {
      throw new BadRequestException('A consulta deve ter pelo menos 2 caracteres.');
    }

    const results = await this.searchCursos.execute(sanitized);
    return results.map((result) => new SearchResultDto(result));
  }
}
