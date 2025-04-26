const errorHandler = require("../errorHandler"); // Importando o erroHandler

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
 * @returns {Object} – status e mensagem
 * @throws {Error}                      – caso não passe nas validações - o "name" for vazio ou duplicado
 */
function addItem(_, { values: { name } }, { TODO_LIST, getRandomInt }) {
  try {
    if (!name || !name.trim()) {
      throw new Error("O nome do item não pode ser vazio");
    }

    const exists = TODO_LIST.some((item) => item.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) {
      throw new Error("Já existe um item com esse nome");
    }

    TODO_LIST.push({
      id: getRandomInt(),
      name: name.trim(),
    });

    return {
      status: "success",
      message: "Item adicionado com sucesso!",
    };
  } catch (err) {
    return errorHandler(err); // Passa o erro pelo handler
  }
}

/**
 * Atualiza o nome de um item existente.
 *
 * @param {any}    _
 * @param {{ values: { id: number, name: string } }} args
 * @param {{ TODO_LIST: Array }} context
 * @returns {Object} – status e mensagem
 * @throws {Error} – se id não existir ou "name" for vazio
 */
function updateItem(_, { values: { id, name } }, { TODO_LIST }) {
  try {
    if (!name || !name.trim()) {
      throw new Error("O nome do item não pode ser vazio");
    }

    const idx = TODO_LIST.findIndex((item) => item.id === id);
    if (idx === -1) {
      throw new Error("Item não encontrado");
    }

    TODO_LIST[idx].name = name.trim();

    return {
      status: "success",
      message: "Item atualizado com sucesso!",
    };
  } catch (err) {
    return errorHandler(err); // Passa o erro pelo handler
  }
}

/**
 * Remove um item pelo id.
 *
 * @param {any} _
 * @param {{ id: number }} args – objeto com o id a remover
 * @param {{ TODO_LIST: Array }} context
 * @returns {Object} – status e mensagem
 * @throws {Error} – se não encontrar item com esse id
 */
function deleteItem(_, { id }, { TODO_LIST }) {
  try {
    const before = TODO_LIST.length;

    const filtered = TODO_LIST.filter((item) => item.id !== id);

    TODO_LIST.length = 0;
    TODO_LIST.push(...filtered);

    if (filtered.length === before) {
      throw new Error("Item não encontrado para remoção");
    }

    return {
      status: "success",
      message: "Item removido com sucesso!",
    };
  } catch (err) {
    return errorHandler(err); // Passa o erro pelo handler
  }
}

module.exports = {
  addItem,
  updateItem,
  deleteItem,
};
