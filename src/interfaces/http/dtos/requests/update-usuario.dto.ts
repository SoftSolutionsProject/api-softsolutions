export class UpdateUsuarioDto {
  nomeUsuario?: string;
  email?: string;
  senha?: string;
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
}
