const validateInscricaoData = ({ _idModulo, _idUser }) => {
    if (!_idModulo || !_idUser) {
        throw new Error('Dados de inscrição incompletos');
    }
};

const validateUsuarioData = ({ nomeUsuario, email }) => {
    if (!nomeUsuario || !email) {
        throw new Error('Nome e email são obrigatórios');
    }
};

module.exports = {
    validateInscricaoData,
    validateUsuarioData,
};
