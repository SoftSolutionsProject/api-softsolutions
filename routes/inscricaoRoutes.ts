// routes/inscricaoRoutes.ts
import { Router } from 'express';
import * as inscricaoController from '../controllers/inscricaoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = Router();

// Rotas protegidas para inscrições
router.post('/', authMiddleware, inscricaoController.inscreverCurso);
router.get('/:idUser', authMiddleware, inscricaoController.obterInscricoes);
router.delete('/:idUser/cursos/:idCurso', authMiddleware, inscricaoController.cancelarInscricao);

export default router;


/**
 * @swagger
 * tags:
 *   name: Inscrições
 *   description: Gerenciamento de inscrições em cursos na plataforma
 */

/**
 * @swagger
 * /api/inscricoes:
 *   post:
 *     tags: [Inscrições]
 *     summary: Inscrever-se em um curso
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _idCurso:
 *                 type: number
 *                 description: ID do curso
 *               _idUser:
 *                 type: number
 *                 description: ID do usuário
 *           example:
 *             _idCurso: 1
 *             _idUser: 123
 *     responses:
 *       201:
 *         description: Inscrição realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscricao'
 *       400:
 *         description: Usuário já está inscrito neste curso
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /api/inscricoes/{idUser}:
 *   get:
 *     tags: [Inscrições]
 *     summary: Obter todas as inscrições de um usuário
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Página da listagem
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Lista de inscrições retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inscricao'
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Nenhuma inscrição encontrada para o usuário
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /api/inscricoes/{idUser}/cursos/{idCurso}:
 *   delete:
 *     tags: [Inscrições]
 *     summary: Cancelar inscrição em um curso
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Inscrição cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inscrição cancelada com sucesso
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Inscrição não encontrada
 *       500:
 *         description: Erro interno no servidor
 */
