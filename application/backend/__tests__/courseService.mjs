// courseService.mjs

import database from '../database.mjs';

// Function to create a new course
export const createCourse = async (courseData) => {
    return database.add('courses', courseData); 
};

// Function to retrieve a course by ID
export const getCourseById = async (id) => {
    return database.findById('courses', id);
};

// Function to update a course by ID
export const updateCourse = async (id, courseData) => {
    return database.updateById('courses', id, courseData);
};

// Function to delete a course by ID
export const deleteCourse = async (id) => {
    return database.deleteById('courses', id);
};

// Function to list all courses
export const listCourses = async () => {
    return database.findAll('courses');
};
