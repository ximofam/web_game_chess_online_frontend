import { authClient } from '../../auth/api/authClient';

/**
 * Forum API service — posts, comments, post-images.
 */
export const forumService = {
  // ── Posts ────────────────────────────────────────────────────────────────

  getPosts: (page = 0, size = 20) =>
    authClient.get('/api/posts', { params: { page, size, sort: 'createdAt,desc' } })
      .then(r => r.data),

  getPost: (postId) =>
    authClient.get(`/api/posts/${postId}`).then(r => r.data),

  createPost: (body) =>
    authClient.post('/api/posts', body).then(r => r.data),

  likePost: (postId, isLike) =>
    authClient.post(`/api/posts/${postId}/likes`, null, { params: { isLike } }).then(r => r.data),

  // ── Comments ─────────────────────────────────────────────────────────────

  getComments: (postId, page = 0, size = 10) =>
    authClient.get(`/api/posts/${postId}/comments`, { params: { page, size, sortBy: 'createdAt' } })
      .then(r => r.data),

  getReplies: (commentId, page = 0, size = 10) =>
    authClient.get(`/api/comments/${commentId}/replies`, { params: { page, size, sortBy: 'createdAt' } })
      .then(r => r.data),

  createComment: (body) =>
    authClient.post('/api/comments', body).then(r => r.data),

  likeComment: (commentId, isLike) =>
    authClient.post(`/api/comments/${commentId}/likes`, null, { params: { isLike } }).then(r => r.data),

  // ── Post Images ───────────────────────────────────────────────────────────

  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return authClient.post('/api/post-images', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data); // { url, publicId }
  },

  deleteImage: (publicId) =>
    authClient.delete('/api/post-images', { params: { publicId } }),
};
