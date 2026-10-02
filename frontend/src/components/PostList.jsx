import { BookOpen, Clock3, Trash2 } from "lucide-react";

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function PostList({ posts, loading, onDelete }) {
  return (
    <section className="stories-panel" aria-labelledby="stories-heading">
      <div className="stories-heading">
        <div>
          <p className="eyebrow">FROM YOUR NOTEBOOK</p>
          <h2 id="stories-heading">Recent stories <span className="post-count">{posts.length.toString().padStart(2, "0")}</span></h2>
        </div>
        <BookOpen size={21} strokeWidth={1.7} aria-hidden="true" />
      </div>

      {loading ? (
        <p className="list-message">Gathering your stories...</p>
      ) : posts.length === 0 ? (
        <div className="empty-state"><span className="empty-icon"><BookOpen size={20} /></span><p>Your first story is waiting to be written.</p></div>
      ) : (
        <div className="story-list">
          {posts.map((post, index) => (
            <article className="story-item" key={post._id}>
              <div className="story-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="story-copy">
                <div className="story-meta"><span className="category-tag">{post.category}</span><span className="date-meta"><Clock3 size={12} />{formatDate(post.createdAt)}</span></div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <button className="icon-button delete-button" type="button" title={`Delete ${post.title}`} aria-label={`Delete ${post.title}`} onClick={() => onDelete(post._id)}><Trash2 size={16} /></button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}