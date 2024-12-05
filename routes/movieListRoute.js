import express from "express";
import { getMovies, createMovies, editMovies } from "../controllers/movieListController.js";
import { verifyToken } from "../middleware/verifyToken.js";



const router = express.Router();

router.get("/getAll", verifyToken, getMovies) 
router.post("/add-movie", verifyToken, createMovies )
router.patch("edit-movie" , verifyToken,  editMovies)

  


export default router;
