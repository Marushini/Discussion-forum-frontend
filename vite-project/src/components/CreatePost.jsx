import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/api/posts`,
        { title, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Post created successfully!");
    } catch (err) {
      alert("Failed to create post.");
    }
  };

  return (
    <form onSubmit={handleCreatePost}>
      <h2>Create Post</h2>
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Content" onChange={(e) => setContent(e.target.value)} required />
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;
