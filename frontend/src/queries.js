import { gql } from "@apollo/client";

// Queries
// Listar com Filtros
export const GET_TODO_LIST = gql`
  query todoList($filter: ItemFilter) {
    todoList(filter: $filter) {
      id
      name
    }
  }
`;

// Mutations
// Adicionar item
export const ADD_ITEM_MUTATION = gql`
  mutation addItem($values: ItemInput) {
    addItem(values: $values)
  }
`;

// Atualizar item
export const UPDATE_ITEM_MUTATION = gql`
  mutation updateItem($values: ItemInput) {
    updateItem(values: $values)
  }
`;

// Excluir item
export const DELETE_ITEM_MUTATION = gql`
  mutation deleteItem($id: Int!) {
    deleteItem(id: $id)
  }
`;
