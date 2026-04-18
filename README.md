# Geometrie Das Server
A simple NodeJS+Express API using a MySQL database.

## How to run

### 1. Install Docker

### 2. Setup `.env` file in the project folder
- `PORT` = the port the app will listen on.
- `MYSQL_USER` = the user name used in the MySQL container.
- `MYSQL_PASS` = the password used by the MySQL instance.
- `MYSQL_DB` = use `geometrie_das`, if not also change the `init.sql` file.
- `JWT_SECRET_KEY` = the secret key used to encrypt tokens.
- `MIN_GAME_VERSION` = oldest Geometrie Das version supported by the app.
- `RUN_TESTS_ON_START` = optional. Set to `true` to run `npm test` before `npm start` in the API container. Default is `false`.

You can set the `NODE_ENV` variable to whatever, doesn't affect anything yet.

### 3. Run `docker-compose up -d` in the same folder as the `docker-compose.yaml` file

>To run tests before starting the API:
>`$env:RUN_TESTS_ON_START='true'; docker-compose up -d --build`<br>
>For normal startup again:
`$env:RUN_TESTS_ON_START='false'; docker-compose up -d --build`

If you want to delete all data stored in the database, run `docker-compose down -v`