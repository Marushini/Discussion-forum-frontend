import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [error, setError] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://discussion-forum-backend-67bc.onrender.com/api/posts',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(response.data.posts);  // Access the posts array
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
      }
    };
    fetchPosts();
  }, []);

  // Create a post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://discussion-forum-backend-67bc.onrender.com/api/posts',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data, ...posts]);
      setTitle('');
      setContent('');
    } catch {
      setError('Failed to add post. Please try again.');
    }
  };

  // Submit a reply
  const handleReplySubmit = async (postId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://discussion-forum-backend-67bc.onrender.com/api/posts/${postId}/replies`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, replies: [...post.replies, response.data] }
            : post
        )
      );
      setReplyContent('');
      setActiveReplyPostId(null);
    } catch {
      setError('Failed to add reply.');
    }
  };

  // Handle like/dislike for replies
  const handleReaction = async (postId, replyId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://discussion-forum-backend-67bc.onrender.com/api/posts/${postId}/replies/${replyId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                replies: post.replies.map((reply) =>
                  reply._id === replyId
                    ? {
                        ...reply,
                        likes:
                          action === 'like'
                            ? reply.likes + 1
                            : reply.likes,
                        dislikes:
                          action === 'dislike'
                            ? reply.dislikes + 1
                            : reply.dislikes,
                      }
                    : reply
                ),
              }
            : post
        )
      );
    } catch {
      setError(`Failed to ${action} reply.`);
    }
  };

  // Edit post
  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
  };

  // Update the post
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://discussion-forum-backend-67bc.onrender.com/api/posts/${editingPostId}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === editingPostId
            ? { ...post, title: response.data.title, content: response.data.content }
            : post
        )
      );
      setEditingPostId(null);
      setTitle('');
      setContent('');
    } catch {
      setError('Failed to update post.');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPostId(null);
    setTitle('');
    setContent('');
  };

  // Edit reply
  const handleEditReplyClick = (reply) => {
    setEditingReplyId(reply._id);
    setReplyContent(reply.content);
  };

  // Update the reply
  const handleUpdateReply = async (postId, replyId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://discussion-forum-backend-67bc.onrender.com/api/posts/${postId}/replies/${replyId}`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                replies: post.replies.map((reply) =>
                  reply._id === replyId ? { ...reply, content: response.data.content } : reply
                ),
              }
            : post
        )
      );
      setEditingReplyId(null);
      setReplyContent('');
    } catch {
      setError('Failed to update reply.');
    }
  };

  // Cancel editing reply
  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setReplyContent('');
  };

  return (
    <div className="scrollable-box">
      <div className="post-list">
        <h1 className="title">Discussion Board</h1>
        {error && <p className="error">{error}</p>}

        {/* Create Post Form */}
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

        {/* Edit Post Form */}
        {editingPostId && (
          <form className="post-form" onSubmit={handleUpdatePost}>
            <h2>Edit Post</h2>
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
            <button type="submit">Update Post</button>
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </form>
        )}

        <div className="posts-container">
          {posts.length === 0 && !error ? (
            <p className="no-posts">No posts available</p>
          ) : (
            posts.map((post) => (
              <div className="post-card" key={post._id}>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content">{post.content}</p>
                <p className="post-author">Posted by: {post.createdBy.username}</p>

                {/* Edit button for posts */}
                {post.createdBy.username === localStorage.getItem('username') && (
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(post)}
                  >
                    Edit Post
                  </button>
                )}

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
                  {post.replies && post.replies.length > 0 ? (
                    post.replies.map((reply) => (
                      <div className="reply-item" key={reply._id}>
                        <p>{reply.content}</p>
                        <div className="reply-actions">
                          <button
                            className="like-btn"
                            onClick={() =>
                              handleReaction(post._id, reply._id, 'like')
                            }
                          >
                            Like
                          </button>
                          <span>Likes: {reply.likes}</span>

                          <button
                            className="dislike-btn"
                            onClick={() =>
                              handleReaction(post._id, reply._id, 'dislike')
                            }
                          >
                            Dislike
                          </button>
                          <span>Dislikes: {reply.dislikes}</span>

                          {/* Edit button for replies */}
                          {reply.createdBy.username === localStorage.getItem('username') && (
                            <button
                              className="edit-btn"
                              onClick={() => handleEditReplyClick(reply)}
                            >
                              Edit Reply
                            </button>
                          )}
                        </div>

                        {/* Edit reply form */}
                        {editingReplyId === reply._id && (
                          <form
                            className="reply-form"
                            onSubmit={(e) =>
                              handleUpdateReply(post._id, reply._id, e)
                            }
                          >
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              required
                            />
                            <button type="submit">Update Reply</button>
                            <button
                              type="button"
                              onClick={handleCancelEditReply}
                            >
                              Cancel
                            </button>
                          </form>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No replies yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostList;
