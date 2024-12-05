import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/mail.js';
import  User  from "../models/signInModel.js"; 

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Sign-Up Controller
export const signUp = async (req, res) => {
  try {
    const { firstname, surname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword,
    });

    // Send email notification
    try {
      await sendEmail(
        email,
        'Account Created',
        `Hi ${firstname} ${surname}, your account has been successfully created!`
      );
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error.message);
    }

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Respond with user details (omit password)
    res.status(201).json({
      msg: 'User created successfully',
      token,
      user: { firstname, surname, email },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};



// Sign-In Controller
// Sign-In Controller
export const signIn = async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
  
      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid credentials' });
      }
  
      // Set token expiration based on "remember me"
      const tokenExpiry = rememberMe ? '7d' : '1h'; // 7 days for "remember me", 1 hour otherwise
  
      // Generate JWT token
      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });
  
      // Respond with token and user details (omit password)
      res.status(200).json({
        msg: 'Login successful',
        token,
        user: {
          id: existingUser.id,
          firstname: existingUser.firstname,
          surname: existingUser.surname,
          email: existingUser.email,
        },
      });
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  };
  

export const googleSignIn = (req, res) => {

}
