export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string = "Некорректный запрос") {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = "Необходима авторизация") {
    super(message);
    this.statusCode = 401;
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string = "Доступ запрещен") {
    super(message);
    this.statusCode = 403;
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string = "Ресурс не найден") {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string = "Конфликт данных") {
    super(message);
    this.statusCode = 409;
    this.name = "ConflictError";
  }
}

export class ServerError extends Error {
  statusCode: number;

  constructor(message: string = "На сервере произошла ошибка") {
    super(message);
    this.statusCode = 500;
    this.name = "ServerError";
  }
}
