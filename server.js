const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

app.get('/', (req, res) => {
    res.send('API SoftSolutions funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse: http://localhost:${PORT}`);
});