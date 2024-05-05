
import { database } from '../database.mjs';

export const enrollStudent = async (classId, studentId) => {
    return await database.enroll(classId, studentId);
};

export const removeStudent = async (classId, studentId) => {
    return await database.unenroll(classId, studentId);
};

export const listStudents = async (classId) => {
    return await database.listEnrolledStudents(classId);
};
