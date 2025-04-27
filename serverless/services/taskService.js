const repo = require("../repositories/taskRepository");

/**
 * Aplica validações de negócio (duplicidade) e adiciona uma tarefa.
 */
function addTaskService(name, TODO_LIST, getRandomInt) {
  repo.validateTaskExists(name, TODO_LIST);
  return repo.addTask(name, getRandomInt);
}

/**
 * Aplica validações de negócio (existência) e atualiza uma tarefa.
 */
function updateTaskService(id, name, TODO_LIST) {
  repo.validateItemFound(id, TODO_LIST);
  return repo.updateTask(id, name);
}

/**
 * Aplica validações de negócio (existência) e marca tarefa como concluída.
 */
function completeTaskService(id, TODO_LIST) {
  repo.validateItemFound(id, TODO_LIST);
  return repo.completeTask(id);
}

/**
 * Aplica validações de negócio (existência) e remove uma tarefa.
 */
function deleteTaskService(id, TODO_LIST) {
  repo.validateItemFound(id, TODO_LIST);
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
