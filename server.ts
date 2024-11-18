import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import connectDatabase from './config/database';
import inscricaoRoutes from './routes/inscricaoRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import errorHandler from './middlewares/errorHandler';
import { setupSwagger } from './config/swagger';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(cors());

// Conexão com o banco de dados
connectDatabase();

// Rotas
app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Middleware de erro (mantenha por último)
app.use(errorHandler);

//Swagger
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});