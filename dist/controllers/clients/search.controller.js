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
exports.search = void 0;
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const convertToSlug_helper_1 = require("../../helpers/convertToSlug.helper");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const keyword = req.query.keyword.toString();
        let newSongs = [];
        if (keyword) {
            const keywordRegex = new RegExp(keyword, "i");
            const stringSlug = (0, convertToSlug_helper_1.convertToSlug)(keyword);
            const stringSlugRegex = new RegExp(stringSlug, "i");
            const songs = yield songs_model_1.default.find({
                $or: [
                    {
                        title: keywordRegex,
                    },
                    {
                        slug: stringSlugRegex,
                    },
                ],
                deleted: false,
                status: "active",
            });
            for (const item of songs) {
                const infoSinger = yield singers_model_1.default.findOne({
                    _id: item.singerId,
                });
                newSongs.push({
                    id: item.id,
                    title: item.title,
                    avatar: item.avatar,
                    like: item.like,
                    slug: item.slug,
                    infoSinger: {
                        fullName: infoSinger.fullName,
                    },
                });
            }
        }
        switch (type) {
            case "result": {
                res.render("clients/pages/search/result", {
                    pageTitle: `Kết quả: ${keyword}`,
                    keyword,
                    songs: newSongs,
                });
                break;
            }
            case "suggest": {
                res.json({
                    status: 200,
                    message: "Thành công",
                    songs: newSongs,
                });
                break;
            }
            default:
                break;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.search = search;
