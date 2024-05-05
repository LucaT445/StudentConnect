// classService.test.mjs
import { enrollStudent, removeStudent, listStudents } from './classService.mjs';
import { database } from '../database.mjs';

jest.mock('../database.mjs');  // Mock the database module

describe('Class Enrollment Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();  // Clear previous mocking info before each test
    });

    test('Enroll a student successfully', async () => {
        const classId = 'class123';
        const studentId = 'student123';
        database.enroll.mockResolvedValue({ message: "Student enrolled successfully", status: true });

        const result = await enrollStudent(classId, studentId);
        expect(database.enroll).toHaveBeenCalledWith(classId, studentId);
        expect(result).toEqual({ message: "Student enrolled successfully", status: true });
    });

    test('Remove a student successfully', async () => {
        const classId = 'class123';
        const studentId = 'student456';
        database.unenroll.mockResolvedValue({ message: "Student unenrolled successfully", status: true });

        const result = await removeStudent(classId, studentId);
        expect(database.unenroll).toHaveBeenCalledWith(classId, studentId);
        expect(result).toEqual({ message: "Student unenrolled successfully", status: true });
    });

    test('List all students in a class', async () => {
        const classId = 'class789';
        const students = [{ id: 'student1', name: 'John Doe' }, { id: 'student2', name: 'Jane Doe' }];
        database.listEnrolledStudents.mockResolvedValue(students);

        const result = await listStudents(classId);
        expect(database.listEnrolledStudents).toHaveBeenCalledWith(classId);
        expect(result).toEqual(students);
    });
});
