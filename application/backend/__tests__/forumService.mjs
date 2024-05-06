import { database } from '../database.mjs';

const posts = {};

export const createPost = async (postId, content, owner) => {
    if (!posts[postId]) {
      posts[postId] = { content, owner };
      return { success: true, postId, content, owner };
    }
    return { success: false, message: "Post already exists" };
  };

export const getPostById = async (postId) => {
    return database.findById('posts', postId);
};

export const updatePost = async (postId, updateData) => {
    return database.updateById('posts', postId, updateData);
};

export const deletePost = async (postId, requester) => {
    if (posts[postId] && posts[postId].owner === requester) {
      delete posts[postId];
      return { success: true, message: "Post deleted successfully" };
    }
    return { success: false, message: "Unauthorized deletion attempt or post does not exist" };
  };

  export const retrievePost = async (postId) => {
    if (posts[postId]) {
      return { success: true, post: posts[postId] };
    }
    return { success: false, message: "Post not found" };
  };

export const listPosts = async (filter = {}) => {
    return database.findAll('posts', filter);
};

