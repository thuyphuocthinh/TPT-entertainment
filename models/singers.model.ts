import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const singersSchema = new mongoose.Schema(
  {
    fullName: String,
    avatar: String,
    status: String,
    slug: {
      type: String,
      slug: "fullName",
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

const Singers = mongoose.model("Singers", singersSchema, "singers");
export default Singers;
