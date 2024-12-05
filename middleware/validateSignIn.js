import validator from "validator";

const validateSignin = (req, res, next) => {
  const { email, password } = req.body;
  console.log("Email received for sign-in:", email);


  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  next();
};

export default validateSignin;
