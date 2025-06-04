import { DataSource } from 'typeorm';
import { UsuarioEntity } from 'src/infrastructure/database/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import ormConfig from '../../ormconfig.migration';

export async function runSeedUsuarios() {
  const dataSource = ormConfig;
  await dataSource.initialize();

  const repo = dataSource.getRepository(UsuarioEntity);
  const senhaCriptografada = await bcrypt.hash('123456', 10);

  await repo.insert([
    {
      nomeUsuario: 'Admin',
      cpfUsuario: '11144477735',
      email: 'admin@teste.com',
      senha: senhaCriptografada,
      tipo: 'administrador',
      telefone: '11999990000',
      endereco: {
        rua: 'Rua do Admin',
        numero: 1,
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000'
      } as any,
      localizacao: {
        latitude: -23.55052,
        longitude: -46.633308
      } as any
    },
    {
      nomeUsuario: 'Lucas Oliveira',
      cpfUsuario: '39939067020',
      email: 'lucas@teste.com',
      senha: senhaCriptografada,
      tipo: 'aluno',
      telefone: '11988887777',
      endereco: {
        rua: 'Av. Paulista',
        numero: 1000,
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100'
      } as any,
      localizacao: {
        latitude: -23.561684,
        longitude: -46.656139
      } as any
    },
    {
      nomeUsuario: 'Maria Souza',
      cpfUsuario: '31239985000',
      email: 'maria@teste.com',
      senha: senhaCriptografada,
      tipo: 'aluno',
      telefone: '11977776666',
      endereco: {
        rua: 'Rua das Flores',
        numero: 300,
        bairro: 'Jardins',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01440-001'
      } as any,
      localizacao: {
        latitude: -23.561,
        longitude: -46.654
      } as any
    },
    {
      nomeUsuario: 'João Silva',
      cpfUsuario: '70645857052',
      email: 'joao@teste.com',
      senha: senhaCriptografada,
      tipo: 'aluno',
      telefone: '11966665555',
      endereco: {
        rua: 'Rua dos Estudantes',
        numero: 500,
        bairro: 'Liberdade',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01503-001'
      } as any,
      localizacao: {
        latitude: -23.5572,
        longitude: -46.6356
      } as any
    },
    {
      nomeUsuario: 'Ana Paula',
      cpfUsuario: '89765283084',
      email: 'ana@teste.com',
      senha: senhaCriptografada,
      tipo: 'aluno',
      telefone: '11955554444',
      endereco: {
        rua: 'Rua do Aprendizado',
        numero: 42,
        bairro: 'Vila Mariana',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04110-001'
      } as any,
      localizacao: {
        latitude: -23.589,
        longitude: -46.634
      } as any
    }
  ]);

  console.log('Usuários completos inseridos com sucesso!');
  await dataSource.destroy();
}
