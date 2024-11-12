const Usuario = require('../models/Usuario');
const { validateUsuarioData } = require('../utils/validations');

const obterUsuario = async (idUser) => {
    const usuario = await Usuario.findOne({ _idUser: idUser });
    if (!usuario) {
        const error = new Error('Usuário não encontrado');
        error.status = 404;
        throw error;
    }
    return usuario;
};

const atualizarUsuario = async (idUser, data) => {
    validateUsuarioData(data);
    const usuarioAtualizado = await Usuario.findOneAndUpdate({ _idUser: idUser }, data, { new: true });
    if (!usuarioAtualizado) {
        const error = new Error('Usuário não encontrado');
        error.status = 404;
        throw error;
    }
    return usuarioAtualizado;
};

module.exports = {
    obterUsuario,
    atualizarUsuario,
};
