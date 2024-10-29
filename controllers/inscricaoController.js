const Inscricao = require('../models/Inscricao');

// Inscrever-se em um curso (POST)
const inscreverCurso = async (req, res) => {
    const { _idModulo, _idUser } = req.body;

    try {
        // Verifica se já existe uma inscrição com o mesmo idUser e idModulo
        const inscricaoExistente = await Inscricao.findOne({ _idUser, _idModulo });
        if (inscricaoExistente) {
            return res.status(400).json({ message: 'Usuário já está inscrito neste módulo.' });
        }

        const novaInscricao = new Inscricao({
            statusInscricao: 0,
            _idModulo,
            _idUser
        });

        // Salva a nova inscrição no banco
        await novaInscricao.save();
        res.status(201).json(novaInscricao);
    } catch (error) {
        console.error('Erro ao se inscrever no curso:', error);
        res.status(500).json({ message: 'Erro ao se inscrever no curso', error });
    }
};

// Obter inscrições de um usuário (GET)
const obterInscricoes = async (req, res) => {
    const idUser = req.params.idUser; // Obtém o ID do usuário

    try {
        const inscricoes = await Inscricao.find({ _idUser: idUser });
        if (inscricoes.length === 0) {
            return res.status(404).json({ message: 'Nenhuma inscrição encontrada para este usuário.' });
        }
        res.json(inscricoes);
    } catch (error) {
        console.error('Erro ao obter inscrições:', error);
        res.status(500).json({ message: 'Erro ao obter inscrições', error });
    }
};

// Cancelar inscrição em um curso (DELETE)
const cancelarInscricao = async (req, res) => {
    const { idUser, idModulo } = req.params; // Obtém os IDs

    try {
        const resultado = await Inscricao.findOneAndDelete({ _idUser: idUser, _idModulo: idModulo });

        if (!resultado) {
            return res.status(404).json({ message: 'Inscrição não encontrada' });
        }

        res.json({ message: 'Inscrição cancelada com sucesso' });
    } catch (error) {
        console.error('Erro ao cancelar a inscrição:', error);
        res.status(500).json({ message: 'Erro ao cancelar a inscrição', error });
    }
};

module.exports = {
    inscreverCurso,
    obterInscricoes,
    cancelarInscricao,
};
