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

### Authentication Routes

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
  POST http://localhost:3000/auth/logout
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`  | `string` | **Required**. Access token |

---

### Song Routes

#### Get All Songs Linked to User

```http
  GET http://localhost:3000/song/getAllUserSongs
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Example Response:

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": [
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
      // Additional song data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Add Song To User, From Spotify 

```http
  POST http://localhost:3000/song/addSpotifySong
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `spotifyId`  | `string` | **Required**. Spotify id of the song|

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": {
      // Data of added song
    }
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Add Song To User, Custom

```http
  POST http://localhost:3000/song/addCustomSong
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`  | `string` | **Required**. Title of the song|
| `performers`  | `string` | **Required**. Artists of the song|
| `album`  | `string` | **Required**. Album name of the song|
| `length`  | `string` | **Required**. Duration of the song (ms)|
| `genres`  | `string` | **Required**. Genres of the song|
| `releaseDate`  | `string` | **Required**. Release date of the song|

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": {
      // Data of added song
    }
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Delete A Song From User 

```http
  POST http://localhost:3000/song/deleteSong/User
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. Id of the song|

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": {
      // Data of removed song
    }
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Delete All Album Songs

```http
  POST http://localhost:3000/song/deleteAlbumSongs
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `albumName`  | `string` | **Required**. Name of the album|

##### Example Response

```json
{
    "status": "success"
}
```

---

### Spotify Routes

#### Search Song

```http
  POST http://localhost:3000/spotifyapi/searchSong
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `trackName`  | `string` | **Required**. Song name |
| `performerName` | `string` | Performer name |
| `albumName`  | `string` | Album name |

##### Example Response:

```json
{
    "status": "success",
    "code": 200,
    "message": "Successfully retrieved search results",
    "data": [
        {
            "SpotifyId": "1UGJ3w3PBBJJNK2CpwlKU1",
            "Title": "Magic",
            "Performer": [
                {
                    "name": "Coldplay",
                    "id": "4gzpq5DPGxSnKTe4SA8HAU"
                }
            ],
            "Album": {
                "id": "4rQ9sAZtDiVyjz3qfMWTyp",
                "name": "All Day Mellow Ballads",
                "type": "compilation",
                "release_date": "2023-11-21",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/ab67616d0000b2737cf33c659dc682d364127600",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/ab67616d00001e027cf33c659dc682d364127600",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/ab67616d000048517cf33c659dc682d364127600",
                        "width": 64
                    }
                ]
            },
            "Length": 285014,
            "Genres": [
                "permanent wave",
                "pop"
            ]
        },
        // Additional song data...       
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

---

### Upload Song Externally Routes

#### Upload Songs from CSV

```http
  POST http://localhost:3000/upload
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `file`  | `file` | **Required**. File to be uploaded (.csv only) |

##### Example File
```csv
title,performers,album,length,genres,releaseDate
Blinding Lights,"The Weeknd",After Hours,200000,"Synthwave, Pop, R&B",2019-11-29
```

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Song(s) uploaded from CSV file successfully",
    "data": [
        {
          // Data of the added song(s)
        },
        // Additional songs...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Upload From External DB

```http
  POST http://localhost:3000/transferDataFromExternalDB
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body
/* TODO */

##### Example Response
/* TODO */

##### Example Error Response
/* TODO */

## Rating Routes

### Song Rating Routes

#### Get Song Rating by ID

```http
  POST http://localhost:3000/rating/song/get/ratingid
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ratingId`  | `int` | **Required**. ID of the rating|

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by id",
    "data": [
        {
          "SongRatingID": 5,
          "UserID": 1,
          "SongID": 37,
          "Rating": 3,
          "Date": "" // Date
        },
        // Additional ratings...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Get Song Rating by User

```http
  GET http://localhost:3000/rating/song/get/userid
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by user",
    "data": [
        {
          "SongRatingID": 5,
          "UserID": 1,
          "SongID": 37,
          "Rating": 3,
          "Date": "" // Date
        },
        // Additional ratings...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Get Song Rating by Song

```http
  POST http://localhost:3000/rating/song/get/songid
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song|

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by song",
    "data": [
        {
          "SongRatingID": 5,
          "UserID": 1,
          "SongID": 37,
          "Rating": 3,
          "Date": "" // Date
        },
        // Additional ratings...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Get Song Rating by UserSong

```http
  POST http://localhost:3000/rating/song/get/usersong
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by user and song",
    "data": [
        {
          "SongRatingID": 5,
          "UserID": 1,
          "SongID": 37,
          "Rating": 3,
          "Date": "" // Date
        },
        // Additional ratings...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Create Song Rating 

```http
  POST http://localhost:3000/rating/song/create
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song |
| `rating`  | `int` | **Required**. Rating number (1-5) |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating created",
    "data": [
        {
          "SongRatingID": 5,
          "UserID": 1,
          "SongID": 37,
          "Rating": 3,
          "Date": "" // Date
        },
        // Additional ratings...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Delete Song Rating 

```http
  POST http://localhost:3000/rating/song/delete
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating removed",
    "data": [
        {
          "SongRatingID": 5,
          "UserID": 1,
          "SongID": 37,
          "Rating": 3,
          "Date": "" // Date
        },
        // Additional ratings...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

### Performer Rating Routes

#### Get Performer Rating by ID

```http
  POST http://localhost:3000/rating/performer/get/ratingid
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ratingId`  | `int` | **Required**. ID of the rating|

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": [
      {
        "PerformerRatingID": 1,
        "UserID": 1,
        "PerformerID": 40,
        "Rating": 5,
        "Date": "2023-12-07 12:23:51"
      },
      // Additional rating data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Get Performer Rating by User

```http
  GET http://localhost:3000/rating/performer/get/userid
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": [
      {
        "PerformerRatingID": 1,
        "UserID": 1,
        "PerformerID": 40,
        "Rating": 5,
        "Date": "2023-12-07 12:23:51"
      },
      // Additional rating data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Get Performer Rating by Performer

```http
  POST http://localhost:3000/rating/performer/get/performerid
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer|

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": [
      {
        "PerformerRatingID": 1,
        "UserID": 1,
        "PerformerID": 40,
        "Rating": 5,
        "Date": "2023-12-07 12:23:51"
      },
      // Additional rating data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Get Performer Rating by UserPerformer

```http
  POST http://localhost:3000/rating/performer/get/userperformer
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": [
      {
        "PerformerRatingID": 1,
        "UserID": 1,
        "PerformerID": 40,
        "Rating": 5,
        "Date": "2023-12-07 12:23:51"
      },
      // Additional rating data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Create Performer Rating 

```http
  POST http://localhost:3000/rating/performer/create
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer |
| `rating`  | `int` | **Required**. Rating number (1-5) |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": [
      {
        "PerformerRatingID": 1,
        "UserID": 1,
        "PerformerID": 40,
        "Rating": 5,
        "Date": "2023-12-07 12:23:51"
      },
      // Additional rating data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Delete Performer Rating 

```http
  POST http://localhost:3000/rating/performer/delete
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "", // Status Message
    "data": [
      {
        "PerformerRatingID": 1,
        "UserID": 1,
        "PerformerID": 40,
        "Rating": 5,
        "Date": "2023-12-07 12:23:51"
      },
      // Additional rating data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

---

### Friend Routes

#### Add Friend

```http
  POST http://localhost:3000/friend/addFriend
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `friendEmail`  | `string` | **Required**. Email of the friend |

##### Example Response

```json
{
    "status": "success",
    "data": {
        "FriendID": 3,
        "UserID": 4,
        "FriendUserID": 1
    }
}
```

#### Get All Friends

```http
  GET http://localhost:3000/friend/getAllFriends
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Example Response

```json
{
    "status": "success",
    "data": [
        {
            "FriendID": 3,
            "UserID": 4,
            "FriendUserID": 1,
            "FriendInfo": {
                "UserID": 1,
                "Name": "Baki Mercimek",
                "Email": "baki@mail.com"
            }
        }
    ]
}
```

#### Get All Friend Songs

```http
  GET http://localhost:3000/friend/getAllFriendSongs
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Example Response

```json
{
    "status": "success",
    "data": [
        {
            "SongID": 36,
            "Title": "Blinding Lights",
            "ReleaseDate": "2020-03-20",
            "Album": "After Hours",
            "Length": 200040,
            "SpotifyID": "0VjIjW4GlUZAMYd2vXMi3b",
            "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36\",\"width\":640},    {\"height\":300,\"url\":\"https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36\",\"width\":300},{\"height\":64,\"url\":\"https://i.scdn.co/image/ab67616d000048518863bc11d2aa12b54f5aeb36\",\"width\":64}]",
            "Performers": [
                {
                    "Name": "The Weeknd"
                }
            ],
            "Genres": [
                {
                    "Name": "canadian contemporary r&b"
                },
                {
                    "Name": "canadian pop"
                }
            ]
        }
    ]
}
```

#### Delete Friend

```http
  POST http://localhost:3000/friend/deleteFriend
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `friendUserId`  | `int` | **Required**. UserID of the friend |

##### Example Response

```json
{
    "status": "success"
}
```

---

### Recommendation Routes

#### Get Recommendation

```http
  POST http://localhost:3000/recommendation/get
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `numberOfResults`  | `int` | Number of recommendations to get (10 by default) |

##### Example Response

```json
{
    "status": "success",
    "code": "200",
    "message": "Successfully retrieved 10 recommendations",
    "data": [
        {
            "SpotifyId": "2Di0qFNb7ATroCGB3q0Ka7",
            "Title": "West End Girls - 2018 Remaster",
            "Performer": [
                {
                    "name": "Pet Shop Boys",
                    "id": "2ycnb8Er79LoH2AsR5ldjh"
                }
            ],
            "Album": {
                "id": "47fRf3JwriMUPPzFjdvNS6",
                "name": "Please: Further Listening 1984 - 1986 (2018 Remaster)",
                "type": "ALBUM",
                "release_date": "1986-03-24",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/ab67616d0000b2733540f5cb8e1e7a54125f84db",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/ab67616d00001e023540f5cb8e1e7a54125f84db",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/ab67616d000048513540f5cb8e1e7a54125f84db",
                        "width": 64
                    }
                ]
            },
            "Length": 285906
        },
        // Additional recommendation data...
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

---