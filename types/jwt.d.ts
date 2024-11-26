declare namespace Express {
    export interface Request {
      user?: {
        _idUser: number;
        tipo: string;
      }
    }
  }


declare module 'bcrypt';
declare module 'jsonwebtoken';
declare module 'nodemailer';
declare module 'swagger-jsdoc';
declare module 'swagger-ui-express';
