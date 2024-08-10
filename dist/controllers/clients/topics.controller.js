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
exports.detail = exports.index = void 0;
const pagination_helper_1 = require("../../helpers/pagination.helper");
const topics_model_1 = __importDefault(require("../../models/topics.model"));
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false,
            status: "active",
        };
        const countRecords = yield topics_model_1.default.countDocuments(find);
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
        const topics = yield topics_model_1.default.find(find)
            .limit(objPagination.limit)
            .skip(objPagination.skip);
        res.render("clients/pages/topics/index", {
            pageTitle: "Bài hát",
            topics,
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
        const topic = yield topics_model_1.default.findOne({
            slug: slug,
            deleted: false,
            status: "active",
        });
        const songs = yield songs_model_1.default.find({
            topicId: topic.id,
            deleted: false,
            status: "active",
        });
        const singers = [];
        for (const song of songs) {
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
                status: "active",
            });
            singers.push((singer === null || singer === void 0 ? void 0 : singer.fullName) || "Artist");
        }
        res.render("clients/pages/topics/detail", {
            pageTitle: topic.title,
            songs,
            singers,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.detail = detail;
