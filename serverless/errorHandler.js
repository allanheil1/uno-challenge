function errorHandler(err) {
  if (err instanceof Error) {
    if (err.message.includes("Já existe um item com esse nome")) {
      return {
        status: "error",
        message: "Já existe um item com esse nome",
      };
    }

    if (err.message.includes("O nome do item não pode ser vazio")) {
      return {
        status: "error",
        message: "O nome do item não pode ser vazio",
      };
    }

    if (err.message.includes("Item não encontrado")) {
      return {
        status: "error",
        message: "Item não encontrado",
      };
    }

    return {
      status: "error",
      message: "Ocorreu um erro desconhecido",
    };
  }

  return {
    status: "error",
    message: "Erro inesperado",
  };
}

module.exports = errorHandler;
