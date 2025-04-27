const typeDefs = `#graphql
type Item {
  id: Int
  name: String
  completed: Boolean
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
  completeItem(id: Int!): ResponseMessage 
}

type ResponseMessage {
  status: String
  message: String
  code: String
}
`;

module.exports = {
  typeDefs,
};
