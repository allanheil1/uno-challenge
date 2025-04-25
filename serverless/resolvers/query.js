/**
 * Retorna a lista de itens, opcionalmente filtrada por um nome (case-insensitive).
 *
 * @param {any} _
 * @param {{ filter?: { name?: string } }} args – pode vir um objeto { name } - que seria o filtro por nome.
 * @param {{ TODO_LIST: Array }} context
 * @returns {Array<{id: number, name: string}>}
 */
function todoList(_, { filter }, { TODO_LIST }) {
  if (filter && filter.name) {
    const term = filter.name.toLowerCase().trim();
    return TODO_LIST.filter((item) => item.name.toLowerCase().includes(term));
  }

  return TODO_LIST;
}

module.exports = {
  todoList,
};
