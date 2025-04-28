// serverless/tests/resolvers.test.js

const { ApolloServer } = require("@apollo/server");
const { typeDefs } = require("../graphql/typeDefs");
const { getTasksResolver } = require("../resolvers/query");
const { addTaskResolver, updateTaskResolver, deleteTaskResolver, completeTaskResolver } = require("../resolvers/mutation");
const { TODO_LIST } = require("../data/makeData");

// Requisições Graphql
const GET_TODO_LIST = `
  query todoList($filter: ItemFilter) {
    todoList(filter: $filter) {
      id
      name
      completed
    }
  }
`;
const ADD_ITEM = `
  mutation addItem($values: ItemInput) {
    addItem(values: $values) {
      status
      message
      code
    }
  }
`;
const UPDATE_ITEM = `
  mutation updateItem($values: ItemInput) {
    updateItem(values: $values) {
      status
      message
      code
    }
  }
`;
const DELETE_ITEM = `
  mutation deleteItem($id: Int!) {
    deleteItem(id: $id) {
      status
      message
      code
    }
  }
`;
const COMPLETE_ITEM = `
  mutation completeItem($id: Int!) {
    completeItem(id: $id) {
      status
      message
      code
    }
  }
`;

describe("GraphQL Resolvers", () => {
  let server;

  // Estado inicial previsível
  const initial = [
    { id: 1, name: "Item 1", completed: false },
    { id: 2, name: "Item 2", completed: false },
  ];

  // Contexto compartilhado
  const ctx = {
    TODO_LIST,
    getRandomInt: () => 3, // Gera id=3 sempre
  };

  // Operações realizadas antes de executar os qualquer teste
  beforeAll(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers: {
        Query: { todoList: getTasksResolver },
        Mutation: {
          addItem: addTaskResolver,
          updateItem: updateTaskResolver,
          deleteItem: deleteTaskResolver,
          completeItem: completeTaskResolver,
        },
      },
      context: () => ctx,
    });
    await server.start();
  });

  // Operações realizadas antes de executar cada um dos testes
  beforeEach(() => {
    // resetar TODO_LIST antes de cada it
    TODO_LIST.length = 0;
    initial.forEach((item) => TODO_LIST.push({ ...item }));
  });

  // Operações executadas depois de realizar todos os testes (fechar o server)
  afterAll(async () => {
    await server.stop();
  });

  //
  // —— TESTES DE SUCESSO ——
  //

  it("Deve listar todos os itens (todoList)", async () => {
    const res = await server.executeOperation({ query: GET_TODO_LIST, variables: { filter: null } }, { contextValue: ctx });
    const { data, errors } = res.body.singleResult;
    expect(errors).toBeUndefined();
    expect(data.todoList).toEqual(initial);
  });

  it("Deve adicionar um item (addItem)", async () => {
    const res = await server.executeOperation(
      { query: ADD_ITEM, variables: { values: { name: "Novo Item" } } },
      { contextValue: ctx }
    );
    const { data, errors } = res.body.singleResult;
    expect(errors).toBeUndefined();
    expect(data.addItem.status).toBe("success");
    expect(TODO_LIST).toContainEqual({ id: 3, name: "Novo Item", completed: false });
  });

  it("Deve atualizar um item (updateItem)", async () => {
    const res = await server.executeOperation(
      { query: UPDATE_ITEM, variables: { values: { id: 1, name: "Item Atualizado" } } },
      { contextValue: ctx }
    );
    const { data, errors } = res.body.singleResult;
    expect(errors).toBeUndefined();
    expect(data.updateItem.status).toBe("success");
    expect(TODO_LIST.find((i) => i.id === 1).name).toBe("Item Atualizado");
  });

  it("Deve excluir um item (deleteItem)", async () => {
    const res = await server.executeOperation({ query: DELETE_ITEM, variables: { id: 2 } }, { contextValue: ctx });
    const { data, errors } = res.body.singleResult;
    expect(errors).toBeUndefined();
    expect(data.deleteItem.status).toBe("success");
    expect(TODO_LIST.some((i) => i.id === 2)).toBe(false);
  });

  it("Deve completar um item (completeItem)", async () => {
    const res = await server.executeOperation({ query: COMPLETE_ITEM, variables: { id: 1 } }, { contextValue: ctx });
    const { data, errors } = res.body.singleResult;
    expect(errors).toBeUndefined();
    expect(data.completeItem.status).toBe("success");
    expect(TODO_LIST.find((i) => i.id === 1).completed).toBe(true);
  });

  //
  // —— TESTES DE ERRO ——
  //

  it("Erro ao adicionar com nome < 3 caracteres", async () => {
    const res = await server.executeOperation({ query: ADD_ITEM, variables: { values: { name: "ab" } } }, { contextValue: ctx });
    const { data, errors } = res.body.singleResult;
    expect(errors).toBeUndefined();
    expect(data.addItem.status).toBe("error");
    expect(data.addItem.code).toBe("VALIDATION_ERROR");
    expect(data.addItem.message).toMatch(/pelo menos 3/);
  });

  it("Erro ao adicionar item duplicado", async () => {
    // "Item 1" já existe no initial
    const res = await server.executeOperation(
      { query: ADD_ITEM, variables: { values: { name: "Item 1" } } },
      { contextValue: ctx }
    );
    const { data, errors } = res.body.singleResult;
    expect(errors).toBeUndefined();
    expect(data.addItem.status).toBe("error");
    expect(data.addItem.code).toBe("DUPLICATE_ERROR");
    expect(data.addItem.message).toBe("Já existe um item com esse nome");
  });

  it("Erro ao atualizar com id inválido (<1)", async () => {
    const res = await server.executeOperation(
      { query: UPDATE_ITEM, variables: { values: { id: 0, name: "Nome Válido" } } },
      { contextValue: ctx }
    );
    const { data } = res.body.singleResult;
    expect(data.updateItem.status).toBe("error");
    expect(data.updateItem.code).toBe("VALIDATION_ERROR");
    expect(data.updateItem.message).toMatch(/maior ou igual a 1/);
  });

  it("Erro ao atualizar item que não existe", async () => {
    const res = await server.executeOperation(
      { query: UPDATE_ITEM, variables: { values: { id: 999, name: "Nome Válido" } } },
      { contextValue: ctx }
    );
    const { data } = res.body.singleResult;
    expect(data.updateItem.status).toBe("error");
    expect(data.updateItem.code).toBe("NOT_FOUND_ERROR");
    expect(data.updateItem.message).toBe("Item não encontrado");
  });

  it("Erro ao atualizar com nome < 3 caracteres", async () => {
    const res = await server.executeOperation(
      { query: UPDATE_ITEM, variables: { values: { id: 1, name: "xy" } } },
      { contextValue: ctx }
    );
    const { data } = res.body.singleResult;
    expect(data.updateItem.status).toBe("error");
    expect(data.updateItem.code).toBe("VALIDATION_ERROR");
    expect(data.updateItem.message).toMatch(/pelo menos 3/);
  });

  it("Erro ao deletar item que não existe", async () => {
    const res = await server.executeOperation({ query: DELETE_ITEM, variables: { id: 999 } }, { contextValue: ctx });
    const { data } = res.body.singleResult;
    expect(data.deleteItem.status).toBe("error");
    expect(data.deleteItem.code).toBe("NOT_FOUND_ERROR");
    expect(data.deleteItem.message).toBe("Item não encontrado");
  });

  it("Erro ao deletar com id inválido", async () => {
    const res = await server.executeOperation({ query: DELETE_ITEM, variables: { id: 0 } }, { contextValue: ctx });
    const { data } = res.body.singleResult;
    expect(data.deleteItem.status).toBe("error");
    expect(data.deleteItem.code).toBe("VALIDATION_ERROR");
    expect(data.deleteItem.message).toMatch(/maior ou igual a 1/);
  });

  it("Erro ao completar item que não existe", async () => {
    const res = await server.executeOperation({ query: COMPLETE_ITEM, variables: { id: 999 } }, { contextValue: ctx });
    const { data } = res.body.singleResult;
    expect(data.completeItem.status).toBe("error");
    expect(data.completeItem.code).toBe("NOT_FOUND_ERROR");
    expect(data.completeItem.message).toBe("Item não encontrado");
  });

  it("Erro ao completar com id inválido", async () => {
    const res = await server.executeOperation({ query: COMPLETE_ITEM, variables: { id: 0 } }, { contextValue: ctx });
    const { data } = res.body.singleResult;
    expect(data.completeItem.status).toBe("error");
    expect(data.completeItem.code).toBe("VALIDATION_ERROR");
    expect(data.completeItem.message).toMatch(/maior ou igual a 1/);
  });
});
