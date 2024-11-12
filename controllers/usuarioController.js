const usuarioService = require('../services/usuarioService');

const obterUsuario = async (req, res, next) => {
    try {
        const usuario = await usuarioService.obterUsuario(req.params.idUser);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

const atualizarUsuario = async (req, res, next) => {
    try {
        const usuarioAtualizado = await usuarioService.atualizarUsuario(req.params.idUser, req.body);
        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obterUsuario,
    atualizarUsuario,
};
