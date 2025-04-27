# UNO | Challenge

## Pontos importantes do Desenvolvedor

Fala galera da UNO! Tudo bem? Gostaria de deixar claro que as implementações realizadas nesse projeto e descritas nesse documento visam demonstrar as principais ideias, tanto para o backend quanto para o frontend, que tive para a To Do List! Tenho ciência de que não se tratam de soluções extremamente robustas ou completas, tendo em vista a natureza do desafio. Ou seja, elas servem para dar ideia de alguns conceitos que conheço e que prezo serem indispensáveis para um bom código de software! Obrigado pela atenção.

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
│   └── makeData.js
├── graphql
│   └── typeDefs.js
├── repositories
│   └── taskRepository.js
├── resolvers
│   ├── mutation.js
│   └── query.js
├── utils
│   └── getRandomInt.js
├── validators
│   └── validators.js
├── errorHandler.js
├── server.js
```

### Descrição dos Arquivos

#### 1. **data/makeData.js**

- **Função**: Este arquivo contém os dados de exemplo utilizados pela aplicação. Ele define o array `TODO_LIST`, que armazena as tarefas criadas e manipuladas nas mutações (adicionar, editar, excluir tarefas).
- **Responsabilidade**: Serve como uma base de dados em memória para fins de desenvolvimento. Futuramente, isso poderia ser substituído por uma solução de banco de dados real.

#### 2. **graphql/typeDefs.js**

- **Função**: Define os tipos e esquemas do GraphQL (type definitions).
- **Responsabilidade**: Contém as definições de tipos como `Item`, `ItemInput`, `ItemFilter`, e as mutações e consultas (queries) que a API aceita.
- **Observação**: Define a estrutura da API GraphQL, facilitando a interação do frontend com o backend.

#### 3. **repositories/taskRepository.js**

- **Função**: Implementa funções de manipulação de dados relacionadas às tarefas, como adicionar, atualizar, excluir e buscar tarefas.
- **Responsabilidade**: Atua como a camada de repositório, isolando a lógica de manipulação de dados da camada de resolução (resolvers). Isso facilita a manutenção e a escalabilidade do código, pois permite alterar a fonte de dados (por exemplo, trocar o armazenamento de memória para um banco de dados) sem afetar a lógica de negócios.

#### 4. **resolvers/mutation.js**

- **Função**: Contém a lógica das mutações GraphQL.
- **Responsabilidade**: Lida com as operações de alteração de dados, como adicionar, atualizar e excluir tarefas.
- **Função no fluxo**: Processa as solicitações do frontend para modificar os dados e utiliza funções do repositório para manipular o array `TODO_LIST`.

#### 5. **resolvers/query.js**

- **Função**: Define os resolvers das consultas GraphQL.
- **Responsabilidade**: Lida com as solicitações do frontend para obter dados, como listar todas as tarefas ou buscar tarefas com base em um filtro.
- **Função no fluxo**: A consulta `todoList` processa a busca de tarefas, seja por nome ou sem filtro.

#### 6. **utils/getRandomInt.js**

- **Função**: Contém a função `getRandomInt()`, que gera um número aleatório.
- **Responsabilidade**: Fornece um mecanismo simples para gerar IDs para as tarefas, que são únicos dentro da aplicação (sem um banco de dados real).

#### 7. **validators/validators.js**

- **Função**: Define funções de validação para os dados das tarefas.
- **Responsabilidade**: Valida as entradas de dados, como garantir que o nome da tarefa tenha entre 3 e 100 caracteres e que o nome da tarefa não seja duplicado.
- **Observação**: Isola a lógica de validação para que as mutações e o código de negócios fiquem mais limpos e fáceis de entender e manter.

#### 8. **errorHandler.js**

- **Função**: Contém a lógica para tratar erros na aplicação.
- **Responsabilidade**: Captura e gera respostas de erro consistentes para o frontend. Utiliza as classes de erro customizadas (como `ValidationError`, `DuplicateError` e `NotFoundError`) para gerar mensagens e códigos de erro específicos para cada tipo de erro.

#### 9. **server.js**

- **Função**: Arquivo principal do servidor, responsável por inicializar o Apollo Server.
- **Responsabilidade**: Configura o servidor GraphQL, define os `typeDefs`, `resolvers`, e inicia o servidor para escutar as requisições.

---

## Possíveis Melhorias Futuras

### 1. **1**

    Exemplo melhoria 1

### 2. **2**

    Exemplo melhoria 2
