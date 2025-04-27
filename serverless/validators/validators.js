const Joi = require("joi");
const { ValidationError, DuplicateError, NotFoundError } = require("../errorHandler");

// Validação para o nome da tarefa: mínimo de 3 caracteres e máximo de 100
const taskNameSchema = Joi.string().min(3).max(100).required();

/**
 * Valida se o nome da tarefa está dentro dos limites permitidos.
 *
 * @param {string} name
 * @throws {ValidationError}
 */
const validateTaskName = (name) => {
  const { error } = taskNameSchema.validate(name);
  if (error) {
    throw new ValidationError("Nome da tarefa deve ter entre 3 e 100 caracteres");
  }
};

/**
 * Valida se já existe um item com o mesmo nome.
 *
 * @param {string} name
 * @param {Array} TODO_LIST
 * @throws {DuplicateError}
 */
const validateTaskExists = (name, TODO_LIST) => {
  const exists = TODO_LIST.some((item) => item.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) {
    throw new DuplicateError("Já existe um item com esse nome");
  }
};

/**
 * Valida se o item com o id informado existe na lista.
 *
 * @param {number} id
 * @param {Array} TODO_LIST
 * @throws {NotFoundError}
 */
const validateItemFound = (id, TODO_LIST) => {
  const item = TODO_LIST.find((item) => item.id === id);
  if (!item) {
    throw new NotFoundError("Item não encontrado");
  }
};

module.exports = {
  validateTaskName,
  validateTaskExists,
  validateItemFound,
};
