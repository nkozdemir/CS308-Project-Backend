/* 
TODO:
- Before adding songs, check whether they exist on Spotify or not
- If they exist on Spotify, add them to the database from Spotify API
- If they don't exist on Spotify, add them to the database from CSV file
*/
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');

const songController = require('../controllers/songController');
const userSongController = require('../controllers/userSongController'); 
const performerController = require('../controllers/performerController'); 
const songPerformerController = require('../controllers/songPerformerController'); 
const genreController = require('../controllers/genreController'); 
const songGenreController = require('../controllers/songGenreController'); 
const authenticateToken = require('../helpers/authToken');

// Set up the storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Check if the 'uploads' directory exists, and create it if not
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Set up the file filter to only accept .csv files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Only .csv files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 }, // Limit file size to 1MB
});

// Function to parse the uploaded CSV file and extract fields
const parseCSV = (filePath) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        // Extract fields from CSV data
        const { title, performers, album, length, genres, releaseDate } = data;
        results.push({ title, performers, album, length, genres, releaseDate });
      })
      .on('end', () => {
        /*
        // Delete the uploaded file after processing
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully.');
            }
        });
        */
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Set up a route for file uploading
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  // Get the user ID from the JWT
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).send({
        status: 'error',
        code: 400,
        message: 'No file uploaded',
    });
  }

  // Get the path of the uploaded file
  const filePath = req.file.path;

  try {
    // Parse the CSV file and extract fields
    const parsedData = await parseCSV(filePath);

    // Further processing with the extracted fields
    console.log('Extracted Fields:', parsedData);

    // Add each song inside parsedData to the database
    for (const song of parsedData) {
      // Check if song already exists in database, if exists link user to song and skip
      const existingSong = await songController.getSongByTitleAndAlbum(song.title, song.album);
      if (existingSong) {
        // Add song to UserSongs table
        await userSongController.linkUserSong(userId, existingSong.SongID);
      } else {
        // Add song to Songs table
        const songId = await songController.createSong(song);
        // Add song to UserSongs table
        await userSongController.linkUserSong(userId, songId.SongID);

        // Seperate performers and genres into arrays
        const performersArr = song.performers.split(',').map((performer) => performer.trim());
        const genresArr = song.genres.split(',').map((genre) => genre.trim());

        // Add performers of the song to Performers table, one by one
        for (const performer of performersArr) {
          console.log('Performer:', performer);
          const performerIds = await performerController.createPerformer(performer, null);
          // Add song to SongPerformers table
          await songPerformerController.linkSongPerformer(songId.SongID, performerIds.PerformerID);
        }
        
        // Add genres of the song to Genres table, one by one
        for (const genre of genresArr) {
          console.log('Genre:', genre);
          const genreIds = await genreController.createGenre(genre);
          // Add song to SongGenres table
          await songGenreController.linkSongGenre(songId.SongID, genreIds.GenreID);
        }
        
        console.log('Song added to database successfully.');
      }
    }

    res.status(200).send({
        status: 'success',
        code: 200,
        message: 'Song(s) uploaded from CSV file successfully',
        data: parsedData,
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    res.status(500).send({
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
    })
  }
});

module.exports = router;