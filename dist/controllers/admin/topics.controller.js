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
const topics_model_1 = __importDefault(require("../../models/topics.model"));
const search_helper_1 = require("../../helpers/search.helper");
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
                title: "Sắp xếp tên chủ đề giảm dần",
            },
            {
                keyValue: "title-asc",
                title: "Sắp xếp tên chủ đề tăng dần",
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
        const countRecords = yield topics_model_1.default.countDocuments({ deleted: false });
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
            .sort(sortObj)
            .limit(objPagination.limit)
            .skip(objPagination.skip);
        res.render("admin/pages/topics/index", {
            pageTitle: "Quản lí chủ đề",
            topics,
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
        yield topics_model_1.default.updateOne({
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
                    yield topics_model_1.default.updateOne({
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
                    const topic = yield topics_model_1.default.findOne({ _id: id, deleted: false });
                    const statusChange = topic.status === "active" ? "inactive" : "active";
                    yield topics_model_1.default.updateOne({ _id: id, deleted: false }, {
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
        yield topics_model_1.default.updateOne({ _id: id, deleted: false }, { deleted: true });
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
        res.render("admin/pages/topics/create", {
            pageTitle: "Thêm chủ đề",
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
        if (req.body.avatar) {
            avatar = req.body.avatar;
        }
        const dataTopic = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            avatar: avatar,
        };
        const record = new topics_model_1.default(dataTopic);
        yield record.save();
        req.flash("success", "Thêm chủ đề mới thành công");
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/topics`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postCreate = postCreate;
const getEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const topic = yield topics_model_1.default.findOne({
            _id: id,
            deleted: false,
            status: "active",
        });
        res.render("admin/pages/topics/edit", {
            pageTitle: `Chỉnh sửa chủ đề ${topic.title}`,
            topic,
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
        const dataTopic = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        };
        if (req.body.avatar) {
            dataTopic["avatar"] = req.body.avatar;
        }
        yield topics_model_1.default.updateOne({
            _id: id,
        }, dataTopic);
        req.flash("success", "Chỉnh sửa thành công");
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/topics`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.patchEdit = patchEdit;
const getDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const topic = yield topics_model_1.default.findOne({ _id: id, deleted: false });
        res.render("admin/pages/topics/detail", {
            pageTitle: `Chi tiết chủ đề ${topic.title}`,
            topic,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getDetail = getDetail;
