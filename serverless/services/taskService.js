const { validateTaskName, validateTaskExists, validateItemFound } = require("../validators/validators");
const repo = require("../repositories/taskRepository");

/**
 * Aplica validações de negócio e adiciona uma tarefa.
 */
function addTaskService(name, TODO_LIST, getRandomInt) {
  validateTaskName(name);
  validateTaskExists(name, TODO_LIST);
  return repo.addTask(name, getRandomInt);
}

/**
 * Aplica validações de negócio e atualiza uma tarefa.
 */
function updateTaskService(id, name, TODO_LIST) {
  validateItemFound(id, TODO_LIST);
  validateTaskName(name);
  return repo.updateTask(id, name);
}

/**
 * Aplica validações de negócio e marca tarefa como concluída.
 */
function completeTaskService(id, TODO_LIST) {
  validateItemFound(id, TODO_LIST);
  return repo.completeTask(id);
}

/**
 * Aplica validações de negócio e remove uma tarefa.
 */
function deleteTaskService(id, TODO_LIST) {
  validateItemFound(id, TODO_LIST);
  return repo.deleteTask(id);
}

/**
 * Retorna lista de tarefas, com ou sem filtro de nome.
 */
function getTasksService(filter, TODO_LIST) {
  if (filter?.name) {
    return repo.getTasksByName(filter.name);
  }
  return TODO_LIST;
}

module.exports = {
  addTaskService,
  updateTaskService,
  completeTaskService,
  deleteTaskService,
  getTasksService,
};
