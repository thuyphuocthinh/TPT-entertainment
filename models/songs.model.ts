import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const songsSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    status: String,
    singerId: String,
    topicId: String,
    like: [],
    lyrics: String,
    audio: String,
    listen: {
      type: Number,
      default: 0,
    },
    description: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Songs = mongoose.model("Songs", songsSchema, "songs");
export default Songs;
