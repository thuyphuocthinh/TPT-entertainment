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
exports.index = void 0;
const carousels_model_1 = __importDefault(require("../../models/carousels.model"));
const topics_model_1 = __importDefault(require("../../models/topics.model"));
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carousels = yield carousels_model_1.default.find({ deleted: false });
        const topics = yield topics_model_1.default.find({ deleted: false, status: "active" });
        const songs = yield songs_model_1.default.find({ deleted: false, status: "active" });
        for (const song of songs) {
            if (song.title.length > 30)
                song.title = song.title.substring(0, 20) + "...";
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
            }).select("fullName");
            song["infoSinger"] = singer;
        }
        const singers = yield singers_model_1.default.find({ deleted: false, status: "active" });
        res.render("clients/pages/homepage/index", {
            pageTitle: "Trang chủ",
            carousels,
            topics,
            songs,
            singers,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
