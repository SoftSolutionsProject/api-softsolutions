require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Importar o pacote CORS

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors({
  origin: ['http://localhost:4200', 'https://softsol-softsolutions-projects.vercel.app', 'https://softsol.vercel.app/'],  // Permitir o frontend Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
   // Permitir o envio de cookies e cabeçalhos de autenticação, se necessário
}));

// Conectar ao MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB', err));

// Importar rotas de inscrição
const inscricaoRoutes = require('./routes/inscricaoRoutes');
app.use('/api/inscricoes', inscricaoRoutes);

// Importar rotas de usuário
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
