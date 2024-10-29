const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  _idUser: {
    type: Number,
    required: true,
    unique: true,
  },
  tipo: {
    type: String,
    enum: ['administrador', 'aluno'],
    required: true,
  },
  nomeUsuario: {
    type: String,
    required: true,
  },
  cpfUsuario: {
    type: Number,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telefone: {
    type: String,
  },
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    estado: String,
    pais: String,
  },
  localizacao: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
