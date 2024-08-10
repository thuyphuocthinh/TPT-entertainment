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
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield songs_model_1.default.find({
            deleted: false,
            status: "active",
        }).sort({ listen: "desc" });
        for (const song of songs) {
            if (song.title.length > 30)
                song.title = song.title.substring(0, 20) + "...";
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
            }).select("fullName");
            song["infoSinger"] = singer;
        }
        res.render("clients/pages/ranking/index", {
            pageTitle: "Bảng xếp hạng",
            songs,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
