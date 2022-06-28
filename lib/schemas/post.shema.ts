import mongoose, { model, Schema } from "mongoose";

export const PostStatusArray = ['draft', 'published', 'archived'];
export type PostStatus = 'draft' | 'published' | 'archived';

export interface IPost {
  _id: string;

  title: string;
  description: string;
  content: string;
  category: string;

  createdAt: Date;
  updatedAt: Date;

  status: PostStatus;
  tags?: string[];
}

export const PostSchema = new Schema<IPost>({
  title: { type: String, required: true},
  description: { type: String, required: true},
  content: { type: String, required: true},
  category: {type: String, required: true},

  status: { type: String, enum: PostStatusArray, default: 'draft'},
  tags: Array<String>
}, { timestamps: true })

export const Post = mongoose.models.Post || model<IPost>('Post', PostSchema);
