"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMp3 = void 0;
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const downloadMp3 = (url, name) => {
    const file = fs_1.default.createWriteStream(name);
    https_1.default
        .get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to get '${url}' (${response.statusCode})`);
            response.resume();
            return;
        }
        response.pipe(file);
        file.on("finish", () => {
            file.close(() => {
                console.log(`MP3 file downloaded as ${name}`);
            });
        });
    })
        .on("error", (err) => {
        fs_1.default.unlink(name, (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Error deleting file: ${unlinkErr.message}`);
            }
            console.error(`Error downloading MP3 file: ${err.message}`);
        });
    });
    file.on("error", (err) => {
        fs_1.default.unlink(name, (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Error deleting file: ${unlinkErr.message}`);
            }
            console.error(`File stream error: ${err.message}`);
        });
    });
};
exports.downloadMp3 = downloadMp3;
