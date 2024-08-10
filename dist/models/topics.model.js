"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const topicsSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    avatar: String,
    status: {
        type: String,
        default: "active",
    },
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
}, { timestamps: true });
const Topics = mongoose_1.default.model("Topics", topicsSchema, "topics");
exports.default = Topics;
