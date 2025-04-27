const { errorHandler } = require("../errorHandler");
const { addTaskService, updateTaskService, completeTaskService, deleteTaskService } = require("../services/taskService");

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
async function addTaskResolver(_, { values: { name } }, { TODO_LIST, getRandomInt }) {
  try {
    addTaskService(name, TODO_LIST, getRandomInt);
    return {
      status: "success",
      message: "Item adicionado com sucesso!",
      code: "OK",
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
async function updateTaskResolver(_, { values: { id, name } }, { TODO_LIST }) {
  try {
    updateTaskService(id, name, TODO_LIST);
    return {
      status: "success",
      message: "Item atualizado com sucesso!",
      code: "OK",
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
async function deleteTaskResolver(_, { id }, { TODO_LIST }) {
  try {
    deleteTaskService(id, TODO_LIST);
    return {
      status: "success",
      message: "Item removido com sucesso!",
      code: "OK",
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
async function completeTaskResolver(_, { id }, { TODO_LIST }) {
  try {
    completeTaskService(id, TODO_LIST);
    return {
      status: "success",
      message: "Tarefa concluída com sucesso!",
      code: "OK",
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
