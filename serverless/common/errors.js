/**
 * Módulo de tratamento de erros da aplicação.
 */

/**
 * Classe base para erros.
 */
class AppError extends Error {
  /**
   * @param {string} message - Mensagem de erro.
   * @param {string} code    - Código do erro.
   */
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro de validação de entrada.
 */
class ValidationError extends AppError {
  /**
   * @param {string} message - Mensagem de validação.
   */
  constructor(message) {
    super(message, "VALIDATION_ERROR");
  }
}

/**
 * Erro de duplicação de recurso.
 */
class DuplicateError extends AppError {
  /**
   * @param {string} message - Mensagem de duplicação.
   */
  constructor(message) {
    super(message, "DUPLICATE_ERROR");
  }
}

/**
 * Erro de item não encontrado.
 */
class NotFoundError extends AppError {
  /**
   * @param {string} message - Mensagem de item não encontrado.
   */
  constructor(message) {
    super(message, "NOT_FOUND_ERROR");
  }
}

/**
 * Trata um erro e retorna um objeto de resposta.
 *
 * @param {Error} err - Erro capturado.
 * @returns {{ status: string, message: string, code?: string }}
 */
function errorHandler(err) {
  if (err instanceof AppError) {
    return {
      status: "error",
      message: err.message,
      code: err.code,
    };
  }

  console.error("Erro inesperado:", err);

  return {
    status: "error",
    message: "Ocorreu um erro interno no servidor",
    code: "INTERNAL_ERROR",
  };
}

module.exports = {
  AppError,
  ValidationError,
  DuplicateError,
  NotFoundError,
  errorHandler,
};
