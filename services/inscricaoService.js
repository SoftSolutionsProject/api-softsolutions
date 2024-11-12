const Inscricao = require('../models/Inscricao');
const { validateInscricaoData } = require('../utils/validations');

const inscreverCurso = async ({ _idModulo, _idUser }) => {
    validateInscricaoData({ _idModulo, _idUser });
    const inscricaoExistente = await Inscricao.findOne({ _idUser, _idModulo });
    if (inscricaoExistente) {
        const error = new Error('Usuário já está inscrito neste módulo.');
        error.status = 400;
        throw error;
    }
    return await new Inscricao({ statusInscricao: 0, _idModulo, _idUser }).save();
};

const obterInscricoes = async (idUser) => {
    const inscricoes = await Inscricao.find({ _idUser: idUser });
    if (inscricoes.length === 0) {
        const error = new Error('Nenhuma inscrição encontrada para este usuário.');
        error.status = 404;
        throw error;
    }
    return inscricoes;
};

const cancelarInscricao = async (idUser, idModulo) => {
    const resultado = await Inscricao.findOneAndDelete({ _idUser: idUser, _idModulo: idModulo });
    if (!resultado) {
        const error = new Error('Inscrição não encontrada');
        error.status = 404;
        throw error;
    }
};

module.exports = {
    inscreverCurso,
    obterInscricoes,
    cancelarInscricao,
};
