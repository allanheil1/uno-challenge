import { gql } from "@apollo/client";

// Queries
// Listar com Filtros
export const GET_TODO_LIST = gql`
  query todoList($filter: ItemFilter) {
    todoList(filter: $filter) {
      id
      name
      completed
    }
  }
`;

// Mutations
// Adicionar item
export const ADD_ITEM_MUTATION = gql`
  mutation addItem($values: ItemInput) {
    addItem(values: $values) {
      status
      message
      code
    }
  }
`;

// Atualizar item
export const UPDATE_ITEM_MUTATION = gql`
  mutation updateItem($values: ItemInput) {
    updateItem(values: $values) {
      status
      message
      code
    }
  }
`;

// Excluir item
export const DELETE_ITEM_MUTATION = gql`
  mutation deleteItem($id: Int!) {
    deleteItem(id: $id) {
      status
      message
      code
    }
  }
`;

export const COMPLETE_ITEM_MUTATION = gql`
  mutation completeItem($id: Int!) {
    completeItem(id: $id) {
      status
      message
      code
    }
  }
`;
