import { Request, Response, NextFunction, Router } from 'express';
import { enviarEmail } from '../controllers/emailController';

const router: Router = Router();

router.post('/suporte', (req: Request<any>, res: Response<any>, next: NextFunction) => {
  enviarEmail(req, res, next);
});

export default router;

/**
 * @swagger
 * tags:
 *   name: E-mails
 *   description: Envio de mensagens para o suporte
 */

/**
 * @swagger
 * /api/email/suporte:
 *   post:
 *     tags: [E-mails]
 *     summary: Enviar um e-mail para o suporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do remetente
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do remetente
 *                 example: joao.silva@example.com
 *               assunto:
 *                 type: string
 *                 description: Assunto do e-mail
 *                 example: Dúvida sobre o sistema
 *               mensagem:
 *                 type: string
 *                 description: Conteúdo da mensagem
 *                 example: "Olá, gostaria de saber mais informações sobre os cursos disponíveis."
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: E-mail enviado com sucesso!
 *       400:
 *         description: Erro de validação (campos obrigatórios ausentes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todos os campos são obrigatórios!
 *       500:
 *         description: Erro interno ao enviar o e-mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao enviar o e-mail. Tente novamente mais tarde.
 */

