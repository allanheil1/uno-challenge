const { TODO_LIST } = require("../data/makeData");
const { NotFoundError } = require("../errorHandler");

/**
 * Adiciona um item à lista TODO_LIST.
 *
 * @param {string} name - Nome da tarefa que será adicionada.
 * @param {Function} getRandomInt - Função para gerar um ID aleatório.
 * @returns {Object} - Retorna o item adicionado com id e nome.
 */
const addTask = (name, getRandomInt) => {
  // Cria um novo item com id aleatório e nome fornecido
  const newItem = {
    id: getRandomInt(),
    name: name.trim(),
  };
  TODO_LIST.push(newItem); // Adiciona o item na lista
  return newItem; // Retorna o item adicionado
};

/**
 * Atualiza o nome de um item existente na lista TODO_LIST.
 *
 * @param {number} id - ID do item a ser atualizado.
 * @param {string} name - Novo nome para o item.
 * @returns {Object} - Retorna o item atualizado com id e novo nome.
 */
const updateTask = (id, name) => {
  const itemIndex = TODO_LIST.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new NotFoundError("Item não encontrado");
  }
  // Atualiza o nome do item
  TODO_LIST[itemIndex].name = name.trim();
  return TODO_LIST[itemIndex]; // Retorna o item atualizado
};

/**
 * Exclui um item da lista TODO_LIST pelo ID.
 *
 * @param {number} id - ID do item a ser excluído.
 * @returns {Object} - Retorna o item excluído.
 */
const deleteTask = (id) => {
  const itemIndex = TODO_LIST.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new NotFoundError("Item não encontrado para remoção");
  }
  // Remove o item da lista
  const deletedItem = TODO_LIST.splice(itemIndex, 1)[0]; // Remove e retorna o item excluído
  return deletedItem; // Retorna o item excluído
};

/**
 * Filtra os itens da lista TODO_LIST com base no nome.
 *
 * @param {string} filterName - Nome da tarefa para filtrar.
 * @returns {Array} - Lista filtrada de itens.
 */
const getTasksByName = (filterName) => {
  // Filtra os itens da lista TODO_LIST, caso o nome corresponda ao termo de pesquisa
  return TODO_LIST.filter((item) => item.name.toLowerCase().includes(filterName.toLowerCase().trim()));
};

module.exports = {
  addTask,
  updateTask,
  deleteTask,
  getTasksByName,
};
