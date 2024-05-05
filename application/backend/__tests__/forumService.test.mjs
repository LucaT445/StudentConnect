// Importing with destructuring to help Jest understand what to mock.
import { createPost, getPostById, updatePost, deletePost, listPosts } from './forumService.mjs';
import database from '../database.mjs';

jest.mock('../database.mjs', () => {
    return {
        __esModule: true, // This property tells Jest that this module is an ES module.
        default: { // This will mock the default export, which is expected to be an object.
            create: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            findAll: jest.fn()
        }
    };
});

describe('Forum Service Tests', () => {
    beforeEach(() => {
        // Clear previous mocking info before each test
        jest.clearAllMocks();

        // Setup default resolved values for each mock function
        database.create.mockResolvedValue();
        database.findById.mockResolvedValue();
        database.updateById.mockResolvedValue();
        database.deleteById.mockResolvedValue();
        database.findAll.mockResolvedValue();
    });

    test('Create a new post', async () => {
        const mockPostData = { title: 'New Post', content: 'Content of the new post' };
        const expectedResponse = { id: 1, ...mockPostData };
        database.create.mockResolvedValue(expectedResponse);

        const result = await createPost(mockPostData);
        expect(database.create).toHaveBeenCalledWith('posts', mockPostData);
        expect(result).toEqual(expectedResponse);
    });

    test('Retrieve a post by ID', async () => {
        const postId = 1;
        const mockPost = { id: postId, title: 'Existing Post', content: 'Content of the existing post' };
        database.findById.mockResolvedValue(mockPost);

        const result = await getPostById(postId);
        expect(database.findById).toHaveBeenCalledWith('posts', postId);
        expect(result).toEqual(mockPost);
    });

    test('Update a post by ID', async () => {
        const postId = 1;
        const mockUpdateData = { title: 'Updated Post' };
        const updatedPost = { id: postId, ...mockUpdateData };
        database.updateById.mockResolvedValue(updatedPost);

        const result = await updatePost(postId, mockUpdateData);
        expect(database.updateById).toHaveBeenCalledWith('posts', postId, mockUpdateData);
        expect(result).toEqual(updatedPost);
    });

    test('Delete a post', async () => {
        const postId = 1;
        const deleteResponse = { id: postId };
        database.deleteById.mockResolvedValue(deleteResponse);

        const result = await deletePost(postId);
        expect(database.deleteById).toHaveBeenCalledWith('posts', postId);
        expect(result).toEqual(deleteResponse);
    });

    test('List all posts', async () => {
        const mockPosts = [
            { id: 1, title: 'Post One', content: 'Content of post one' },
            { id: 2, title: 'Post Two', content: 'Content of post two' }
        ];
        database.findAll.mockResolvedValue(mockPosts);
    
        const result = await listPosts(); // Now explicitly assuming no filter is provided
        expect(database.findAll).toHaveBeenCalledWith('posts', {}); // Expecting an empty object as the default filter
        expect(result).toEqual(mockPosts);
    });
    
});


