"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const favouriteSongsSchema = new mongoose_1.default.Schema({
    userId: String,
    songId: String,
}, { timestamps: true });
const FavouriteSongs = mongoose_1.default.model("FavouriteSongs", favouriteSongsSchema, "favourite-songs");
exports.default = FavouriteSongs;
