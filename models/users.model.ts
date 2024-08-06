import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const usersSchema = new mongoose.Schema(
  {
    email: String,
    fullName: String,
    password: String,
    tokenUser: String,
    status: {
      type: String,
      default: "active",
    },
    slug: {
      slug: "email",
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

const Users = mongoose.model("Users", usersSchema, "users");
export default Users;
