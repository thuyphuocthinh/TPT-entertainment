import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const favouriteSongsSchema = new mongoose.Schema(
  {
    userId: String,
    songId: String,
  },
  { timestamps: true }
);

const FavouriteSongs = mongoose.model(
  "FavouriteSongs",
  favouriteSongsSchema,
  "favourite-songs"
);
export default FavouriteSongs;
