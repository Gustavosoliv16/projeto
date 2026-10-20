# Controle de Patrimônio — Backend

API REST do sistema de controle de patrimônio e ordens de serviço da Prefeitura
de Caratinga. Este serviço atende o frontend, gerencia solicitações e usuários,
e mantém os dados em um banco SQLite local.

## Tecnologias

- Node.js com módulos ES
- Express e CORS para a API HTTP
- SQLite com `better-sqlite3`
- JSON Web Token (JWT) para autenticação
- `bcrypt` para hash de senhas
- Joi para validação de dados

## Requisitos

- Node.js 22 ou superior
- npm

## Instalação e inicialização

No terminal, a partir da pasta `projetoestagio`:

```powershell
npm install
npm run server
```

Por padrão, a API inicia em `http://localhost:3000`. Para executar o frontend
durante o desenvolvimento, abra um segundo terminal na mesma pasta e rode:

```powershell
npm run dev
```

O Vite informa no terminal o endereço local do frontend, normalmente
`http://localhost:5173`.

## Configuração

A configuração é opcional. O backend carrega as variáveis do arquivo `.env` na
raiz do projeto:

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP da API |
| `SQLITE_DB_PATH` | `server/data/database.sqlite` | Caminho do arquivo SQLite |

Um caminho relativo em `SQLITE_DB_PATH` é resolvido a partir da pasta do projeto.
Se a variável não for definida, o banco é criado no caminho padrão.

## Banco de dados

O esquema está em [`schema.sql`](./schema.sql). Na inicialização, as tabelas e
índices são criados automaticamente quando ainda não existem. O banco contém:

- `SETOR` e `USUARIOS`
- `TIPO_SERVICO` e `SOLICITACOES`
- `PECAS`, `ESTOQUE_PECAS` e `MOVIMENTACAO_ESTOQUE`
- `SOLICITACAO_PECAS`
- `HISTORICO_SOLICITACOES`

O arquivo SQLite e seus arquivos auxiliares são locais e ignorados pelo Git. O
banco é criado vazio; os dados do banco anterior não foram importados. Para
inserir dados, use a aplicação ou uma ferramenta compatível com SQLite, mantendo
as chaves estrangeiras definidas no esquema.

## API

As rotas são montadas sob o prefixo `/api`. Principais grupos:

| Recurso | Endereço base | Operações |
| --- | --- | --- |
| Autenticação e usuários | `/api/login`, `/api/cadastro` | Login e operações administrativas de usuários |
| Setores | `/api/setores` | Consulta, cadastro, edição e exclusão |
| Tipos de serviço | `/api/tipos-servico` | Consulta, cadastro, edição e exclusão |
| Solicitações | `/api/solicitacoes` | Consulta, abertura, resposta, atribuição, alteração de status e exclusão |
| Peças e estoque | `/api/pecas`, `/api/estoque`, `/api/movimentacao` | Gestão de peças, consulta de estoque e movimentações |
| Peças por solicitação | `/api/solicitacoes/:id/pecas` | Consulta e associação de peças |
| Histórico | `/api/historico` | Consulta e exclusão de registros |
| Dashboard | `/api/dashboard-stats` | Dados agregados para o painel |

As rotas protegidas recebem o cabeçalho `Authorization: Bearer <token>`. Algumas
operações exigem um usuário administrador.

## Scripts disponíveis

Na pasta do projeto:

| Comando | Finalidade |
| --- | --- |
| `npm run server` | Inicia a API |
| `npm run dev` | Inicia o frontend com Vite |
| `npm run build` | Gera a versão de produção do frontend |
| `npm run preview` | Pré-visualiza o build do frontend |
| `npm run lint` | Executa o ESLint configurado no projeto |

## Observações de segurança

A implementação atual contém credenciais e uma chave JWT de demonstração no
código, destinadas somente ao desenvolvimento. Revise e substitua esses valores,
e configure segredos fora do repositório, antes de disponibilizar o sistema em
produção.
