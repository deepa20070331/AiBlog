import { Router } from "express";
import Post from "../models/Post.js";

const router = Router();

router.get("/", async (_request, response, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    response.json(posts);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const { title, excerpt, content, category } = request.body;
    if (!title?.trim() || !content?.trim()) {
      return response.status(400).json({ message: "A title and article are required." });
    }

    const post = await Post.create({
      title,
      excerpt: excerpt?.trim() || content.trim().slice(0, 180),
      content,
      category: category?.trim() || "Notes",
    });
    response.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const post = await Post.findByIdAndDelete(request.params.id);
    if (!post) return response.status(404).json({ message: "Post not found." });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post("/generate", async (request, response) => {
  const { topic, tone = "thoughtful", category = "Notes" } = request.body;
  if (!topic?.trim()) {
    return response.status(400).json({ message: "Add a topic to generate a draft." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ message: "Add OPENAI_API_KEY to backend/.env to enable AI drafting." });
  }

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Write original, useful blog drafts. Return JSON with string fields title, excerpt, and content. The content should use plain paragraphs separated by blank lines.",
          },
          {
            role: "user",
            content: `Write a ${tone} blog post for the ${category} category about: ${topic.trim()}`,
          },
        ],
      }),
    });

    const result = await aiResponse.json();
    if (!aiResponse.ok) {
      return response.status(aiResponse.status).json({ message: result.error?.message || "The AI service could not create a draft." });
    }

    const draft = JSON.parse(result.choices?.[0]?.message?.content || "{}");
    if (!draft.title || !draft.content) throw new Error("The AI returned an incomplete draft.");
    response.json({ ...draft, category });
  } catch (error) {
    response.status(502).json({ message: error.message || "Unable to generate a draft right now." });
  }
});

export default router;