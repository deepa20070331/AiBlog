import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    excerpt: { type: String, required: true, trim: true, maxlength: 320 },
    content: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);