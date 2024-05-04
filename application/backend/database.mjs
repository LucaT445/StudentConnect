import mongoose from "mongoose";
import User from "./models/User.mjs";

// Connect to the database
export async function connectToDatabase() {
  try {
    // Make sure to use the correct environment variable name that matches your .env file
    const dbUri = process.env.DB_URI;
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

// Insert users into the database using array populated from the login form
export async function insertUsers(usersData) {
  // Consider connecting to the database only once at the application start-up, not every time you insert users
  for (const userData of usersData) {
    const newUser = new User({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      karmaPoints: 0,
      pronouns: userData.pronouns,
      role: userData.role,
      dateJoined: new Date(),
    });

    try {
      const savedUser = await newUser.save();
      console.log("User successfully saved:", savedUser);
    } catch (err) {
      if (err.code === 11000) {
        console.error("Error saving user: Duplicate field", err);
      } else {
        console.error("Error saving user:", err);
      }
    }
  }
}

