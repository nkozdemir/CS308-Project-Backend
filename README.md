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

Start the server

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_HOST`, `DB_USER`, `DB_PSWD`, `DB_NAME`, `DB_PORT`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`, `SPOTIFY_REFRESH_TOKEN`  

## API Reference

#### Login

```http
  POST http://localhost:3000/auth/login
```

##### Request Body

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email |
| `password`  | `string` | **Required**. User password |

##### Example Response

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJrb3pkZW1pckBzYWJhbmNpdW5pdi5lZHUiLCJpYXQiOjE3MDA3MzI5NDYsImV4cCI6MTcwMDczMzU0Nn0.e9CcPCL-RcRwBELpq5INsycOQVX_wG9Zhc1fexha4vk",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJrb3pkZW1pckBzYWJhbmNpdW5pdi5lZHUiLCJpYXQiOjE3MDA3MzI5NDZ9.1D0MMS9cbWbOWdIqB1yoML-5zr963MTsn3vvygbwOD8"
}
```

#### Register

```http
  POST http://localhost:3000/register
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`  | `string` | **Required**. Name of the user |
| `email` | `string` | **Required**. Email of the user |
| `password`  | `string` | **Required**. Password of the user |

#### Logout

```http
  DELETE http://localhost:3000/auth/logout
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`  | `string` | **Required**. Access token |

#### Get All Songs Linked to User

```http
  GET http://localhost:3000/song/getAllUserSongs
```

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`  | `string` | **Required**. Access token |

##### Example Response:

```json
[
    {
        "SongID": 1,
        "Title": "greedy",
        "ReleaseDate": "2023-09-15",
        "Album": "greedy",
        "Length": 131872,
        "SpotifyID": "3rUGC1vUpkDG9CZFHMur1t",
        "Performers": [
            {
                "Name": "Tate McRae"
            }
        ]
    },
]
```

## Database Diagram
![Database Diagram](images/db-diagram-2.png)