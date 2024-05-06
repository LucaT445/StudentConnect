
import { database } from '../database.mjs';

export const createClass = async (classInfo) => {
    return await database.createClass(classInfo);
};

export const getClass = async (classId) => {
    return await database.findById('classes', classId);
};

export const deleteClass = async (classId, user = 'authorizedUser') => {
    const existingClass = await database.findById('classes', classId);
    if (!existingClass) {
        return { success: false, message: "Class does not exist" };
    }
    if (user !== 'authorizedUser') {
        return { success: false, message: "Unauthorized deletion attempt" };
    }
    await database.deleteById('classes', classId);
    return { success: true, message: "Class deleted successfully" };
};


export const enrollStudent = async (classId, studentId) => {
    return await database.enroll(classId, studentId);
};

export const removeStudent = async (classId, studentId) => {
    return await database.unenroll(classId, studentId);
};

export const listStudents = async (classId) => {
    return await database.listEnrolledStudents(classId);
};

