"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const usersSchema = new mongoose_1.default.Schema({
    email: String,
    fullName: String,
    password: String,
    tokenUser: String,
    favouriteSongs: [],
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
}, { timestamps: true });
const Users = mongoose_1.default.model("Users", usersSchema, "users");
exports.default = Users;
