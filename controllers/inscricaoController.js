const inscricaoService = require('../services/inscricaoService');

const inscreverCurso = async (req, res, next) => {
    try {
        const inscricao = await inscricaoService.inscreverCurso(req.body);
        res.status(201).json(inscricao);
    } catch (error) {
        next(error);
    }
};

const obterInscricoes = async (req, res, next) => {
    try {
        const inscricoes = await inscricaoService.obterInscricoes(req.params.idUser);
        res.status(200).json(inscricoes);
    } catch (error) {
        next(error);
    }
};

const cancelarInscricao = async (req, res, next) => {
    try {
        await inscricaoService.cancelarInscricao(req.params.idUser, req.params.idModulo);
        res.status(200).json({ message: 'Inscrição cancelada com sucesso' }); // Status 200 OK para ação bem-sucedida
    } catch (error) {
        next(error);
    }
};

module.exports = {
    inscreverCurso,
    obterInscricoes,
    cancelarInscricao,
};
