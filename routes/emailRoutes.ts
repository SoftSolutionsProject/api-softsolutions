import { Request, Response, NextFunction, Router } from 'express';
import { enviarEmail } from '../controllers/emailController';

const router: Router = Router();

router.post('/suporte', (req: Request<any>, res: Response<any>, next: NextFunction) => {
  enviarEmail(req, res, next);
});

export default router;
