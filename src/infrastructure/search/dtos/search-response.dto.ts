import { SearchItem } from '../interfaces/search-item.interface';

export interface SearchResponseDto {
  transcription?: string;
  results: SearchItem[];
}