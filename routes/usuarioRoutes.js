const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/:idUser', usuarioController.obterUsuario);
router.put('/:idUser', usuarioController.atualizarUsuario);

module.exports = router;
