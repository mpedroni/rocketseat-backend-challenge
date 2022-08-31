# Challenges

Este é o serviço responsável pelo gerenciamento dos desafios e das submissões de desafios para correção. É uma **API GraphQL**, desenvolvida com **NestJS** e utiliza um banco de dados **PostgresSQL** para persistência dos dados. Também possui integração com o microservice [Corrections](https://github.com/mpedroni/rocketseat-backend-challenge/tree/main/packages/corrections), que é o responsável por corrigir os desafios enviados pelo usuário.

É pelo `Challenges` que o usuário cadastra novos desafios e consegue submeter um desafio para correção. Essa submissão é enviada para o `Corrections` e, após corrigido, o `Challenges` recupera a submissão corrigida e a atualiza no banco de dados.

A integração com o `Corrections` é feita via **Apache Kafka** utilizando o modelo de mensagens [request-response](https://docs.nestjs.com/microservices/basics#request-response). Mais informações sobre a integração, como estruturas de dados e configurações do Kafka, podem ser encontradas na [documentação do microservice `Corrections`](https://github.com/mpedroni/rocketseat-backend-challenge/tree/main/packages/corrections).

## Documentação da API

A aplicação vem com o [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/v2/testing/graphql-playground/) (apenas em ambiente de desenvolvimento), que é uma IDE GraphQL que pode ser usada para fazer queries. Essa IDE fica disponível em `/graphql` (por exemplo, `http://localhost:3000/graphql`) e pode ser acessada pelo navegador. No GraphQL Playground existe uma aba `DOCS` que possui todas definições de queries e mutations disponíveis na API

## Sobre a arquitetura

O `Challenges` segue um modelo de arquitetura baseado em Clean Architecture, na qual isolamos o domínio da aplicação (como casos de uso, regras de negócio, e tudo que é relativo ao negócio da aplicação) do resto do sistema e dos detalhes de implementação, como bancos de dados e frameworks de terceiros.

Todo o código relacionado a domínio (usecases, entidades, implementações...) está na pasta `src/@core`, sendo:

- `@core/domain/entities`: as entidades da aplicação (_enterprise business rules_)
- `@core/application`
  - `/usecases`: os usecases da aplicação (_application business rules_)
  - `/ports`: contratos/interfaces dos gateways e adaptadores utilizados pelos usecases (_interface adapters_)
  - `/errors`: erros conhecidos que podem ser retornados por determinado usecase
- `@core/main`: camada mais externa que contém as implementações concretas dos contratos utilizados pelos usecases (_frameworks & drivers_)

## Requisitos

Para executar a aplicação é necessário:

- NodeJS v14.x ou superior
- Docker Compose
- Yarn v1.22.x

## Variáveis de Ambiente

Estas são as variáveis de ambiente necessárias para executar a aplicação. Crie um arquivo `.env` na raiz da aplicação com as variáveis descritas abaixo. Os valores para as variáveis do Kafka podem ser encontradas na [documentação do service Corrections](https://github.com/mpedroni/rocketseat-backend-challenge/tree/main/packages/corrections). As credencias do banco de dados estão descritas no arquivo [`docker-compose.yml`](https://github.com/mpedroni/rocketseat-backend-challenge/blob/main/docker-compose.yml)

```env
## APP
PORT=3000

## DATABASE
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

## KAFKA
KAFKA_BROKER_URL=localhost:9092
KAFKA_CLIENT_ID=
KAFKA_GROUP_ID="kafka group id"
KAFKA_CHALLENGE_CORRECTION_TOPIC="challenge correction topic"

```

## Instalação

```bash
$ yarn
# or
$ yarn install
```

## Executando a aplicação

Antes de executar a aplicação, é necessário subir os containers com o Docker Compose (o arquivo `docker-compose.yml` com os containers necessários já configurados pode ser encontrado na raiz do repositório) e iniciar o microservice `Corrections` (as instruções para executar o `Corrections` são descritas [em sua documentação](https://github.com/mpedroni/rocketseat-backend-challenge/tree/main/packages/corrections))

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Testes

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Futuras implementações e possíveis melhorias

- Criar módulo do NestJS dedicado as `Submissions`
- Separar a aplicação em pacotes, utilizando por exemplo `npm workspaces` ou `lerna`, evitando possíveis acoplamentos acidentais entre componentes
- FetchAPI é uma feature experimental, está sendo usada para consumir uma API HTTP. Considerar substituir por outra solução, como módulo `http` do Node.js ou `axios`.

## Débitos técnicos

- Criar testes unitários para resolvers do GraphQL
- Criar testes unitários para a implementação do PrismaChallengeRepository
- Criar testes unitários para a implementação do PrismaSubmissionRepository
- Dividir os resolvers do GraphQL e os services do módulo Challenges em múltiplos arquivos para melhor legibilidade
