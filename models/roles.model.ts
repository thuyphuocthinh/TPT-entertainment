import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const rolesSchema = new mongoose.Schema(
  {
    title: String,
    permissions: [],
    status: String,
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

const Roles = mongoose.model("Roles", rolesSchema, "roles");
export default Roles;
