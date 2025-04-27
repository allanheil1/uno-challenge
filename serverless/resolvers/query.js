const { getTasksByName } = require("../repositories/taskRepository");

/**
 * Retorna a lista de itens, opcionalmente filtrada por um nome (case-insensitive).
 *
 * @param {any} _
 * @param {{ filter?: { name?: string } }} args – pode vir um objeto { name } - que seria o filtro por nome.
 * @param {{ TODO_LIST: Array }} context
 * @returns {Array<{id: number, name: string}>}
 */
function getTasksResolver(_, { filter }, { TODO_LIST }) {
  if (filter && filter.name) {
    return getTasksByName(filter.name);
  }

  return TODO_LIST;
}

module.exports = {
  getTasksResolver,
};
