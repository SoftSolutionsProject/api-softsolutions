import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController';

const router: Router = Router();

router.get('/:idUser', usuarioController.obterUsuario);
router.put('/:idUser', usuarioController.atualizarUsuario);

export default router;
