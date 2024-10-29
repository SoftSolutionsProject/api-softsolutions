const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');

// Inscrever-se em um curso (POST)
router.post('/', inscricaoController.inscreverCurso);

// Obter inscrições de um usuário (GET)
router.get('/:idUser', inscricaoController.obterInscricoes);

// Cancelar inscrição em um curso (DELETE)
router.delete('/:idUser/cursos/:idModulo', inscricaoController.cancelarInscricao);

module.exports = router;
