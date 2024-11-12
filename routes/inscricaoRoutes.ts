import { Router } from 'express';
import * as inscricaoController from '../controllers/inscricaoController';

const router: Router = Router();

router.post('/', inscricaoController.inscreverCurso);
router.get('/:idUser', inscricaoController.obterInscricoes);
router.delete('/:idUser/cursos/:idModulo', inscricaoController.cancelarInscricao);

export default router;
