const { TODO_LIST } = require("../data/makeData");
const { NotFoundError } = require("../errorHandler");

/**
 * Adiciona uma tarefa à lista TODO_LIST.
 *
 * @param {string} name - Nome da tarefa que será adicionada.
 * @param {Function} getRandomInt - Função para gerar um ID aleatório.
 * @returns {Object} - Retorna a tarefa adicionado com id e nome.
 */
const addTask = (name, getRandomInt) => {
  // Cria uma nova tarefa com id aleatório e nome fornecido
  const newTask = {
    id: getRandomInt(),
    name: name.trim(),
    completed: false,
  };
  TODO_LIST.push(newTask); // Adiciona a tarefa na lista
  return newTask; // Retorna a tarefa adicionada
};

/**
 * Atualiza o nome de uma tarefa existente na lista TODO_LIST.
 *
 * @param {number} id - ID da tarefa a ser atualizado.
 * @param {string} name - Novo nome para a tarefa.
 * @returns {Object} - Retorna a tarefa atualizada com id e novo nome.
 */
const updateTask = (id, name) => {
  const itemIndex = TODO_LIST.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new NotFoundError("Item não encontrado");
  }
  // Atualiza o nome da tarefa
  TODO_LIST[itemIndex].name = name.trim();
  return TODO_LIST[itemIndex]; // Retorna a tarefa atualizada
};

/**
 * Marca uma tarefa como completa.
 *
 * @param {number} id - ID da tarefa a ser atualizada.
 * @returns {Object} - Retorna a tarefa atualizada.
 */
const completeTask = (id) => {
  const itemIndex = TODO_LIST.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new NotFoundError("Item não encontrado");
  }
  // Marca como completa
  TODO_LIST[itemIndex].completed = true;
  return TODO_LIST[itemIndex]; // Retorna a tarefa atualizada
};

/**
 * Exclui uma tarefa da lista TODO_LIST pelo ID.
 *
 * @param {number} id - ID da tarefa a ser excluída.
 * @returns {Object} - Retorna a tarefa excluída.
 */
const deleteTask = (id) => {
  const itemIndex = TODO_LIST.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new NotFoundError("Item não encontrado para remoção");
  }
  // Remove a tarefa da lista
  const deletedItem = TODO_LIST.splice(itemIndex, 1)[0];
  return deletedItem;
};

/**
 * Filtra as tarefas da lista TODO_LIST com base no nome.
 *
 * @param {string} filterName - Nome da tarefa para filtrar.
 * @returns {Array} - Lista filtrada de tarefas.
 */
const getTasksByName = (filterName) => {
  return TODO_LIST.filter((item) => item.name.toLowerCase().includes(filterName.toLowerCase().trim()));
};

module.exports = {
  addTask,
  updateTask,
  completeTask,
  deleteTask,
  getTasksByName,
};
