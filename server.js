require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

const inscricaoRoutes = require('./routes/inscricaoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:4200', 'https://softsol-softsolutions-projects.vercel.app', 'https://softsol.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

connectDatabase();

app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
