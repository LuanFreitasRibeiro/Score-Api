## Description

API de cálculo de score baseado nas dívidas e bens do usuário.

## Installation

```bash
$ npm install
```

## Swagger

```bash
http://localhost:3000/swagger
```

## Running the app

```bash
#docker
docker-compose up -d

Após executar o comando acima, é necessário esperar um pouco para a aplicação subir por completo no docker.
Deixei o arquivo .ENV liberado para facilitar o processo de execução da aplicação. 
```

## Test

```bash
# unit tests and integration tests
$ npm run test
```

## Disclaimers

#### RabbitMQ and Redis 

A ideia inicial era salvar o score no momento do cadastro do usuário, e a cada novo bem e/ou dívida inserida para esse ele seria publicado um evento no Rabbitmq para atualizar o novo score. Com isso, a consulta do score seria salva em cache com o Redis e as consultas subsequentes pegariam o valor na cache.

#### Authentication and Authorization

A parte de autenticação foi implementada, faltando somente a parte de autorização.
