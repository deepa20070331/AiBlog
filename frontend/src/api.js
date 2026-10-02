const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "The request could not be completed.");
  }

  return response.status === 204 ? null : response.json();
}

export const getPosts = () => request("/posts");
export const createPost = (post) => request("/posts", { method: "POST", body: JSON.stringify(post) });
export const deletePost = (id) => request(`/posts/${id}`, { method: "DELETE" });
export const generatePost = (details) => request("/posts/generate", { method: "POST", body: JSON.stringify(details) });