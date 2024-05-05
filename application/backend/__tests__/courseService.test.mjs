
import { createCourse, getCourseById, updateCourse, deleteCourse, listCourses } from './courseService.mjs';
import database from '../database.mjs';

// Mock the database module
jest.mock('../database.mjs', () => ({
    add: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    findAll: jest.fn()
}));

describe('Course Management Service Tests', () => {
    beforeEach(() => {
        // Clear previous mocking info before each test
        jest.clearAllMocks();
    });

    test('Create a new course successfully', async () => {
        const mockCourseData = { title: 'Introduction to Testing', code: 'TEST101' };
        database.add.mockResolvedValue({ id: 1, ...mockCourseData });

        const result = await createCourse(mockCourseData);
        expect(database.add).toHaveBeenCalledWith('courses', mockCourseData);
        expect(result).toEqual({ id: 1, ...mockCourseData });
    });

    test('Retrieve a course by ID', async () => {
        const courseId = 1;
        const mockCourse = { id: courseId, title: 'Advanced Testing', code: 'TEST201' };
        database.findById.mockResolvedValue(mockCourse);

        const result = await getCourseById(courseId);
        expect(database.findById).toHaveBeenCalledWith('courses', courseId);
        expect(result).toEqual(mockCourse);
    });

    test('Update a course by ID', async () => {
        const courseId = 1;
        const mockCourseData = { title: 'Updated Title', code: 'TEST202' };
        database.updateById.mockResolvedValue({ id: courseId, ...mockCourseData });

        const result = await updateCourse(courseId, mockCourseData);
        expect(database.updateById).toHaveBeenCalledWith('courses', courseId, mockCourseData);
        expect(result).toEqual({ id: courseId, ...mockCourseData });
    });

    test('Delete a course by ID', async () => {
        const courseId = 1;
        database.deleteById.mockResolvedValue({ id: courseId });

        const result = await deleteCourse(courseId);
        expect(database.deleteById).toHaveBeenCalledWith('courses', courseId);
        expect(result).toEqual({ id: courseId });
    });

    test('List all courses', async () => {
        const mockCourses = [
            { id: 1, title: 'Intro to Testing', code: 'TEST101' },
            { id: 2, title: 'Advanced Testing', code: 'TEST201' }
        ];
        database.findAll.mockResolvedValue(mockCourses);

        const result = await listCourses();
        expect(database.findAll).toHaveBeenCalledWith('courses');
        expect(result).toEqual(mockCourses);
    });
});

