import { Router } from 'express';
import * as courseController from '../controllers/cursoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';

const router = Router();

// Adicionar curso (somente administradores)
router.post('/', authMiddleware, checkRole(['administrador']), courseController.adicionarCurso);

export default router;

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     tags: [Cursos]
 *     summary: Adicionar um novo curso
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           example:
 *             nomeCurso: "Python para Análise de Dados"
 *             tempoCurso: 60
 *             descricaoCurta: "Aprenda a usar Python."
 *             descricaoDetalhada: "Ideal para quem deseja se destacar na a´rea de dados."
 *             professor: "Ana Costa"
 *             categoria: "Data Science"
 *             status: "ativo"
 *             avaliacao: 4.9
 *             modulos:
 *               - nomeModulo: "Módulo 1: Fundamentos de Análise de Dados"
 *                 tempoModulo: 15
 *                 aulas:
 *                   - nomeAula: "Introdução à Análise de Dados"
 *                     tempoAula: 1.5
 *                     videoUrl: "https://www.youtube.com/watch?v=O9vhXA5uA_4&ab_channel=pyPRO"
 *                     materialApoio: []
 *                     descricaoConteudo: "Uma visão geral sobre o que é análise de dados."
 *     responses:
 *       201:
 *         description: Curso adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Erro de validação ou estrutura incorreta
 *       403:
 *         description: Acesso não autorizado
 *       500:
 *         description: Erro no servidor
 */
