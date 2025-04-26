const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { TODO_LIST } = require("./makeData");
const queryResolvers = require("./resolvers/query");
const mutationResolvers = require("./resolvers/mutation");

function getRandomInt() {
  return Math.floor(Math.random() * 999);
}

const typeDefs = `#graphql
type Item {
  id: Int
  name: String
}

input ItemInput {
  id: Int
  name: String
}

input ItemFilter {
  id: Int
  name: String
}

type Query {
  todoList(filter: ItemFilter): [Item]
}

type Mutation {
  addItem(values: ItemInput): ResponseMessage
  updateItem(values: ItemInput): ResponseMessage
  deleteItem(id: Int!): ResponseMessage
}

type ResponseMessage {
  status: String
  message: String
}
`;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        todoList: queryResolvers.todoList,
      },
      Mutation: {
        addItem: mutationResolvers.addItem,
        updateItem: mutationResolvers.updateItem,
        deleteItem: mutationResolvers.deleteItem,
      },
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({ TODO_LIST, getRandomInt }),
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
