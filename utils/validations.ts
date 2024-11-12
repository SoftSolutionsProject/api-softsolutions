export const validateInscricaoData = ({ _idModulo, _idUser }: { _idModulo: number; _idUser: number }): void => {
    if (!_idModulo || !_idUser) {
      throw new Error('Dados de inscrição incompletos');
    }
  };
  