import mongoose, { model, Schema } from "mongoose";

export interface IProfileLink {
  name: string;
  href: string;
}

export interface IProfile {
  telegramId: string;
  fullname: string;
  photo_url: string;
  username: string;

  bio?: string;
  phone?: string;
  email?: string;
  files?: string[];
  links?: IProfileLink[];
}

export interface UpdateProfileDto {
  bio?: string;
  phone?: string;
  email?: string;
  links?: IProfileLink[];
}

export const ProfileSchema = new Schema<IProfile>({
  telegramId: { type: String, required: true, unique: true, immutable: true},
  fullname: { type: String, required: true},
  photo_url: { type: String, required: true},
  username: { type: String, required: true},

  bio: String,
  phone: String,
  email: String,
  files: [String],
  links: Array<IProfileLink>
})

export const Profile =
  mongoose.models.Profile || model<IProfile>('Profile', ProfileSchema);
