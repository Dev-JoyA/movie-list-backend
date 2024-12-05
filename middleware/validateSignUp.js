import validator from "validator";

const validateSignup = (req, res, next) => {
  const { firstname, surname, email, password } = req.body;

  if (!firstname || !surname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  next();
};

export default validateSignup;
