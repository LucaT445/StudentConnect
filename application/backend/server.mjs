import path from "path";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";
import { fileURLToPath } from "url";
import { database } from "./database.mjs"; 
import User from "./models/User.mjs";
import Class from "./models/Classes.mjs";
import QAForms from "./models/QAForum.mjs";
import { ObjectId } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const root = path.resolve(__dirname, "..", "build");
app.use(express.static(root));

// Use database instance to connect
database.connectToDatabase();

// Further uses of database
app.post("/api/users", async (req, res) => {
  try {
    const userData = req.body;
    await database.insertUsers(userData);
    res.status(201).json({ message: "Users added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add users", error: err.message });
  }
});

// enter using info when trying to login and check that password matches
// store user information to local storage so it can be accessed later
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      karmaPoints: user.karmaPoints,
      pronouns: user.pronouns,
      role: user.role,
      dateJoined: user.dateJoined,
    };

    res.json({ message: "Login successful", user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// endpoint for teachers to create classes using id to link to the teacher
app.post("/api/classes", async (req, res) => {
  console.log("Received data:", req.body);
  const { classID, className, teacherID } = req.body;
  try {
    const newClass = new Class({
      classID,
      className,
      teacher: teacherID,
    });
    await newClass.save();
    res.status(201).json({
      message: "Class created successfully",
      classID: newClass.classID,
    });
  } catch (error) {
    console.error("Error when creating class:", error);
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      message: "Failed to create class",
      error: error.message,
    });
  }
});

// endpoint for students to join, checks if their classID exists if so checks if studentID is in the
// array and if not adds them
app.post("/api/classes/join", async (req, res) => {
  const { classID, studentID } = req.body;
  try {
    const existingClass = await Class.findOne({ classID });
    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (!existingClass.students.includes(studentID)) {
      existingClass.students.push(studentID);
      await existingClass.save();
      res.status(200).json({ message: "Joined class successfully" });
    } else {
      res.status(400).json({ message: "Already joined this class" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to join class", error: error.message });
  }
});

/**
 *  Endpoint to get a student's joined classes and a teachers created classes with the userID.
 *  If the user is a student it will look for all classes where the userID is contained in the students array along with all the
 *  names of the teachers for those classes.
 *  If the user is a teacher it will get all the classes that the userID matches the teacher's ID for the class.
 */
app.get("/api/classes/get/:userId", async (req, res) => {
  const { userId } = req.params;
  const userInformation = await User.findOne({ _id: new ObjectId(userId) });
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }
  if (userInformation.role == "student") {
    try {
      const classes = await Class.find({ students: new ObjectId(userId) });
      const teachers = [];
      for (let i = 0; i < classes.length; i++) {
        const teacher = await User.findById(classes[i].teacher);
        teachers.push(teacher);
      }
      res.send([classes, teachers]);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    try {
      const classes = await Class.find({ teacher: new ObjectId(userId) });
      res.send(classes);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

/**
 *  Endpoint to get a a course's information with the courseID.
 *  It will take the courseID to query through all the classes and return the matching class.
 */
app.get("/api/course/get/:courseID", async (req, res) => {
  const { courseID } = req.params;
  try {
    const course = await Class.find({ _id: new ObjectId(courseID) });
    res.send(course);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to create an announcment in the Q&A form.
 * Takes the courseID and the authorID, which is the teacher.
 */
app.post("/api/classes/announcement/create", async (req, res) => {
  const { authorID, courseID, datePosted, title, message, questionID, type } =
    req.body;
  try {
    const newAnnouncement = new QAForms({
      authorID,
      courseID,
      datePosted,
      title,
      message,
      questionID,
      type,
    });
    await newAnnouncement.save();
    res.status(201).json({
      message: "Announcement created successfully",
      classID: newAnnouncement.courseID,
    });
  } catch (error) {
    console.error("Error when creating announcement:", error);
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      message: "Failed to create announcement",
      error: error.message,
    });
  }
});

// catch all
app.use("/*", (req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + process.env.PORT);
});
