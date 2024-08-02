import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    phone: String,
    address: String,
    logo: String,
    name: String,
    email: String,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema, "settings");
export default Settings;
