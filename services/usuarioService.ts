import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario, { IUsuario } from '../models/Usuario';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

// Função para gerar token JWT
const generateToken = (user: { _idUser: number; tipo: string }) => {
  return jwt.sign(
    { _idUser: user._idUser, tipo: user.tipo },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const cadastrarUsuario = async (userData: Partial<IUsuario>): Promise<{ user: IUsuario; token: string }> => {
  // Gerar ID único (você pode implementar sua própria lógica)
  const lastUser = await Usuario.findOne().sort({ _idUser: -1 });
  const _idUser = (lastUser?._idUser || 0) + 1;

  // Hash da senha
  const hashedPassword = await bcrypt.hash(userData.senha!, 10);

  const novoUsuario = new Usuario({
    ...userData,
    _idUser,
    tipo: 'aluno', // Força o tipo como aluno para novos cadastros
    senha: hashedPassword
  });

  const user = await novoUsuario.save();
  const token = generateToken({ _idUser: user._idUser, tipo: user.tipo });

  return { user, token };
};

export const login = async (email: string, senha: string): Promise<{ user: IUsuario; token: string }> => {
  const user = await Usuario.findOne({ email });
  if (!user) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  console.log('Senha armazenada:', user.senha);
  console.log('Senha enviada:', senha);

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  const token = generateToken({ _idUser: user._idUser, tipo: user.tipo });
  return { user, token };
};

export const obterUsuario = async (idUser: number): Promise<IUsuario | null> => {
  const usuario = await Usuario.findOne({ _idUser: idUser });
  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404);
  }
  return usuario;
};

export const atualizarUsuario = async (idUser: number, data: Partial<IUsuario>): Promise<IUsuario | null> => {
  const usuarioAtual = await Usuario.findOne({ _idUser: idUser });
  if (!usuarioAtual) {
    throw new AppError('Usuário não encontrado', 404);
  }

  if ('cpfUsuario' in data && data.cpfUsuario !== usuarioAtual.cpfUsuario) {
    throw new AppError('Não é permitido alterar o CPF', 400);
  }

  if (data.email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('Formato de email inválido', 400);
    }
  }

  const usuarioAtualizado = await Usuario.findOneAndUpdate(
    { _idUser: idUser },
    data,
    { new: true }
  );

  return usuarioAtualizado;
};