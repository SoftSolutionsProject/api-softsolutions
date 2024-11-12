const mongoose = require('mongoose');

const InscricaoSchema = new mongoose.Schema({
    statusInscricao: {
        type: Number,
        required: true,
        default: 0
    },
    _idModulo: {
        type: Number,
        required: true
    },
    _idUser: {
        type: Number,
        required: true
    },
    dataInscricao: {
        type: Date,
        default: Date.now
    }
});

// Índice único para evitar inscrições duplicadas
InscricaoSchema.index({ _idUser: 1, _idModulo: 1 }, { unique: true });

module.exports = mongoose.model('Inscricao', InscricaoSchema);
