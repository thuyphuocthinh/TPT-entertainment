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
exports.getDetail = exports.patchEdit = exports.getEdit = exports.postCreate = exports.getCreate = exports.deleteItem = exports.changeMulti = exports.updateStatus = exports.index = void 0;
const search_helper_1 = require("../../helpers/search.helper");
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const singers_model_1 = __importDefault(require("../../models/singers.model"));
const topics_model_1 = __importDefault(require("../../models/topics.model"));
const pagination_helper_1 = require("../../helpers/pagination.helper");
const system_config_1 = require("../../config/system.config");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false,
        };
        if (req.query.search) {
            find.title = (0, search_helper_1.search)(req).regex;
        }
        let sortBy = "";
        let sortObj = { title: "desc" };
        const sortCriteria = [
            {
                keyValue: "title-desc",
                title: "Sắp xếp tên bài hát giảm dần",
            },
            {
                keyValue: "title-asc",
                title: "Sắp xếp tên bài hát tăng dần",
            },
        ];
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toString();
            const sortValue = req.query.sortValue.toString();
            sortBy = sortKey + "-" + sortValue;
            sortObj[sortKey] = sortValue;
        }
        let filter = "";
        const filterCriteria = [
            {
                title: "All",
                value: "",
            },
            {
                title: "Active",
                value: "active",
            },
            {
                title: "Inactive",
                value: "inactive",
            },
        ];
        if (req.query.status) {
            find.status = req.query.status.toString();
            filter = req.query.status.toString();
        }
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
            .sort(sortObj)
            .limit(objPagination.limit)
            .skip(objPagination.skip);
        for (const song of songs) {
            const singer = yield singers_model_1.default.findOne({
                _id: song.singerId,
                deleted: false,
            }).select("fullName");
            const topic = yield topics_model_1.default.findOne({
                _id: song.topicId,
                deleted: false,
            });
            song["infoSinger"] = singer;
            song["infoTopic"] = topic;
        }
        res.render("admin/pages/songs/index", {
            pageTitle: "Quản lí bài hát",
            songs,
            keyword: req.query.search || "",
            sortCriteria,
            sortBy: sortBy,
            filterCriteria,
            filter,
            pagination: objPagination,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statusChange = req.params.status;
        const id = req.params.id;
        yield songs_model_1.default.updateOne({
            _id: id,
        }, {
            status: statusChange,
        });
        req.flash("success", "Cập nhật trạng thái thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateStatus = updateStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateObj = JSON.parse(req.body.updateInfo);
        const typeChange = updateObj.changeMulti;
        const ids = updateObj.ids.split("-");
        let CHANGE_MULTI;
        (function (CHANGE_MULTI) {
            CHANGE_MULTI["DELETE_ALL"] = "deleteAll";
            CHANGE_MULTI["CHANGE_STATUS"] = "changeStatus";
        })(CHANGE_MULTI || (CHANGE_MULTI = {}));
        switch (typeChange) {
            case CHANGE_MULTI.DELETE_ALL: {
                ids.forEach((id) => __awaiter(void 0, void 0, void 0, function* () {
                    yield songs_model_1.default.updateOne({
                        _id: id,
                        deleted: false,
                    }, {
                        deleted: true,
                    });
                }));
                req.flash("success", "Cập nhật thành công");
                break;
            }
            case CHANGE_MULTI.CHANGE_STATUS: {
                ids.forEach((id) => __awaiter(void 0, void 0, void 0, function* () {
                    const song = yield songs_model_1.default.findOne({ _id: id, deleted: false });
                    const statusChange = song.status === "active" ? "inactive" : "active";
                    yield songs_model_1.default.updateOne({ _id: id, deleted: false }, {
                        status: statusChange,
                    });
                }));
                req.flash("success", "Cập nhật thành công");
                break;
            }
            default:
                req.flash("error", "Lỗi cập nhật");
                break;
        }
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.changeMulti = changeMulti;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield songs_model_1.default.updateOne({ _id: id, deleted: false }, { deleted: true });
        req.flash("success", "Xóa thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteItem = deleteItem;
const getCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const singers = yield singers_model_1.default.find({ deleted: false, status: "active" });
        const topics = yield topics_model_1.default.find({ deleted: false, status: "active" });
        res.render("admin/pages/songs/create", {
            pageTitle: "Thêm bài hát",
            singers,
            topics,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCreate = getCreate;
const postCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let avatar = "";
        let audio = "";
        if (req.body.avatar[0]) {
            avatar = req.body.avatar[0];
        }
        if (req.body.audio[0]) {
            audio = req.body.audio[0];
        }
        const dataSong = {
            title: req.body.title,
            topicId: req.body.topicId,
            singerId: req.body.singerId,
            description: req.body.description,
            status: req.body.status,
            avatar: avatar,
            audio: audio,
            lyrics: req.body.lyrics,
        };
        const record = new songs_model_1.default(dataSong);
        yield record.save();
        req.flash("success", "Thêm bài hát mới thành công");
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/songs`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postCreate = postCreate;
const getEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const song = yield songs_model_1.default.findOne({ _id: id, deleted: false });
        const singers = yield singers_model_1.default.find({ deleted: false, status: "active" });
        const topics = yield topics_model_1.default.find({ deleted: false, status: "active" });
        res.render("admin/pages/songs/edit", {
            pageTitle: `Chỉnh sửa bài hát ${song.title}`,
            song,
            singers,
            topics,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getEdit = getEdit;
const patchEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const dataSong = {
            title: req.body.title,
            topicId: req.body.topicId,
            singerId: req.body.singerId,
            description: req.body.description,
            status: req.body.status,
            lyrics: req.body.lyrics,
        };
        if (req.body.avatar) {
            dataSong["avatar"] = req.body.avatar[0];
        }
        if (req.body.audio) {
            dataSong["audio"] = req.body.audio[0];
        }
        yield songs_model_1.default.updateOne({
            _id: id,
        }, dataSong);
        req.flash("success", "Chỉnh sửa thành công");
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/songs`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.patchEdit = patchEdit;
const getDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const song = yield songs_model_1.default.findOne({ _id: id, deleted: false });
        const singer = yield singers_model_1.default.findOne({
            _id: song.singerId,
            deleted: false,
        }).select("fullName");
        const topic = yield topics_model_1.default.findOne({ _id: song.topicId, deleted: false });
        song["infoSinger"] = singer;
        song["infoTopic"] = topic;
        res.render("admin/pages/songs/detail", {
            pageTitle: `Chi tiết bài hát ${song.title}`,
            song,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getDetail = getDetail;
