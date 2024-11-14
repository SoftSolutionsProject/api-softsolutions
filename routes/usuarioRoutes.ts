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