import { Router } from 'express';
import * as inscricaoController from '../controllers/inscricaoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = Router();

// Rotas protegidas para inscrições
router.post('/', authMiddleware, inscricaoController.inscreverCurso);
router.get('/:idUser', authMiddleware, inscricaoController.obterInscricoes);
router.delete('/:idUser/cursos/:idModulo', authMiddleware, inscricaoController.cancelarInscricao);

export default router;


/**
 * @swagger
 * tags:
 *   name: Inscrições
 *   description: Gerenciamento de inscrições em cursos
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
 *               _idModulo:
 *                 type: number
 *                 description: ID do módulo
 *               _idUser:
 *                 type: number
 *                 description: ID do usuário
 *     responses:
 *       201:
 *         description: Inscrição realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscricao'
 *       400:
 *         description: Usuário já está inscrito neste módulo
 *       403:
 *         description: Acesso não autorizado
 */

/**
 * @swagger
 * /api/inscricoes/{idUser}:
 *   get:
 *     tags: [Inscrições]
 *     summary: Listar inscrições do usuário
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
 *         description: Página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inscricao'
 *       403:
 *         description: Acesso não autorizado
 */

/**
 * @swagger
 * /api/inscricoes/{idUser}/cursos/{idModulo}:
 *   delete:
 *     tags: [Inscrições]
 *     summary: Cancelar inscrição em um curso
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *       - in: path
 *         name: idModulo
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do módulo
 *     responses:
 *       200:
 *         description: Inscrição cancelada com sucesso
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Inscrição não encontrada
 */
