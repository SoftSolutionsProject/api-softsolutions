export class CreateUsuarioDto {
  nomeUsuario: string;
  cpfUsuario: string;
  email: string;
  senha: string;
  telefone?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };
  localizacao?: {
    type: 'Point';
    coordinates: [number, number];
  };
  tipo?: 'aluno' | 'administrador';
}
