import mongoose from 'mongoose';

const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST_URI : process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("A variável de ambiente MONGO_URI não está definida.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`Conectado ao MongoDB (${process.env.NODE_ENV})`);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1);
  }
};

export default connectDatabase;
