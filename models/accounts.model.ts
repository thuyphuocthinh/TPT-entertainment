import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const accountsSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    token: String,
    roleId: String,
    status: String,
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

const Accounts = mongoose.model("Accounts", accountsSchema, "accounts");
export default Accounts;
