import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Discussion() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://final-backend-d6dq.onrender.com/api/posts');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts.');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://final-backend-d6dq.onrender.com/api/posts',
        newPost,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost({ title: '', content: '' });
      fetchPosts(); // Refresh posts
    } catch (err) {
      setError('Failed to create post.');
    }
  };

  const handleReply = async (postId, replyContent) => {
    try {
      await axios.post(
        `https://final-backend-d6dq.onrender.com/api/replies/${postId}`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts(); // Refresh posts
    } catch (err) {
      setError('Failed to reply to post.');
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Discussion Forum</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleCreatePost} style={styles.postForm}>
        <h3>Create a New Post</h3>
        <label style={styles.label}>Title:</label>
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          required
          style={styles.input}
        />
        <label style={styles.label}>Content:</label>
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          required
          style={styles.textarea}
        ></textarea>
        <button type="submit" style={styles.button}>Post</button>
      </form>

      <h2 style={styles.subHeader}>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={styles.postCard}>
            <h3 style={styles.postTitle}>{post.title}</h3>
            <p style={styles.postContent}>{post.content}</p>
            <h4 style={styles.repliesHeader}>Replies:</h4>
            {post.replies && post.replies.length > 0 ? (
              post.replies.map((reply) => (
                <p key={reply._id} style={styles.replyItem}>- {reply.content}</p>
              ))
            ) : (
              <p>No replies </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const replyContent = e.target.elements.replyContent.value;
                handleReply(post._id, replyContent);
                e.target.reset();
              }}
            >
              <input
                type="text"
                name="replyContent"
                placeholder="Write a reply..."
                required
                style={styles.replyInput}
              />
              <button type="submit" style={styles.button}>Reply</button>
            </form>
          </div>
        ))
      )}
    </div>
  );
}

export default Discussion;

const styles = {
  page: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: '"Arial", sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  postForm: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '1rem',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
  },
  button: {
    background: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  subHeader: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '15px',
  },
  postCard: {
    background: '#fff',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  postTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '10px',
  },
  postContent: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '15px',
  },
  repliesHeader: {
    fontSize: '1.2rem',
    color: '#444',
    marginTop: '15px',
  },
  replyItem: {
    background: '#f1f1f1',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  replyInput: {
    width: '75%',
    padding: '8px',
    marginRight: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};
