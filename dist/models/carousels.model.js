"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const carouselsSchema = new mongoose_1.default.Schema({
    image: String,
    slug: {
        type: String,
        slug: "image",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Carousels = mongoose_1.default.model("Carousels", carouselsSchema, "carousels");
exports.default = Carousels;
