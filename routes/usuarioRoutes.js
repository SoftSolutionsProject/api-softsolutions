const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Obter informações do perfil do usuário (GET)
router.get('/:idUser', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _idUser: req.params.idUser });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter o usuário', error });
  }
});

// Atualizar informações do perfil do usuário (PUT)
router.put('/:idUser', async (req, res) => {
  try {
    const usuarioAtualizado = await Usuario.findOneAndUpdate(
      { _idUser: req.params.idUser },
      req.body,
      { new: true }
    );
    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar o usuário', error });
  }
});

module.exports = router;
