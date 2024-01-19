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
| `token`  | `string` | **Required**. Refresh token |

#### Refresh Access Token

```http
  POST http://localhost:3000/auth/token
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`  | `string` | **Required**. Refresh token |

##### Example Response

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhbHBheWtpbGljQHNhYmFuY2l1bml2LmVkdSIsImlhdCI6MTcwMzYyNTU3NiwiZXhwIjoxNzAzNjI2NDc2fQ.T6dHPZ_bACuO5Jo-jpedHwTTPTp-h6BZsvSLvvNfvAM"
}
```

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

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Data transfer completed successfully",
    "data": []
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

### Rating Routes

#### Song Rating Routes

##### Get Song Rating by ID

```http
  POST http://localhost:3000/rating/song/get/ratingid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ratingId`  | `int` | **Required**. ID of the rating|

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by id",
    "data": {
        "SongRatingID": 8,
        "UserID": 4,
        "SongID": 48,
        "Rating": 5,
        "Date": "2023-12-07 18:10:40",
        "SongInfo": {
            "SongID": 48,
            "Title": "La Luna",
            "ReleaseDate": "1989",
            "Album": "Runaway Horses (Deluxe Edition)",
            "Length": 285026,
            "SpotifyID": "1ShffyEFRNUKgxyMfURhAN",
            "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab67616d0000b273292fadaac1393b5c7110411c\",\"width\":640},{\"height\":300,\"url\":\"https://i.scdn.co/image/ab67616d00001e02292fadaac1393b5c7110411c\",\"width\":300},{\"height\":64,\"url\":\"https://i.scdn.co/image/ab67616d00004851292fadaac1393b5c7110411c\",\"width\":64}]"
        }
    }
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Get Song Rating by User

```http
  GET http://localhost:3000/rating/song/get/userid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by user",
    "data": [
        {
            "SongRatingID": 25,
            "UserID": 1,
            "SongID": 67,
            "Rating": 4,
            "Date": "2023-12-08 13:40:46",
            "SongInfo": {
                "SongID": 67,
                "Title": "One Of The Girls (with JENNIE, Lily Rose Depp)",
                "ReleaseDate": "2023-06-23",
                "Album": "The Idol Episode 4 (Music from the HBO Original Series)",
                "Length": 244684,
                "SpotifyID": "7CyPwkp0oE8Ro9Dd5CUDjW",
                "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab67616d0000b273b0dd6a5cd1dec96c4119c262\",\"width\":640},{\"height\":300,\"url\":\"https://i.scdn.co/image/ab67616d00001e02b0dd6a5cd1dec96c4119c262\",\"width\":300},{\"height\":64,\"url\":\"https://i.scdn.co/image/ab67616d00004851b0dd6a5cd1dec96c4119c262\",\"width\":64}]"
            }
        },
        // Additional data...
    ]
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Get Song Rating by Song

```http
  POST http://localhost:3000/rating/song/get/songid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song|

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by song",
    "data": [
        {
            "SongRatingID": 25,
            "UserID": 1,
            "SongID": 67,
            "Rating": 4,
            "Date": "2023-12-08 13:40:46",
            "SongInfo": {
                "SongID": 67,
                "Title": "One Of The Girls (with JENNIE, Lily Rose Depp)",
                "ReleaseDate": "2023-06-23",
                "Album": "The Idol Episode 4 (Music from the HBO Original Series)",
                "Length": 244684,
                "SpotifyID": "7CyPwkp0oE8Ro9Dd5CUDjW",
                "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab67616d0000b273b0dd6a5cd1dec96c4119c262\",\"width\":640},{\"height\":300,\"url\":\"https://i.scdn.co/image/ab67616d00001e02b0dd6a5cd1dec96c4119c262\",\"width\":300},{\"height\":64,\"url\":\"https://i.scdn.co/image/ab67616d00004851b0dd6a5cd1dec96c4119c262\",\"width\":64}]"
            }
        },
        // Additional data...
    ]
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Get Song Rating by UserSong

```http
  POST http://localhost:3000/rating/song/get/usersong
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by user and song",
    "data": {
        "SongRatingID": 25,
        "UserID": 1,
        "SongID": 67,
        "Rating": 4,
        "Date": "2023-12-08 13:40:46",
        "SongInfo": {
            "SongID": 67,
            "Title": "One Of The Girls (with JENNIE, Lily Rose Depp)",
            "ReleaseDate": "2023-06-23",
            "Album": "The Idol Episode 4 (Music from the HBO Original Series)",
            "Length": 244684,
            "SpotifyID": "7CyPwkp0oE8Ro9Dd5CUDjW",
            "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab67616d0000b273b0dd6a5cd1dec96c4119c262\",\"width\":640},{\"height\":300,\"url\":\"https://i.scdn.co/image/ab67616d00001e02b0dd6a5cd1dec96c4119c262\",\"width\":300},{\"height\":64,\"url\":\"https://i.scdn.co/image/ab67616d00004851b0dd6a5cd1dec96c4119c262\",\"width\":64}]"
        },
        // Additional data...
    }
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Get Performers Of Rated Songs

**IMPORTANT NOTE**: Use response data from this endpoint for **creating performer ratings** and **exporting song ratings**

```http
  GET http://localhost:3000/rating/song/get/performers
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |


###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Performers of the rated songs by user retrieved",
    "data": [
        {
            "PerformerID": 71,
            "Name": "Lily-Rose Depp",
            "SpotifyID": "1pBLC0qVRTB5zVMuteQ9jJ",
            "Image": null
        },
        // Additional performer data...
    ]
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Create Song Rating 

```http
  POST http://localhost:3000/rating/song/create
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song |
| `rating`  | `int` | **Required**. Rating number (1-5) |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating created",
    "data": {
        "SongRatingID": 62,
        "UserID": 1,
        "SongID": 78,
        "Rating": 3,
        "Date": {
            "fn": "NOW",
            "args": []
        }
    }
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Delete Song Rating 

```http
  POST http://localhost:3000/rating/song/delete
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songId`  | `int` | **Required**. ID of the song |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating removed",
    "data": {}
}
```

##### Delete Song Rating By SongRatingID 

```http
  POST http://localhost:3000/rating/song/delete/songratingid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `songRatingId`  | `int` | **Required**. ID of the song |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating removed",
    "data": {
        "SongRatingID": 25,
        "UserID": 1,
        "SongID": 67,
        "Rating": 4,
        "Date": "2023-12-08 13:40:46",
        "SongInfo": {
            "SongID": 67,
            "Title": "One Of The Girls (with JENNIE, Lily Rose Depp)",
            "ReleaseDate": "2023-06-23",
            "Album": "The Idol Episode 4 (Music from the HBO Original Series)",
            "Length": 244684,
            "SpotifyID": "7CyPwkp0oE8Ro9Dd5CUDjW",
            "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab67616d0000b273b0dd6a5cd1dec96c4119c262\",\"width\":640},{\"height\":300,\"url\":\"https://i.scdn.co/image/ab67616d00001e02b0dd6a5cd1dec96c4119c262\",\"width\":300},{\"height\":64,\"url\":\"https://i.scdn.co/image/ab67616d00004851b0dd6a5cd1dec96c4119c262\",\"width\":64}]"
        }
    }
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Export Song Rating By PerformerName

```http
  POST http://localhost:3000/rating/song/export/performername
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerName`  | `string` | **Required**. Name of the performer |

###### Example Response

- User will receive a text file named 'ratings_export.txt'

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

#### Performer Rating Routes

##### Get Performer Rating by ID

```http
  POST http://localhost:3000/rating/performer/get/ratingid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ratingId`  | `int` | **Required**. ID of the rating|

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by id",
    "data": {
        "PerformerRatingID": 20,
        "UserID": 1,
        "PerformerID": 162,
        "Rating": 3,
        "Date": "2023-12-26 19:58:05",
        "PerformerInfo": {
            "PerformerID": 162,
            "Name": "Ariana Grande",
            "SpotifyID": "66CXWjxzNUsdJxJ2JdwvnR",
            "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952\",\"width\":640},{\"height\":320,\"url\":\"https://i.scdn.co/image/ab67616100005174cdce7620dc940db079bf4952\",\"width\":320},{\"height\":160,\"url\":\"https://i.scdn.co/image/ab6761610000f178cdce7620dc940db079bf4952\",\"width\":160}]"
        }
    }
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Get Performer Rating by User

```http
  GET http://localhost:3000/rating/performer/get/userid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by user id",
    "data": [
        {
            "PerformerRatingID": 20,
            "UserID": 1,
            "PerformerID": 162,
            "Rating": 3,
            "Date": "2023-12-26 19:58:05",
            "PerformerInfo": {
                "PerformerID": 162,
                "Name": "Ariana Grande",
                "SpotifyID": "66CXWjxzNUsdJxJ2JdwvnR",
                "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952\",\"width\":640},{\"height\":320,\"url\":\"https://i.scdn.co/image/ab67616100005174cdce7620dc940db079bf4952\",\"width\":320},{\"height\":160,\"url\":\"https://i.scdn.co/image/ab6761610000f178cdce7620dc940db079bf4952\",\"width\":160}]"
            }
        },
        // Additional data...
    ]
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Get Performer Rating by Performer

```http
  POST http://localhost:3000/rating/performer/get/performerid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer|

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by performer id",
    "data": [
        {
            "PerformerRatingID": 20,
            "UserID": 1,
            "PerformerID": 162,
            "Rating": 3,
            "Date": "2023-12-26 19:58:05",
            "PerformerInfo": {
                "PerformerID": 162,
                "Name": "Ariana Grande",
                "SpotifyID": "66CXWjxzNUsdJxJ2JdwvnR",
                "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952\",\"width\":640},{\"height\":320,\"url\":\"https://i.scdn.co/image/ab67616100005174cdce7620dc940db079bf4952\",\"width\":320},{\"height\":160,\"url\":\"https://i.scdn.co/image/ab6761610000f178cdce7620dc940db079bf4952\",\"width\":160}]"
            }
        },
        // Additional data...
    ]
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Get Performer Rating by UserPerformer

```http
  POST http://localhost:3000/rating/performer/get/userperformer
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating retrieved by user id and performer id",
    "data": [
        {
            "PerformerRatingID": 20,
            "UserID": 1,
            "PerformerID": 162,
            "Rating": 3,
            "Date": "2023-12-26 19:58:05",
            "PerformerInfo": {
                "PerformerID": 162,
                "Name": "Ariana Grande",
                "SpotifyID": "66CXWjxzNUsdJxJ2JdwvnR",
                "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952\",\"width\":640},{\"height\":320,\"url\":\"https://i.scdn.co/image/ab67616100005174cdce7620dc940db079bf4952\",\"width\":320},{\"height\":160,\"url\":\"https://i.scdn.co/image/ab6761610000f178cdce7620dc940db079bf4952\",\"width\":160}]"
            }
        },
        // Additional data...
    ]
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Create Performer Rating 

```http
  POST http://localhost:3000/rating/performer/create
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer |
| `rating`  | `int` | **Required**. Rating number (1-5) |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating created",
    "data": {
        "PerformerRatingID": 22,
        "UserID": 1,
        "PerformerID": 162,
        "Rating": 3,
        "Date": {
            "fn": "NOW",
            "args": []
        }
    }
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Delete Performer Rating 

```http
  POST http://localhost:3000/rating/performer/delete
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerId`  | `int` | **Required**. ID of the performer |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating removed",
    "data": {}
}
```

###### Example Error Response

```json
{
    "status": "error",
    "code": 500, // Error code (example)
    "message": "", // Error message
}
```

##### Delete Performer Rating By PerformerRatingID

```http
  POST http://localhost:3000/rating/performer/delete/performerratingid
```

###### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

###### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `performerRatingId`  | `int` | **Required**. ID of the performer |

###### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Rating removed",
    "data": {
        "PerformerRatingID": 23,
        "UserID": 4,
        "PerformerID": 162,
        "Rating": 4,
        "Date": "2023-12-26 23:57:48",
        "PerformerInfo": {
            "PerformerID": 162,
            "Name": "Ariana Grande",
            "SpotifyID": "66CXWjxzNUsdJxJ2JdwvnR",
            "Image": "[{\"height\":640,\"url\":\"https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952\",\"width\":640},{\"height\":320,\"url\":\"https://i.scdn.co/image/ab67616100005174cdce7620dc940db079bf4952\",\"width\":320},{\"height\":160,\"url\":\"https://i.scdn.co/image/ab6761610000f178cdce7620dc940db079bf4952\",\"width\":160}]"
        }
    }
}
```

###### Example Error Response

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
    "code": "200",
    "message": "Friend is added successfully",
    "data": {
        "FriendID": 3,
        "UserID": 4,
        "FriendUserID": 1
    }
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": "", // Error code
    "message": "", // error message
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
    "code": "200",
    "message": "All friends are obtained",
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

##### Example Error Response

```json
{
    "status": "error",
    "code": "", // Error code
    "message": "", // error message
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
    "code": "200",
    "message": "All friends songs are obtained",
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

##### Example Error Response

```json
{
    "status": "error",
    "code": "", // Error code
    "message": "", // error message
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
    "status": "success",
    "code": 200,
    "message": "Friend is deleted successfully",
    "data": {
        "FriendID": 7,
        "UserID": 4,
        "FriendUserID": 5
    },
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": "", // Error code
    "message": "", // error message
}
```

### Analysis Routes

#### Get Top Rated Songs By Decade

```http
  POST http://localhost:3000/analysis/getTopRatedSongsByDecade
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `decade`  | `int` | **Required**. Year |
| `count`  | `int` | **Required**. Number of the songs |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Top-rated user songs from the decade retrieved successfully",
    "data": [ {
      // song data
    },
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": "", // Error code
    "message": "", // error message
}
```

#### Get Top Rated Songs From Last Months

```http
  POST http://localhost:3000/analysis/getTopRatedSongsFromLastMonths
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`  | `int` | **Required**. Month count |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Top-rated user songs from the last month(s) retrieved successfully",
    "data": [ {
      // song data
    },
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": "", // Error code
    "message": "", // error message
}
```

#### Get Daily Average Rating From Last n Days

```http
  POST http://localhost:3000/analysis/getDailyAverageRating
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `day`  | `int` | **Required**. Day count |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Daily average ratings retrieved successfully",
    "data": [ {
        "date": "Thu Dec 07 2023",
        "averageRating": 3.5
    },
    ]
}
```

##### Example Error Response

```json
{
    "status": "error",
    "code": "", // Error code
    "message": "", // error message
}
```

---

### Recommendation Routes

#### By Song Ratings

```http
  POST http://localhost:3000/recommendation/song/rating
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `numberOfResults`  | `int` | Number of recommendations to get (optional) |

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
            "Length": 285906,
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

#### By Latest Songs

```http
  POST http://localhost:3000/recommendation/song/latest
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `numberOfResults`  | `int` | Number of recommendations to get (optional) |

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
            "Length": 285906,
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

#### By Performer Ratings

```http
  POST http://localhost:3000/recommendation/performer/rating
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `numberOfResults`  | `int` | Number of recommendations to get (optional) |

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
            "Length": 285906,
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

#### By Friends' Ratings

```http
  POST http://localhost:3000/recommendation/friend/rating
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `numberOfResults`  | `int` | Number of recommendations to get (optional) |

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
            "Length": 285906,
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

#### By Friends' Latest Songs

```http
  POST http://localhost:3000/recommendation/friend/latest
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `numberOfResults`  | `int` | Number of recommendations to get (optional) |

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
            "Length": 285906,
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

### User Routes

#### Get User Information

```http
  POST http://localhost:3000/user
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
    "message": "User retrieved successfully",
    "data": {
        "UserID": 18,
        "Name": "Kaan Ozdemir",
        "Email": "kaanozdemir@email.com"
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

#### Search Users

```http
  POST http://localhost:3000/user/search
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Query String Parameters

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `query`  | `string` | Search query |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Users retrieved successfully",
    "data": [
        {
            "UserID": 18,
            "Name": "Kaan Ozdemir",
            "Email": "kaanozdemir@email.com"
        },
        // Additional data...
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

### Playlist Routes

#### Get All User Playlists

```http
  GET http://localhost:3000/playlist/getAllUserPlaylists
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
    "message": "Playlists retrieved successfully",
    "data": [
        {
            "PlaylistID": 1,
            "UserID": 4,
            "Name": "Seksenler Bir Başka",
            "DateAdded": "2024-01-07 20:44:02",
            "Image": null
        }
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

#### Create Playlist

```http
  POST http://localhost:3000/playlist/createPlaylist
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `playlistName`  | `string` | Name of the playlist |
| `songIDs`  | `int array` | Song ids of playlist songs (optional) |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Playlist created successfully",
    "data": {
        "PlaylistID": 3,
        "Name": "00s Hits",
        "UserID": 4,
        "DateAdded": {
            "fn": "NOW",
            "args": []
        },
        "Image": null
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

#### Delete Playlist

```http
  POST http://localhost:3000/playlist/deletePlaylist
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description         |
| :-------- | :------- | :------------------ |
| `playlistID`  | `int` | ID of the playlist |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Playlist deleted successfully",
    "data": 1
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

#### Add Songs To Playlist

```http
  POST http://localhost:3000/playlist/addSongsToPlaylist
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description         |
| :-------- | :------- | :------------------ |
| `playlistID`  | `int` | ID of the playlist |
| `songID`  | `int` | ID of the song         |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Song added to playlist successfully",
    "data": [] //playlistSong data
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

#### Delete Song From Playlist

```http
  POST http://localhost:3000/playlist/deleteSongFromPlaylist
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description         |
| :-------- | :------- | :------------------ |
| `playlistID`  | `int` | ID of the playlist |
| `songID`  | `int` | ID of the song         |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Song deleted from playlist successfully",
    "data": 1
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

#### Get All Songs For A Playlist

```http
  POST http://localhost:3000/playlist/getAllSongsForPlaylist
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description         |
| :-------- | :------- | :------------------ |
| `playlistID`  | `int` | ID of the playlist |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Songs retrieved successfully",
    "data": [] // song data
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

#### Get Available Songs To Add, For A Playlist

```http
  POST http://localhost:3000/playlist/getSongsToAdd
```

##### Header

| Header | Description |
| :-------- | :--------- |
| `Authorization` | JWT Token |

##### Request Body:

| Parameter | Type     | Description         |
| :-------- | :------- | :------------------ |
| `playlistID`  | `int` | ID of the playlist |

##### Example Response

```json
{
    "status": "success",
    "code": 200,
    "message": "Songs retrieved successfully",
    "data": [] // song data
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