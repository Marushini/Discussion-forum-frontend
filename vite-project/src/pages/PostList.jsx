import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://final-backend-d6dq.onrender.com/api/posts',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
      }
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://final-backend-d6dq.onrender.com/api/posts',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data, ...posts]);
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Failed to add post. Please try again.');
    }
  };

  const handleReplySubmit = async (postId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://final-backend-d6dq.onrender.com/api/posts/${postId}/replies`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
      setReplyContent('');
      setActiveReplyPostId(null);
    } catch (err) {
      console.error('Reply Error:', err.message);
    }
  };

  const handleLikeReply = async (postId, replyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://final-backend-d6dq.onrender.com/api/posts/${postId}/replies/${replyId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
    } catch (err) {
      console.error('Like Reply Error:', err.message);
    }
  };

  const handleDislikeReply = async (postId, replyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://final-backend-d6dq.onrender.com/api/posts/${postId}/replies/${replyId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
    } catch (err) {
      console.error('Dislike Reply Error:', err.message);
    }
  };

  return (
    <div className="post-list">
      <h1 className="title">Discussion Board</h1>
      {error && <p className="error">{error}</p>}

      <form className="post-form" onSubmit={handlePostSubmit}>
        <h2>Create a Post</h2>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>

      <div className="posts-container">
        {posts.length === 0 && !error ? (
          <p className="no-posts">No posts available</p>
        ) : (
          posts.map((post) => (
            <div className="post-card" key={post._id}>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>

              <button
                className="reply-toggle-btn"
                onClick={() =>
                  setActiveReplyPostId(
                    activeReplyPostId === post._id ? null : post._id
                  )
                }
              >
                {activeReplyPostId === post._id ? 'Cancel' : 'Reply'}
              </button>

              {activeReplyPostId === post._id && (
                <form
                  className="reply-form"
                  onSubmit={(e) => handleReplySubmit(post._id, e)}
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                  />
                  <button type="submit">Submit Reply</button>
                </form>
              )}

              <div className="replies-section">
                <h3>Replies:</h3>
                {post.replies?.map((reply) => (
                  <div className="reply-item" key={reply._id}>
                    <p>{reply.content}</p>
                    <div className="reply-actions">
                      <button
                        className="like-btn"
                        onClick={() => handleLikeReply(post._id, reply._id)}
                      >
                        Like
                      </button>
                      <span>Likes: {reply.likes}</span>
                      <button
                        className="dislike-btn"
                        onClick={() => handleDislikeReply(post._id, reply._id)}
                      >
                        Dislike
                      </button>
                      <span>Dislikes: {reply.dislikes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostList;
