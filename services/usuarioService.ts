import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario, { IUsuario } from '../models/Usuario';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

// gerar token JWT
const generateToken = (user: { _idUser: number; tipo: string }) => {
  return jwt.sign(
    { _idUser: user._idUser, tipo: user.tipo },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const cadastrarUsuario = async (userData: Partial<IUsuario>): Promise<{ user: IUsuario; token: string }> => {
  // Validação de CPF
  if (!validarCPF(String(userData.cpfUsuario))) {
    throw new AppError('CPF inválido. Por favor, insira um CPF válido no formato ###.###.###-##', 400);
  }

  try {
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
  } catch (error: any) {
    // Verificar se o erro é de chave duplicada no campo `cpfUsuario`
    if (error.code === 11000 && error.keyPattern?.cpfUsuario) {
      throw new AppError('CPF já cadastrado. Por favor, use outro CPF.', 400);
    }
    // Outros erros
    throw error;
  }
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


const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
};
