"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingsSchema = new mongoose_1.default.Schema({
    phone: String,
    address: String,
    logo: String,
    name: String,
    email: String,
    deleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Settings = mongoose_1.default.model("Settings", settingsSchema, "settings");
exports.default = Settings;
