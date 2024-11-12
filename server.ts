import 'dotenv/config'; // Carrega o arquivo .env automaticamente
import express, { Application } from 'express';
import cors from 'cors';
import connectDatabase from './config/database';
import inscricaoRoutes from './routes/inscricaoRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import errorHandler from './middlewares/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectDatabase();

app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
