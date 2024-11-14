declare namespace Express {
    export interface Request {
      user?: {
        _idUser: number;
        tipo: string;
      }
    }
  }