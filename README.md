# CS308-Project-Backend
CS308 Project Backend

## Run Locally

Clone the project

```bash
  git clone https://github.com/nkozdemir/CS308-Project-Backend.git
```

Go to the project directory

```bash
  cd cs308-server
```

Install dependencies

```bash
  npm install
```

Start the MAIN server

```bash
  npm run dev
```

Start the AUTHENTICATION server, in new terminal

```bash
  cd authentication
  npm run devAuth
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_HOST`, `DB_USER`, `DB_PSWD`, `DB_NAME`, `DB_PORT`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` 

## API Reference

#### Login

```http
  POST http://localhost:4000/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email |
| `password`  | `string` | **Required**. User password |

#### Register

```http
  POST http://localhost:3000/register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`  | `string` | **Required**. Name of the user |
| `email` | `string` | **Required**. Email of the user |
| `password`  | `string` | **Required**. Password of the user |

#### Logout

```http
  DELETE http://localhost:4000/logout
```

## Database Diagram
![Database Diagram](images/db-diagram-2.png)