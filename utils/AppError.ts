export class AppError extends Error {
  public status: number;
  public fieldErrors?: { [key: string]: string }; // Erros específicos de campo (opcional)

  constructor(message: string, status: number, fieldErrors?: { [key: string]: string }) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

