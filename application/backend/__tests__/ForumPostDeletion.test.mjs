import { createPost, deletePost, retrievePost } from './forumService.mjs';

describe('Forum Post Deletion and Non-retrievability Tests', () => {
  const postId = 'post1';
  const userA = 'userA';
  const userB = 'userB';

  test('Test A: Normal Deletion Scenario', async () => {
    // Create a post
    await createPost(postId, 'This is a test post', userA);

    // Delete the post
    const deletionResult = await deletePost(postId, userA);
    expect(deletionResult.success).toBeTruthy();

    // Attempt to retrieve the post
    const retrievalResult = await retrievePost(postId);
    expect(retrievalResult.success).toBeFalsy();
  });

  test('Test B: Unauthorized Deletion Attempt', async () => {
    // Create a post by userA
    await createPost(postId, 'This is another test post', userA);

    // Attempt deletion by userB
    const unauthorizedDeletionResult = await deletePost(postId, userB);
    expect(unauthorizedDeletionResult.success).toBeFalsy();

    // Confirm the post is still retrievable by the original creator
    const postRetrieval = await retrievePost(postId);
    expect(postRetrieval.success).toBeTruthy();
    expect(postRetrieval.post.owner).toEqual(userA);
  });
});
