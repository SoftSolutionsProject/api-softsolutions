import mongoose from 'mongoose';

const connectTestDatabase = async (): Promise<void> => {
  const mongoUri = 'mongodb://localhost:27017/softsolutions_test';

  try {
    await mongoose.connect(mongoUri, { dbName: 'softsolutions_test' });
    console.log('Conectado ao MongoDB (testes)');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB (testes)', error);
    process.exit(1);
  }
};

const disconnectTestDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase(); // Limpa os dados após cada teste
  await mongoose.disconnect();
};

export { connectTestDatabase, disconnectTestDatabase,};