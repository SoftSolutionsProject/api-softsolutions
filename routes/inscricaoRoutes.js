const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');

router.post('/', inscricaoController.inscreverCurso);
router.get('/:idUser', inscricaoController.obterInscricoes);
router.delete('/:idUser/cursos/:idModulo', inscricaoController.cancelarInscricao);

module.exports = router;
