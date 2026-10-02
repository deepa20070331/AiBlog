import { useEffect, useState } from "react";
import { Feather, Leaf, Rss, Sprout } from "lucide-react";
import { deletePost, getPosts } from "./api.js";
import CreatePost from "./components/CreatePost.jsx";
import PostList from "./components/PostList.jsx";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((error) => setPageError(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    try {
      await deletePost(id);
      setPosts((current) => current.filter((post) => post._id !== id));
      setPageError("");
    } catch (error) {
      setPageError(error.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className="rail" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Blognest home"><Feather size={21} /></a>
        <span className="rail-rule" />
        <a className="rail-link active" href="#stories" aria-label="Stories"><Rss size={19} /></a>
        <a className="rail-link" href="#compose" aria-label="Write a story"><Sprout size={19} /></a>
        <div className="rail-bottom"><Leaf size={18} /></div>
      </aside>

      <main id="top" className="main-content">
        <header className="topbar">
          <div className="wordmark">blog<span>nest</span><i>.</i></div>
          <div className="topbar-right"><span className="online-dot" /> YOUR PERSONAL PUBLICATION <span className="avatar">B</span></div>
        </header>

        <section className="welcome-band">
          <div className="welcome-copy">
            <p className="eyebrow">A PLACE FOR YOUR IDEAS TO TAKE ROOT</p>
            <h1>Good things grow<br /><em>from a first draft.</em></h1>
            <p className="welcome-summary">Collect the thoughts worth keeping. Shape them into stories worth sharing.</p>
          </div>
          <div className="welcome-art" aria-hidden="true"><span className="art-sun" /><span className="art-stem" /><span className="art-leaf leaf-one" /><span className="art-leaf leaf-two" /><span className="art-leaf leaf-three" /><span className="art-ground" /></div>
          <div className="welcome-index">VOL. 01 <span> / </span> YOUR JOURNAL</div>
        </section>

        <div className="workspace-grid">
          <div id="compose" className="compose-column"><CreatePost onCreated={(post) => setPosts((current) => [post, ...current])} /></div>
          <div id="stories" className="stories-column">
            {pageError && <p className="page-error" role="alert">{pageError}</p>}
            <PostList posts={posts} loading={loading} onDelete={handleDelete} />
            <div className="sidebar-note"><span className="note-quote">“</span><p>Every great piece of writing starts with the courage to begin.</p><span className="note-credit">A NOTE TO YOURSELF</span></div>
          </div>
        </div>

        <footer className="footer"><span>MADE FOR THE THINGS YOU WANT TO SAY</span><span>© BLOGNEST 2026</span></footer>
      </main>
    </div>
  );
}