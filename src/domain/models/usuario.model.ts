export interface UsuarioModel {
  id?: number;
  nomeUsuario: string;
  cpfUsuario: string;
  email: string;
  senha: string;
  telefone?: string;
  endereco?: any;
  localizacao?: any;
  tipo: 'aluno' | 'administrador';
}
