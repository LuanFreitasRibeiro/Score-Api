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

## Routes
Todas as rotas são protegidas, sendo necessário estar logado para manipulá-las.

#### <code>/assets</code>

_**create**_ (POST) -> rota de criação de novos bens. Para o cadastro, é necessário preencher dois campos, sendo eles: AMOUNT que se refere ao valor monetário do bem é um campo de tipo Number; e TYPE que se trata do tipo do bem que está sendo cadastrado. A associação do bem com o usuário é feita através do login dele.

request body
```json
/assets
{
    "amount": 1000,
    "type": "imovel",
}
```

_**update**_ (PATCH:assetId) -> rota de atualização dos bens. Para o atualização, pode ser atualizar os dois campos ou somente um.

request body
```json
/assets/{assetId}
{
    "amount": 1000,
    "type": "imovel",
}
```

_**get**_ (GET:assetId) -> rota de busca de bem por ID. 

_**get**_ (GET) -> rota de busca de bens por parametros. Essa o parametro de busca é somente pelo tipo no momento. Também é possível ordenar.  

_**delete**_ (DELETE:aasetId) -> rota de deleção do bem por ID.  


#### <code>/debts</code>

_**create**_ (POST) -> rota de criação de novos débitos. Para o cadastro, é necessário preencher dois campos, sendo eles: AMOUNT que se refere ao valor monetário do débito é um campo de tipo Number; e TYPE que se trata do tipo do débito que está sendo cadastrado. A associação do bem com o usuário é feita através do login dele.

request body
```json
/debts
{
    "amount": 1000,
    "type": "cartão de crédito",
}
```

_**update**_ (PATCH:debtId) -> rota de atualização dos débitos. Para o atualização, pode ser atualizar os dois campos ou somente um.

request body
```json
/debts/{debtId}
{
    "amount": 1000,
    "type": "imovel",
}
```

_**get**_ (GET:debtId) -> rota de busca de débito por ID. 

_**get**_ (GET) -> rota de busca de débitos por parametros. Essa o parametro de busca é somente pelo tipo no momento. Também é possível ordenar.  

_**delete**_ (DELETE:debtId) -> rota de deleção do débito por ID.  

#### <code>/users</code>

_**create**_ (POST) -> rota de criação de novos usuários. Para o cadastro, é necessário preencher cinco campos, sendo eles: NAME nome do usuário; EMAIL email do usuário; PASSWORD senha do usuário; DOCUMENT cpf do usuário; ROLE o tipo de usuário dentro do aplicação, sendo ADMIN ou CUSTOMER. Os dados de EMAIL e SENHA serão usados posteriormente para Longin do usuário.

request body
```json
/users
{
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "password": "John@Doe1234",
    "document": "22668510040",
    "role": "customer"
}
```

_**get**_ (GET:userId) -> rota de busca de usuário por ID. Rota exclusiva para usuários administradores. 

_**get**_ (GET:userId) -> rota de busca de usuário por ID. Rota exclusiva para usuários administradores. 


#### <code>/auth</code>

_**login**_ (POST) -> rota de login dos usuários. É gerado um token JWT para fazer autenticação BEARER.

request body
```json
/auth/login
{
    "email": "john.doe@gmail.com",
    "password": "John@Doe1234",
}
```
## Disclaimers

#### Creates

Para a criação de Assets (bens) e Debts (dívidas), eu usei o userId da sessão de login para fazer a associação desses assets e debts com o usuário. Isso foi feito através do cache-manager, o tempo de cache é controlado no .ENV, sendo o tempo de expiração do token JWT o mesmo do Cache.

#### RabbitMQ and Redis 

A ideia inicial era salvar o score no momento do cadastro do usuário, e a cada novo bem e/ou dívida inserida para esse ele seria publicado um evento no Rabbitmq para atualizar o novo score. Com isso, a consulta do score seria salva em cache com o Redis e as consultas subsequentes pegariam o valor na cache.

#### Authentication and Authorization

Foi implementado. Faltando somente a parte de controle de acesso para ficar completo. Tentei criar um usuário admin no momento em que a collection User é criada, dessa forma teria sempre um usuário admin e eu conseguiria bloquear a rota de createUser somente para os users que possuem essa role.
