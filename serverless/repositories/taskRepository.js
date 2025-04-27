const { TODO_LIST } = require("../data/makeData");
const { DuplicateError, NotFoundError } = require("../errorHandler");

/**
 * Valida se já existe um item com o mesmo nome.
 *
 * @param {string} name
 * @throws {DuplicateError}
 */
const validateTaskExists = (name) => {
  const exists = TODO_LIST.some((item) => item.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) {
    throw new DuplicateError("Já existe um item com esse nome");
  }
};

/**
 * Valida se o item com o id informado existe na lista.
 *
 * @param {number} id
 * @throws {NotFoundError}
 */
const validateItemFound = (id) => {
  const item = TODO_LIST.find((item) => item.id === id);
  if (!item) {
    throw new NotFoundError("Item não encontrado");
  }
};

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
  validateItemFound(id);
  const itemIndex = TODO_LIST.findIndex((item) => item.id === id);
  TODO_LIST[itemIndex].name = name.trim();
  return TODO_LIST[itemIndex];
};

/**
 * Marca uma tarefa como completa.
 *
 * @param {number} id - ID da tarefa a ser atualizada.
 * @returns {Object} - Retorna a tarefa atualizada.
 */
const completeTask = (id) => {
  validateItemFound(id);
  const task = TODO_LIST.find((item) => item.id === id);
  task.completed = true;
  return task;
};

/**
 * Exclui uma tarefa da lista TODO_LIST pelo ID.
 *
 * @param {number} id - ID da tarefa a ser excluída.
 * @returns {Object} - Retorna a tarefa excluída.
 */
const deleteTask = (id) => {
  validateItemFound(id);
  const index = TODO_LIST.findIndex((item) => item.id === id);
  return TODO_LIST.splice(index, 1)[0];
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
  validateTaskExists,
  validateItemFound,
  addTask,
  updateTask,
  completeTask,
  deleteTask,
  getTasksByName,
};
