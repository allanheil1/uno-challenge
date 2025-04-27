const { errorHandler } = require("../errorHandler");
const { validateTaskName, validateTaskExists, validateItemFound } = require("../validators/validators");
const { addTask, updateTask, deleteTask, completeTask } = require("../repositories/taskRepository");

/**
 * Adiciona um item à lista de tarefas.
 *
 * @param {any}   _
 * @param {Object} args
 * @param {Object} args.values           – objeto contendo os dados do item a ser inserido
 * @param {string} args.values.name      – nome do novo item
 * @param {Object} context               – contexto injetado pelo Apollo
 * @param {Array}  context.TODO_LIST
 * @param {Function} context.getRandomInt
 * @returns {Object} – status, mensagem e opcionalmente código de erro
 */
function addTaskResolver(_, { values: { name } }, { TODO_LIST, getRandomInt }) {
  try {
    validateTaskName(name);
    validateTaskExists(name, TODO_LIST);

    addTask(name, getRandomInt);

    return {
      status: "success",
      message: "Item adicionado com sucesso!",
    };
  } catch (err) {
    return errorHandler(err);
  }
}

/**
 * Atualiza o nome de uma tarefa existente.
 *
 * @param {any}    _
 * @param {{ values: { id: number, name: string } }} args
 * @param {{ TODO_LIST: Array }} context
 * @returns {Object} – status, mensagem e opcionalmente código de erro
 */
function updateTaskResolver(_, { values: { id, name } }, { TODO_LIST }) {
  try {
    validateItemFound(id, TODO_LIST);
    validateTaskName(name);

    updateTask(id, name);

    return {
      status: "success",
      message: "Item atualizado com sucesso!",
    };
  } catch (err) {
    return errorHandler(err);
  }
}

/**
 * Remove um item pelo id.
 *
 * @param {any} _
 * @param {{ id: number }} args – objeto com o id a remover
 * @param {{ TODO_LIST: Array }} context
 * @returns {Object} – status, mensagem e opcionalmente código de erro
 */
function deleteTaskResolver(_, { id }, { TODO_LIST }) {
  try {
    validateItemFound(id, TODO_LIST);

    deleteTask(id);

    return {
      status: "success",
      message: "Item removido com sucesso!",
    };
  } catch (err) {
    return errorHandler(err);
  }
}

/**
 * Marca uma tarefa como concluída.
 *
 * @param {any} _ - Parâmetro padrão do Apollo
 * @param {Object} args - Contém os dados para completar a tarefa (id)
 * @param {Array} TODO_LIST - A lista de tarefas
 * @returns {Object} - Status e mensagem
 */
function completeTaskResolver(_, { id }, { TODO_LIST }) {
  try {
    validateItemFound(id, TODO_LIST);
    completeTask(id);
    return {
      status: "success",
      message: "Tarefa concluída com sucesso!",
    };
  } catch (err) {
    return errorHandler(err);
  }
}

module.exports = {
  addTaskResolver,
  updateTaskResolver,
  deleteTaskResolver,
  completeTaskResolver,
};
