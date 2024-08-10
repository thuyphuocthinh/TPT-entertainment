"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = require("cloudinary");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        cloudinary_1.v2.config({
            cloud_name: "dy0m9udjz",
            api_key: "655763378773479",
            api_secret: "7CheewENHiovwVJtdW4ZJLBNoW8",
        });
    });
})();
let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary_1.v2.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
};
const uploadToCloudinary = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield streamUpload(buffer);
    return result["url"];
});
exports.uploadToCloudinary = uploadToCloudinary;
