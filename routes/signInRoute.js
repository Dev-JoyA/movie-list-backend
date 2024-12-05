import express from "express";
import { signUp, signIn, googleSignIn } from "../controllers/signInController.js";
import validateSignup from "../middleware/validateSignup.js";
import validateSignin from "../middleware/validateSignin.js";

const router = express.Router();

router.post("/signup", validateSignup, signUp); // Validation middleware for signup
router.post("/signin", validateSignin, signIn); 

  
router.get("/google", googleSignIn);

export default router;
