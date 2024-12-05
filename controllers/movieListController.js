import MovieList from '../models/moviesModel.js';  // Assuming this is your MovieList model
import fs from 'fs'; // For file streams
import path from 'path'; // To handle file paths


export const getMovies = async (req, res) => {
    // Check if the user is authenticated
    if (!req.user) {  // Assuming `req.user` is set if the user is authenticated
      return res.status(401).json({ msg: 'You must be signed in to access the movie list.' });
    }
  
    try {
      // Retrieve all movies from the database
      const movies = await MovieList.findAll();
  
      // Check if there are no movies
      if (movies.length === 0) {
        return res.status(404).json({ msg: 'No movies found.' });
      }
  
      // Respond with the list of movies
      res.status(200).json({
        msg: 'Movies fetched successfully!',
        movies,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'An error occurred while fetching movies.' });
    }
  };


// Create movie controller
// export const createMovies = async (req, res) => {
//   // Check if the user is authenticated
//   if (!req.user) { // Assuming req.user is set if the user is authenticated
//     return res.status(401).json({ msg: 'You must be signed in to create a movie.' });
//   }

//   // Extract data from the request
//   const { title, publishing_year } = req.body;

//   // Make sure the required fields are provided
//   if (!title || !publishing_year) {
//     return res.status(400).json({ msg: 'Title and publishing year are required.' });
//   }

//   try {
//     // Process the movie file and poster file (assuming these are coming in as 'movie' and 'poster' in the form)
//     const movieStream = req.files.movie;
//     const posterStream = req.files.poster;

//     if (!movieStream || !posterStream) {
//       return res.status(400).json({ msg: 'Both movie and poster files are required.' });
//     }

//     // Create the file paths for saving the files
//     const movieFilePath = path.join(__dirname, '../uploads/movies', `${Date.now()}_${movieStream.name}`);
//     const posterFilePath = path.join(__dirname, '../uploads/posters', `${Date.now()}_${posterStream.name}`);

//     // Stream movie file and save it
//     const movieWriteStream = fs.createWriteStream(movieFilePath);
//     movieStream.pipe(movieWriteStream);

//     // Stream poster file and save it
//     const posterWriteStream = fs.createWriteStream(posterFilePath);
//     posterStream.pipe(posterWriteStream);

//     // Wait until both files are written to disk
//     await Promise.all([new Promise((resolve, reject) => {
//       movieWriteStream.on('finish', resolve);
//       movieWriteStream.on('error', reject);
//     }), new Promise((resolve, reject) => {
//       posterWriteStream.on('finish', resolve);
//       posterWriteStream.on('error', reject);
//     })]);

//     // Once files are saved, create the movie record in the database
//     const newMovie = await MovieList.create({
//       title,
//       publishing_year,
//       poster: fs.readFileSync(posterFilePath), // Save the poster file as BLOB
//       movie: fs.readFileSync(movieFilePath), // Save the movie file as BLOB
//     });

//     // Respond with the created movie data
//     res.status(201).json({
//       msg: 'Movie created successfully!',
//       movie: newMovie,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: 'An error occurred while creating the movie.' });
//   }
// };

export const createMovies = async (req, res) => {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ msg: 'You must be signed in to create a movie.' });
    }
  
    // Extract data from the request
    const { title, publishing_year } = req.body;
  
    // Make sure the required fields are provided
    if (!title || !publishing_year) {
      return res.status(400).json({ msg: 'Title and publishing year are required.' });
    }
  
    // Make sure files are included in the request
    if (!req.files || !req.files.movie || !req.files.poster) {
      return res.status(400).json({ msg: 'Both movie and poster files are required.' });
    }
  
    // Get the movie and poster files from the request
    const movieStream = req.files.movie[0]; // Assuming only one file for each
    const posterStream = req.files.poster[0];
  
    try {
      // Create unique file paths for saving the files
      const movieFilePath = path.join(__dirname, '../uploads/movies', `${Date.now()}_${movieStream.originalname}`);
      const posterFilePath = path.join(__dirname, '../uploads/posters', `${Date.now()}_${posterStream.originalname}`);
  
      // Create write streams to save the files to disk
      const movieWriteStream = fs.createWriteStream(movieFilePath);
      const posterWriteStream = fs.createWriteStream(posterFilePath);
  
      // Pipe the file data into the write streams
      movieStream.stream.pipe(movieWriteStream);
      posterStream.stream.pipe(posterWriteStream);
  
      // Wait for both file streams to finish
      await Promise.all([
        new Promise((resolve, reject) => {
          movieWriteStream.on('finish', resolve);
          movieWriteStream.on('error', reject);
        }),
        new Promise((resolve, reject) => {
          posterWriteStream.on('finish', resolve);
          posterWriteStream.on('error', reject);
        })
      ]);
  
      // Once files are saved, create the movie record in the database
      const newMovie = await MovieList.create({
        title,
        publishing_year,
        poster: posterFilePath, // Store the file path for the poster (or as BLOB if necessary)
        movie: movieFilePath,   // Store the file path for the movie (or as BLOB if necessary)
      });
  
      // Respond with the created movie data
      res.status(201).json({
        msg: 'Movie created successfully!',
        movie: newMovie,
      });
  
    } catch (error) {
      console.error('Error creating movie:', error);
      res.status(500).json({ msg: 'An error occurred while creating the movie.' });
    }
  };


export const editMovies = async (req, res) => {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ msg: 'You must be signed in to edit a movie.' });
    }
  
    const { movieId } = req.params;  // Movie ID from URL params
    const { title, poster, publishing_year, movie } = req.body;  // Movie data from request body
  
    // Check if the movie exists
    const existingMovie = await MovieList.findByPk(movieId);
    if (!existingMovie) {
      return res.status(404).json({ msg: 'Movie not found.' });
    }
  
    // Validate required fields
    if (!title || !publishing_year) {
      return res.status(400).json({ msg: 'Title and publishing year are required.' });
    }
  
    try {
      // Update the movie
      await existingMovie.update({
        title,
        poster,  // Poster is optional (can be null)
        publishing_year,
        movie,    // Movie file is optional (can be null)
      });
  
      // Respond with success
      res.status(200).json({
        msg: 'Movie updated successfully!',
        movie: existingMovie,  // Return the updated movie object
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'An error occurred while updating the movie.' });
    }
  };