import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const carouselsSchema = new mongoose.Schema(
  {
    image: String,
    slug: {
      type: String,
      slug: "image",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Carousels = mongoose.model("Carousels", carouselsSchema, "carousels");
export default Carousels;
