# UNO | Challenge

## Visão Geral

Este projeto consiste em um gerenciador de tarefas, onde os usuários podem adicionar, atualizar, excluir e listar/filtrar tarefas. O projeto foi desenvolvido utilizando o **Apollo Server** para GraphQL, com validações de entrada, tratamento de erros e boas práticas de arquitetura. O frontend foi desenvolvido com **React** e **Apollo Client**, com suporte à temas dinâmicos e mensagens de erro interativas através de um sistema de Snackbar.

## Funcionalidades Implementadas

### Backend

1. **Estrutura Inicial do Servidor (GraphQL)**

   A estrutura básica do backend foi configurada usando o **Apollo Server** e **GraphQL**, permitindo que mutações (adicionar, editar, excluir tarefas) e consultas (listar tarefas) fossem feitas de forma eficiente.

2. **Respostas de Erro e Sucesso**

   A API foi configurada para retornar **status**, **mensagem** e **código** nas respostas. O código é fornecido para identificar o tipo de erro ocorrido (ex: "VALIDATION_ERROR", "DUPLICATE_ERROR", "NOT_FOUND_ERROR"). Vale notar que o frontend não está fazendo uso desses códigos. (Possível melhoria!)

3. **Validação de Entrada com Joi e Custom Errors ("Camada" de validator)**

   A entrada de dados é validada no backend usando a biblioteca **Joi**. Decidi adicionar esse biblioteca ao projeto pois é extremamente importante termos uma camada de validação de dados de entrada, mesmo em aplicações simples como essa. O nome da tarefa precisa ter entre **3 e 100 caracteres** e a lógica de duplicação de nomes é tratada para evitar tarefas com nomes repetidos. Caso os dados não atendam aos critérios definidos, erros são lançados e tratados adequadamente.

   Para um melhor controle de erros, implementamos classes de erro personalizadas:

   - **ValidationError**: Para erros relacionados à validação de dados de entrada.
   - **DuplicateError**: Para erros relacionados a duplicação de recursos.
   - **NotFoundError**: Para erros quando um item não é encontrado na lista. (Ex.: atualizando um item com id inexistente)

4. **Repositório (Camada de repositório)**

   Decidi implementar uma lógica de repositórios, para 'simular' uma situação de uma aplicação real. Os repositórios no backend são responsáveis por acessar o banco de dados (geralmente via ORM) e existem aqui no projeto para acessar o array de tarefas (nosso "banco"). A lógica de manipulação de dados (adicionar, atualizar, excluir e obter tarefas) foi extraída para um **repositório** dedicado, o que promove o desacoplamento da lógica de negócios da lógica de manipulação de dados. Isso facilita a manutenção, testes e escalabilidade do código.

   As funções no repositório são:

   - **addTask**: Adiciona uma tarefa à lista.
   - **updateTask**: Atualiza uma tarefa existente pelo `id`.
   - **deleteTask**: Exclui uma tarefa pela `id`.
   - **getTasksByName**: Filtra as tarefas por nome.

5. **Tratamento de Erros Centralizado**

   Implementamos um mecanismo de tratamento de erros centralizado que captura e retorna mensagens de erro consistentes para o frontend. Usamos **`try-catch`** para capturar erros em cada mutação e, caso um erro específico ocorra (por exemplo, nome duplicado ou item não encontrado), ele é tratado de forma customizada.

   A função `errorHandler` mapeia os erros lançados e retorna uma resposta consistente com status "error", mensagem de erro e um código.

6. **Uso de `getRandomInt` para Gerar IDs Aleatórios**

   A geração de IDs para os itens da lista é feita utilizando a função `getRandomInt()`. Embora seja simples e eficiente para este caso, uma melhoria futura seria a implementação de uma solução mais robusta para garantir unicidade e evitar colisões de ID.

---

### Frontend

1. **Estrutura React com Apollo Client**

   O frontend foi desenvolvido com **React** e **Apollo Client**, consumindo a API GraphQL criada no backend. A comunicação entre o frontend e o backend é feita utilizando Apollo Client, que facilita o gerenciamento de cache e a execução de mutações e consultas.

2. **Gerenciamento de Tema (Light/Dark Mode)**

   O tema da aplicação é alternado entre **modo claro** e **modo escuro** utilizando a biblioteca **Material-UI**. A mudança de tema é armazenada no estado do componente React e aplicada globalmente à aplicação usando `ThemeProvider` do Material-UI.

3. **Snackbar para Exibição de Erros e Sucessos**

   A exibição de mensagens de erro e sucesso foi implementada com o **SnackbarContext**, que envolve a aplicação e oferece uma maneira centralizada de exibir notificações. O sistema de Snackbar foi configurado para exibir mensagens com base no resultado das mutações (sucesso ou erro).

4. **Componente de Lista de Tarefas**

   O componente principal **`List`** exibe as tarefas e permite realizar ações como adicionar, editar e excluir. As funcionalidades de filtragem e edição de tarefas são suportadas por meio de mutações GraphQL e interação com o estado do componente.

---

## Estrutura de Pastas

```
serverless
├── data
│   └── makeData.js             # Dados em memória (TODO_LIST)
├── graphql
│   └── typeDefs.js             # Definições do schema GraphQL
├── repositories
│   └── taskRepository.js       # CRUD puro sobre TODO_LIST
├── services
│   └── taskService.js          # Regras de negócio e validações antes do CRUD
├── resolvers
│   ├── query.js                # Resolvers de consulta (todoList)
│   └── mutation.js             # Resolvers de mutação (add/update/delete/complete)
├── utils
│   └── getRandomInt.js         # Geração de ID
├── validators
│   └── validators.js           # Schemas Joi e validações customizadas
├── errorHandler.js             # Tratamento centralizado de erros
└── server.js                   # Inicialização do Apollo Server
```

### 1. **data/makeData.js**
- **Função**: Contém o array `TODO_LIST` em memória.
- **Responsabilidade**: Base de dados em memória para desenvolvimento.

### 2. **graphql/typeDefs.js**
- **Função**: Define tipos e esquemas do GraphQL.
- **Responsabilidade**: Estrutura de Queries e Mutations.

### 3. **repositories/taskRepository.js**
- **Função**: Operações CRUD puras sobre `TODO_LIST`.
- **Responsabilidade**: Camada de repositório (Data Access).

### 4. **services/taskService.js**
- **Função**: Aplica regras de negócio e validações.
- **Responsabilidade**: Camada de serviço (Business Logic).

### 5. **resolvers/query.js**
- **Função**: Resolver de consultas (`todoList`).
- **Responsabilidade**: Interface GraphQL para leitura de dados.

### 6. **resolvers/mutation.js**
- **Função**: Resolver de mutações (adicionar, atualizar, excluir, completar).
- **Responsabilidade**: Interface GraphQL para alterações de dados.

### 7. **utils/getRandomInt.js**
- **Função**: Geração de IDs aleatórios.
- **Responsabilidade**: Utilitário de apoio para unicidade.

### 8. **validators/validators.js**
- **Função**: Schemas Joi e validações customizadas.
- **Responsabilidade**: Sanitização e verificação de inputs.

### 9. **errorHandler.js**
- **Função**: Tratamento centralizado de erros.
- **Responsabilidade**: Formatação de respostas de erro.

### 10. **server.js**
- **Função**: Inicialização do Apollo Server.
- **Responsabilidade**: Ponto de entrada da aplicação.

---

## Possíveis Melhorias Futuras

### 1. **1**

    Exemplo melhoria 1

### 2. **2**

    Exemplo melhoria 2
