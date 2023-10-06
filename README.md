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

#### Creates

Para a criação de Assets (bens) e Debts (dívidas), eu usei o userId da sessão de login para fazer a associação desses assets e debts com o usuário. Isso foi feito através do cache-manager, o tempo de cache é controlado no .ENV, sendo o tempo de expiração do token JWT o mesmo do Cache.

#### RabbitMQ and Redis 

A ideia inicial era salvar o score no momento do cadastro do usuário, e a cada novo bem e/ou dívida inserida para esse ele seria publicado um evento no Rabbitmq para atualizar o novo score. Com isso, a consulta do score seria salva em cache com o Redis e as consultas subsequentes pegariam o valor na cache.

#### Authentication and Authorization

Foi implementado. Faltando somente a parte de controle de acesso para ficar completo. Tentei criar um usuário admin no momento em que a collection User é criada, dessa forma teria sempre um usuário admin e eu conseguiria bloquear a rota de createUser somente para os users que possuem essa role.
