import { useState } from "react";
import { ArrowUpRight, LoaderCircle, Sparkles } from "lucide-react";
import { createPost, generatePost } from "../api.js";

const categories = ["Ideas", "Culture", "Technology", "Living", "Notes"];

export default function CreatePost({ onCreated }) {
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "Ideas" });
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const draft = await generatePost({ topic, category: form.category });
      setForm((current) => ({ ...current, ...draft }));
    } catch (draftError) {
      setError(draftError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const post = await createPost(form);
      setForm({ title: "", excerpt: "", content: "", category: "Ideas" });
      setTopic("");
      onCreated(post);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="compose-panel" aria-labelledby="compose-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">THE WRITING DESK</p>
          <h2 id="compose-heading">Start with a spark.</h2>
        </div>
        <span className="heading-mark" aria-hidden="true"><Sparkles size={19} /></span>
      </div>

      <form className="draft-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="topic">A thought, a question, a direction</label>
        <div className="generate-row">
          <input id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="What have you been thinking about?" />
          <button className="generate-button" type="button" onClick={handleGenerate} disabled={busy || !topic.trim()}>
            {busy ? <LoaderCircle className="spin" size={16} /> : <Sparkles size={16} />}
            <span>Draft with AI</span>
          </button>
        </div>

        <div className="form-divider"><span>OR WRITE YOUR OWN</span></div>

        <label className="field-label" htmlFor="title">Title</label>
        <input id="title" className="title-input" value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Give this story a name" required maxLength={160} />

        <div className="field-pair">
          <div className="category-field">
            <label className="field-label" htmlFor="category">Filed under</label>
            <select id="category" value={form.category} onChange={(event) => update("category", event.target.value)}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>
          <label className="excerpt-field">
            <span className="field-label">One-line preview</span>
            <input value={form.excerpt} onChange={(event) => update("excerpt", event.target.value)} placeholder="A little about the story" maxLength={320} />
          </label>
        </div>

        <label className="field-label" htmlFor="content">Your story</label>
        <textarea id="content" value={form.content} onChange={(event) => update("content", event.target.value)} placeholder="Let the first sentence take you somewhere..." rows={6} required />

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="submit-row">
          <span className="quiet-note">A good story begins anywhere.</span>
          <button className="publish-button" type="submit" disabled={busy || !form.title.trim() || !form.content.trim()}>
            <span>Publish story</span><ArrowUpRight size={16} />
          </button>
        </div>
      </form>
    </section>
  );
}