const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefs } = require("./graphql/typeDefs");
const queryResolvers = require("./resolvers/query");
const mutationResolvers = require("./resolvers/mutation");
const { TODO_LIST } = require("./data/makeData");
const { getRandomInt } = require("./utils/getRandomInt");

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        todoList: queryResolvers.getTasksResolver,
      },
      Mutation: {
        addItem: mutationResolvers.addTaskResolver,
        updateItem: mutationResolvers.updateTaskResolver,
        deleteItem: mutationResolvers.deleteTaskResolver,
        completeItem: mutationResolvers.completeTaskResolver,
      },
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: () => ({ TODO_LIST, getRandomInt }),
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
