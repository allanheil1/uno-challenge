const Joi = require("joi");
const { ValidationError } = require("../errorHandler");

// Schema para requisição de “addItem”
const addTaskSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "O nome deve ser um texto",
    "string.empty": "O nome não pode ficar em branco",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres",
    "string.max": "O nome deve ter no máximo {#limit} caracteres",
    "any.required": "O nome é obrigatório",
  }),
});

// Schema para requisição de “updateItem”
const updateTaskSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "O ID deve ser um número",
    "number.integer": "O ID deve ser um número inteiro",
    "number.min": "O ID deve ser maior ou igual a {#limit}",
    "any.required": "O ID é obrigatório",
  }),
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "O nome deve ser um texto",
    "string.empty": "O nome não pode ficar em branco",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres",
    "string.max": "O nome deve ter no máximo {#limit} caracteres",
    "any.required": "O nome é obrigatório",
  }),
});

// Schema para requisição de “deleteItem”
const deleteTaskSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "O ID deve ser um número",
    "number.integer": "O ID deve ser um número inteiro",
    "number.min": "O ID deve ser maior ou igual a {#limit}",
    "any.required": "O ID é obrigatório",
  }),
});

// Schema para requisição de “completeItem”
const completeTaskSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "O ID deve ser um número",
    "number.integer": "O ID deve ser um número inteiro",
    "number.min": "O ID deve ser maior ou igual a {#limit}",
    "any.required": "O ID é obrigatório",
  }),
});

// Funções de validação
const validateAddTaskInput = (input) => {
  const { error } = addTaskSchema.validate(input);
  if (error) throw new ValidationError(error.message);
};

const validateUpdateTaskInput = (input) => {
  const { error } = updateTaskSchema.validate(input);
  if (error) throw new ValidationError(error.message);
};

const validateDeleteTaskInput = (input) => {
  const { error } = deleteTaskSchema.validate(input);
  if (error) throw new ValidationError(error.message);
};

const validateCompleteTaskInput = (input) => {
  const { error } = completeTaskSchema.validate(input);
  if (error) throw new ValidationError(error.message);
};

module.exports = {
  validateAddTaskInput,
  validateUpdateTaskInput,
  validateDeleteTaskInput,
  validateCompleteTaskInput,
};
