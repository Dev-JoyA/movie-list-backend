import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { testConnection } from './utils/dbConnect.js';
import signInRouter from './routes/signInRoute.js';
import movieRouter from "./routes/movieListRoute.js"

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

testConnection();

// Create schemas and tables


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend's URL
    methods: ['GET', 'POST',"PUT", "PATCH" , "DELETE"],
  }));

// Routes
app.use('/auth', signInRouter);
app.use("/movies",  movieRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
