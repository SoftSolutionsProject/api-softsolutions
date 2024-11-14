import { Router } from 'express';
import * as inscricaoController from '../controllers/inscricaoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = Router();

// Rotas protegidas para inscrições
router.post('/', authMiddleware, inscricaoController.inscreverCurso);
router.get('/:idUser', authMiddleware, inscricaoController.obterInscricoes);
router.delete('/:idUser/cursos/:idModulo', authMiddleware, inscricaoController.cancelarInscricao);

export default router;
