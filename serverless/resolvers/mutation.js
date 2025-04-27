const { errorHandler } = require("../errorHandler");
const { validateTaskName, validateTaskExists, validateItemFound } = require("../validators/validators");

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
function addItem(_, { values: { name } }, { TODO_LIST, getRandomInt }) {
  try {
    validateTaskName(name);
    validateTaskExists(name, TODO_LIST);

    TODO_LIST.push({
      id: getRandomInt(),
      name: name.trim(),
    });

    return {
      status: "success",
      message: "Item adicionado com sucesso!",
    };
  } catch (err) {
    return errorHandler(err);
  }
}

/**
 * Atualiza o nome de um item existente.
 *
 * @param {any}    _
 * @param {{ values: { id: number, name: string } }} args
 * @param {{ TODO_LIST: Array }} context
 * @returns {Object} – status, mensagem e opcionalmente código de erro
 */
function updateItem(_, { values: { id, name } }, { TODO_LIST }) {
  try {
    validateItemFound(id, TODO_LIST);
    validateTaskName(name);

    const idx = TODO_LIST.findIndex((item) => item.id === id);
    TODO_LIST[idx].name = name.trim();

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
function deleteItem(_, { id }, { TODO_LIST }) {
  try {
    validateItemFound(id, TODO_LIST);

    const filtered = TODO_LIST.filter((item) => item.id !== id);

    TODO_LIST.length = 0;
    TODO_LIST.push(...filtered);

    return {
      status: "success",
      message: "Item removido com sucesso!",
    };
  } catch (err) {
    return errorHandler(err);
  }
}

module.exports = {
  addItem,
  updateItem,
  deleteItem,
};
