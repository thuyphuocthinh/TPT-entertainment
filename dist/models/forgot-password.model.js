"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const forgotPasswordSchema = new mongoose_1.default.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true });
const ForgotPassword = mongoose_1.default.model("ForgotPassword", forgotPasswordSchema, "forgot-password");
exports.default = ForgotPassword;
