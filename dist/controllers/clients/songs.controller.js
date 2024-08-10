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
exports.updateListen = exports.updateFavourite = exports.updateLike = exports.detail = exports.index = void 0;
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const pagination_helper_1 = require("../../helpers/pagination.helper");
const topics_model_1 = __importDefault(require("../../models/topics.model"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const playlists_model_1 = __importDefault(require("../../models/playlists.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false,
        };
        const countRecords = yield songs_model_1.default.countDocuments({ deleted: false });
        let currentPage = 1;
        if (req.query.page) {
            currentPage = Number(req.query.page);
        }
        let objPagination = {
            currentPage: currentPage,
            totalPages: 0,
            skip: 0,
            limit: 4,
        };
        objPagination = (0, pagination_helper_1.pagination)(objPagination, countRecords);
        const songs = yield songs_model_1.default.find(find)
            .limit(objPagination.limit)
            .skip(objPagination.skip);
        for (const song of songs) {
            if (song.title.length > 30)
                song.title = song.title.substring(0, 20) + "...";
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
            }).select("fullName");
            song["infoSinger"] = singer;
        }
        res.render("clients/pages/songs/index", {
            pageTitle: "Bài hát",
            songs,
            pagination: objPagination,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const song = yield songs_model_1.default.findOne({
            slug: slug,
            deleted: false,
            status: "active",
        });
        const singer = yield singers_model_1.default.findOne({
            _id: song.singerId,
            deleted: false,
        }).select("fullName");
        const topic = yield topics_model_1.default.findOne({
            _id: song.topicId,
            deleted: false,
            status: "active",
        });
        const relatedSongs = yield songs_model_1.default.find({
            _id: { $ne: song.id },
            deleted: false,
            topicId: song.topicId,
            status: "active",
        }).limit(10);
        for (const song of relatedSongs) {
            if (song.title.length > 30)
                song.title = song.title.substring(0, 20) + "...";
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
            }).select("fullName");
            song["infoSinger"] = singer;
        }
        const pageTitle = song.title + " - " + singer.fullName;
        const playlists = yield playlists_model_1.default.find({
            deleted: false,
            songs: { $nin: [song.id] },
        });
        res.render("clients/pages/songs/detail", {
            pageTitle: pageTitle,
            song,
            singer,
            topic,
            relatedSongs,
            playlists,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.detail = detail;
const updateLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeLike, id } = req.params;
        const user = yield users_model_1.default.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        let TYPE_LIKE;
        (function (TYPE_LIKE) {
            TYPE_LIKE["YES"] = "yes";
            TYPE_LIKE["NO"] = "no";
        })(TYPE_LIKE || (TYPE_LIKE = {}));
        switch (typeLike) {
            case TYPE_LIKE.YES: {
                yield songs_model_1.default.updateOne({
                    _id: id,
                }, {
                    $push: { like: user.id },
                });
                const song = yield songs_model_1.default.findOne({ _id: id, deleted: false });
                res.json({
                    status: 200,
                    data: song.like.length,
                });
                break;
            }
            case TYPE_LIKE.NO: {
                yield songs_model_1.default.updateOne({
                    _id: id,
                }, {
                    $pull: { like: user.id },
                });
                const song = yield songs_model_1.default.findOne({ _id: id, deleted: false });
                res.json({
                    status: 200,
                    data: song.like.length,
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
exports.updateLike = updateLike;
const updateFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeFavourite, id } = req.params;
        const user = yield users_model_1.default.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        let TYPE_FAVOURITE;
        (function (TYPE_FAVOURITE) {
            TYPE_FAVOURITE["YES"] = "yes";
            TYPE_FAVOURITE["NO"] = "no";
        })(TYPE_FAVOURITE || (TYPE_FAVOURITE = {}));
        switch (typeFavourite) {
            case TYPE_FAVOURITE.YES: {
                yield users_model_1.default.updateOne({
                    _id: user.id,
                }, {
                    $push: { favouriteSongs: id },
                });
                res.json({
                    status: 200,
                    data: "Đã thêm vào danh sách yêu thích",
                });
                break;
            }
            case TYPE_FAVOURITE.NO: {
                yield users_model_1.default.updateOne({
                    _id: user.id,
                }, {
                    $pull: { favouriteSongs: id },
                });
                res.json({
                    status: 200,
                    data: "Đã xóa khỏi danh sách yêu thích",
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
exports.updateFavourite = updateFavourite;
const updateListen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const song = yield songs_model_1.default.findOne({
            _id: id,
            deleted: false,
            status: "active",
        });
        yield songs_model_1.default.updateOne({
            _id: id,
        }, {
            listen: song.listen + 1,
        });
        res.json({
            status: 200,
            data: song.listen,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateListen = updateListen;
