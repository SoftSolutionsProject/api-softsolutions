import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';

const router: Router = Router();

// Rotas públicas
router.post('/cadastro', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

// Rotas protegidas
router.get('/:idUser', authMiddleware, checkRole(['aluno', 'administrador']), usuarioController.obterUsuario);
router.put('/:idUser', authMiddleware, checkRole(['aluno']), usuarioController.atualizarUsuario);

export default router;

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /api/usuarios/cadastro:
 *   post:
 *     tags: [Usuários]
 *     summary: Cadastrar um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     tags: [Usuários]
 *     summary: Realizar login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _idUser: 1
 *                 nomeUsuario: "João Silva"
 *                 email: "joao@email.com"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @swagger
 * /api/usuarios/{idUser}:
 *   get:
 *     tags: [Usuários]
 *     summary: Obter detalhes de um usuário
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /api/usuarios/{idUser}:
 *   put:
 *     tags: [Usuários]
 *     summary: Atualizar os dados de um usuário
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeUsuario:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: object
 *                 properties:
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   pais:
 *                     type: string
 *     responses:
 *       200:
 *         description: Dados do usuário atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro de validação (ex. CPF não pode ser alterado)
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Usuário não encontrado
 */




