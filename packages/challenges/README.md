# Challenges

Este é o serviço responsável pelo gerenciamento dos desafios e das submissões de desafios para correção. É uma **API GraphQL**, desenvolvida com **NestJS** e utiliza um banco de dados **PostgresSQL** para persistência dos dados. Também possui integração com o microservice [Corrections](https://github.com/mpedroni/rocketseat-backend-challenge/tree/main/packages/corrections), que é o responsável por corrigir os desafios enviados pelo usuário.

É pelo `Challenges` que o usuário cadastra novos desafios e consegue submeter um desafio para correção. Essa submissão é enviada para o `Corrections` e, após corrigido, o `Challenges` recupera a submissão corrigida e a atualiza no banco de dados.

A integração com o `Corrections` é feita via **Apache Kafka** utilizando o modelo de mensagens [request-response](https://docs.nestjs.com/microservices/basics#request-response). Mais informações sobre a integração, como estruturas de dados e configurações do Kafka, podem ser encontradas na [documentação do microservice `Corrections`](https://github.com/mpedroni/rocketseat-backend-challenge/tree/main/packages/corrections).

## Documentação da API

A aplicação vem com o [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/v2/testing/graphql-playground/) (apenas em ambiente de desenvolvimento), que é uma IDE GraphQL que pode ser usada para fazer queries. Essa IDE fica disponível em `/graphql` (por exemplo, `http://localhost:3000/graphql`) e pode ser acessada pelo navegador. No GraphQL Playground existe uma aba `DOCS` que possui todas definições de queries e mutations disponíveis na API

## Sobre a arquitetura

O `Challenges` segue um modelo de arquitetura baseado em Clean Architecture, na qual isolamos o domínio da aplicação (como casos de uso, regras de negócio, e tudo que é relativo ao negócio da aplicação) do resto do sistema e dos detalhes de implementação, como bancos de dados e frameworks de terceiros.

## Requisitos

Para executar a aplicação é necessário:

- NodeJS v14.x ou superior
- Docker Compose
- Yarn v1.22.x

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
