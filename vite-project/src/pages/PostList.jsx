import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token') || '123456';
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
      const token = localStorage.getItem('token') || '123456';
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

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token') || '123456';
      const response = await axios.post(
        `https://final-backend-d6dq.onrender.com/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map(post => (post._id === postId ? response.data : post)));
    } catch (err) {
      console.error('Like Error:', err.message);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const token = localStorage.getItem('token') || '123456';
      const response = await axios.post(
        `https://final-backend-d6dq.onrender.com/api/posts/${postId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map(post => (post._id === postId ? response.data : post)));
    } catch (err) {
      console.error('Dislike Error:', err.message);
    }
  };

  const toggleReplyBox = (postId) => {
    setActiveReplyPostId(activeReplyPostId === postId ? null : postId);
    setReplyContent('');
  };

  const handleReplySubmit = async (postId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '123456';
      const response = await axios.post(
        `https://final-backend-d6dq.onrender.com/api/posts/${postId}/replies`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map(post => (post._id === postId ? response.data : post)));
      setActiveReplyPostId(null);
      setReplyContent('');
    } catch (err) {
      console.error('Reply Error:', err.message);
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
              <div className="post-footer">
                <button className="like-btn" onClick={() => handleLike(post._id)}>Like</button>
                <span>Likes: {post.likes}</span>
                <button className="dislike-btn" onClick={() => handleDislike(post._id)}>Dislike</button>
                <span>Dislikes: {post.dislikes}</span>
                <button
                  className="reply-toggle-btn"
                  onClick={() => toggleReplyBox(post._id)}
                >
                  {activeReplyPostId === post._id ? 'Cancel' : 'Reply'}
                </button>
              </div>

              {activeReplyPostId === post._id && (
                <form
                  className="reply-form"
                  onSubmit={(e) => handleReplySubmit(post._id, e)}
                >
                  <label>Add a Reply:</label>
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
                  <p key={reply._id} className="reply-item">
                    {reply.content}
                  </p>
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
