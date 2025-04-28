# UNO Challenge - Lista de Tarefas

## Observações do desenvolvedor

Para esse desafio, foquei em implementar alguns dos mais importantes conceitos de boas práticas de código, adotando uma arquitetura limpa e uma estrutura de projeto bem definida, mas sem perder simplicidade e objetividade; também priorizei o tempo de entrega para cumprir o prazo. Abaixo, encontram-se a estrutura do projetos e a descrição de algumas das principais implementações.

## Estrutura do Projeto

### Frontend

```
uno-challenge/
└── frontend/
    ├── public/
    │   ├── favicon.png
    │   ├── index.html
    │   ├── manifest.json
    ├── src/
    │   ├── components/
    │   │   ├── AddTaskDialog.js        // Componente para adicionar tarefas
    │   │   └── ConfirmationDialog.js  // Componente de confirmação (deletar, concluir)
    │   ├── context/
    │   │   └── SnackbarContext.js     // Context API para notificações (Snackbar)
    │   ├── theme/
    │   │   └── theme.js               // Configuração de tema claro/escuro e estilos globais
    │   ├── App.js                     // Componente principal: provedor Apollo, ThemeProvider e lógica de alternância de tema
    │   ├── list.js                    // Lógica e apresentação da lista de tarefas (busca, adicionar, editar, excluir, concluir)
    │   ├── queries.js                 // Definição de queries e mutations GraphQL
    │   ├── index.js                   // Ponto de entrada React
    │   ├── App.css, index.css         // Estilos globais
    ├── .env                           // Variável REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
    └── package.json, yarn.lock
```

### Backend (Serverless)

```
uno-challenge/
└── serverless/
    ├── graphql/
    │   └── typeDefs.js           // Esquema GraphQL (typedefs)
    ├── common/
    │   └── errors.js             // Tratamento e criação de erros
    ├── resolvers/
    │   ├── query.js              // Resolvers para Queries
    │   └── mutation.js           // Resolvers para Mutations
    ├── data/
    │   └── makeData.js           // Dados iniciais mocados (TODO_LIST)
    ├── services/
    │   └── taskService.js        // Lógica de negócio (CRUD de tarefas)
    ├── tests/
    │   └── resolvers.test.js     // Tests end-to-end com jest js
    ├── repositories/
    │   └── taskRepository.js     // Acesso ao array TODO_LIST (in-memory)
    ├── utils/
    │   └── getRandomInt.js       // Utilitário para gerar IDs aleatórios
    ├── validators/
    │   └── schemas.js            // Validações de input usando Joi
    ├── server.js                 // Configuração e inicialização do Apollo Server
    └── package.json, yarn.lock
```

## Principais Implementações

- **Completar Tarefa (Fullstack)**: mutation `completeItem` e checkbox para marcar itens completos.
- **Dark Mode (Frontend)**: alternância de tema claro/escuro usando MUI ThemeProvider e hook `useState`.
- **Notificações Snackbar (Frontend)**: Context API para exibir feedbacks de sucesso/erro.
- **Dialog de Adição (Frontend)**: componente modular `AddTaskDialog` para criar novas tarefas.
- **Dialog de Confirmação (Frontend)**: `ConfirmationDialog` para ações sensíveis.
- **Estrutura Modular (Backend)**: O backend foi organizado em camadas claras para facilitar a manutenção e evolução:
  - **Camada de Dados (`data/`)**: Responsável por fontes de dados e mocks iniciais (arquivo `makeData.js`), abstraindo detalhes de persistência.
  - **Camada de Validação (`validators/`)**: Define regras de validação de entrada usando **Joi** (`taskValidator.js`), garantindo dados consistentes antes do processamento.
  - **Camada de Resolvers/Controllers (`resolvers/`)**: Implementam a interface GraphQL, mapeando queries e mutations para chamadas aos serviços.
  - **Camada de Serviços (`services/`)**: Contém a lógica de negócio principal (arquivo `taskService.js`), atuando como ponte entre dados e resolvers.
  - **Camada de Repositórios (`repositories/`)**: Encapsula acesso a dados, definindo métodos para CRUD e queries específicas, isolando as chamadas ao data layer (`taskRepository.js`).
- **Testes Automatizados (Backend)**: adicionamos uma suíte de **testes de integração (end-to-end)** para os resolvers GraphQL, garantindo cobertura de cenários de sucesso e erro.

## Como Rodar o projeto

### Frontend

```bash
cd frontend
yarn        # instala dependências
yarn start  # inicia o app em http://localhost:3000
```

### Backend

```bash
cd serverless
yarn        # instala dependências
yarn start  # inicia o GraphQL em http://localhost:4000/graphql
```

---

## Como Rodar os testes

```bash
cd serverless
yarn test
# ou
npm test
```

---
