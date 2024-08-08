import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const playlistsSchema = new mongoose.Schema(
  {
    title: String,
    userId: String,
    songs: [],
    slug: {
      slug: "title",
      unique: true,
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Playlists = mongoose.model("Playlists", playlistsSchema, "playlists");
export default Playlists;
