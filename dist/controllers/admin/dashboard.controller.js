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
const topics_model_1 = __importDefault(require("../../models/topics.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statistic = {
            songs: {
                total: 0,
                active: 0,
                inactive: 0,
            },
            topics: {
                total: 0,
                active: 0,
                inactive: 0,
            },
            singers: {
                total: 0,
                active: 0,
                inactive: 0,
            },
            accounts: {
                total: 0,
                active: 0,
                inactive: 0,
            },
            users: {
                total: 0,
                active: 0,
                inactive: 0,
            },
        };
        statistic.songs.total = yield songs_model_1.default.countDocuments({ deleted: false });
        statistic.songs.active = yield songs_model_1.default.countDocuments({
            deleted: false,
            status: "active",
        });
        statistic.songs.inactive = yield songs_model_1.default.countDocuments({
            deleted: false,
            status: "inactive",
        });
        statistic.topics.total = yield topics_model_1.default.countDocuments({ deleted: false });
        statistic.topics.active = yield topics_model_1.default.countDocuments({
            deleted: false,
            status: "active",
        });
        statistic.topics.inactive = yield topics_model_1.default.countDocuments({
            deleted: false,
            status: "inactive",
        });
        statistic.singers.total = yield singers_model_1.default.countDocuments({ deleted: false });
        statistic.singers.active = yield singers_model_1.default.countDocuments({
            deleted: false,
            status: "active",
        });
        statistic.singers.inactive = yield singers_model_1.default.countDocuments({
            deleted: false,
            status: "inactive",
        });
        statistic.accounts.total = yield accounts_model_1.default.countDocuments({
            deleted: false,
        });
        statistic.accounts.active = yield accounts_model_1.default.countDocuments({
            deleted: false,
            status: "active",
        });
        statistic.accounts.inactive = yield accounts_model_1.default.countDocuments({
            deleted: false,
            status: "inactive",
        });
        statistic.users.total = yield users_model_1.default.countDocuments({ deleted: false });
        statistic.users.active = yield users_model_1.default.countDocuments({
            deleted: false,
            status: "active",
        });
        statistic.users.inactive = yield users_model_1.default.countDocuments({
            deleted: false,
            status: "inactive",
        });
        res.render("admin/pages/dashboard/index", {
            pageTitle: "Dashboard",
            statistic,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
