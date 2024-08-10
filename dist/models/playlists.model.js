"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const playlistsSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const Playlists = mongoose_1.default.model("Playlists", playlistsSchema, "playlists");
exports.default = Playlists;
