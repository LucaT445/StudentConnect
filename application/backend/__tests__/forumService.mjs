import database from '../database.mjs';

export const createPost = async (postData) => {
    return database.create('posts', postData);
};

export const getPostById = async (postId) => {
    return database.findById('posts', postId);
};

export const updatePost = async (postId, updateData) => {
    return database.updateById('posts', postId, updateData);
};

export const deletePost = async (postId) => {
    return database.deleteById('posts', postId);
};

export const listPosts = async (filter = {}) => {
    return database.findAll('posts', filter);
};