import mongoose from "mongoose";
import User from "./models/User.mjs";
import Class from "./models/Classes.mjs"; 
import QAForum from "./models/QAForum.mjs";
import dotenv from 'dotenv';
dotenv.config();

class Database {
    async connectToDatabase() {
        try {
            const dbUri = process.env.DB_URI;
            await mongoose.connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000 
            });
            console.log("Connected to Database");
        } catch (err) {
            console.error("Database connection error:", err);
        }
    }

    async create(collection, data) {
        if (collection === 'posts') {
            const newPost = new QAForum(data);
            return await newPost.save();
        }
        
    }

    async findById(collection, id) {
        if (collection === 'posts') {
            return await QAForum.findById(id);
        }
        
    }

    async updateById(collection, id, updateData) {
        if (collection === 'posts') {
            return await QAForum.findByIdAndUpdate(id, updateData, { new: true });
        }
       
    }

    async deleteById(collection, id) {
        if (collection === 'posts') {
            return await QAForum.findByIdAndDelete(id);
        }
        
    }

    async findAll(collection) {
        if (collection === 'posts') {
            return await QAForum.find({});
        }
        
    }

    async createClass(classData) {
        const newClass = new Class(classData);
        try {
            await newClass.save();
            console.log("Class created successfully:", newClass);
            return newClass; 
        } catch (err) {
            console.error("Error creating class:", err);
            throw err; 
        }
    }

    async insertUsers(usersData) {
        for (const userData of usersData) {
            const newUser = new User(userData);
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

    // Enroll a student in a class
    async enroll(classId, studentId) {
        const classToUpdate = await Class.findById(classId);
        if (!classToUpdate.students.includes(studentId)) {
            classToUpdate.students.push(studentId);
            await classToUpdate.save();
            return { message: "Student enrolled successfully", status: true };
        }
        return { message: "Student already enrolled", status: false };
    }

    // Remove a student from a class
    async unenroll(classId, studentId) {
        const classToUpdate = await Class.findById(classId);
        const index = classToUpdate.students.indexOf(studentId);
        if (index > -1) {
            classToUpdate.students.splice(index, 1);
            await classToUpdate.save();
            return { message: "Student unenrolled successfully", status: true };
        }
        return { message: "Student not found", status: false };
    }

   
    async listEnrolledStudents(classId) {
        const classToView = await Class.findById(classId).populate('students');
        return classToView.students; 
    }
}

export const database = new Database();



