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
exports.patchEdit = exports.getEdit = exports.postCreate = exports.getCreate = exports.deleteItem = exports.changeMulti = exports.updateStatus = exports.index = void 0;
const roles_model_1 = __importDefault(require("../../models/roles.model"));
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const md5_1 = __importDefault(require("md5"));
const search_helper_1 = require("../../helpers/search.helper");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const system_config_1 = require("../../config/system.config");
const generator_helper_1 = require("../../helpers/generator.helper");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false,
        };
        if (req.query.search) {
            find.title = (0, search_helper_1.search)(req).regex;
        }
        let sortBy = "";
        let sortObj = { email: "desc" };
        const sortCriteria = [
            {
                keyValue: "title-desc",
                title: "Sắp xếp email giảm dần",
            },
            {
                keyValue: "title-asc",
                title: "Sắp xếp email tăng dần",
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
        const countRecords = yield accounts_model_1.default.countDocuments({ deleted: false });
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
        const accounts = yield accounts_model_1.default.find(find)
            .sort(sortObj)
            .limit(objPagination.limit)
            .skip(objPagination.skip);
        for (const account of accounts) {
            const role = yield roles_model_1.default.findOne({ _id: account.roleId, deleted: false });
            account["infoRole"] = role;
        }
        res.render("admin/pages/accounts/index", {
            pageTitle: "Quản lí tài khoản admin",
            accounts,
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
        yield accounts_model_1.default.updateOne({
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
                    yield accounts_model_1.default.updateOne({
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
                    const account = yield accounts_model_1.default.findOne({ _id: id, deleted: false });
                    const statusChange = account.status === "active" ? "inactive" : "active";
                    yield accounts_model_1.default.updateOne({ _id: id, deleted: false }, {
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
        yield accounts_model_1.default.updateOne({ _id: id, deleted: false }, { deleted: true });
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
        const roles = yield roles_model_1.default.find({ deleted: false });
        res.render("admin/pages/accounts/create", {
            pageTitle: "Thêm tài khoản",
            roles,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCreate = getCreate;
const postCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkEmail = yield accounts_model_1.default.findOne({ email: req.body.email });
        if (checkEmail) {
            req.flash("error", "Email đã tồn tại");
            res.redirect("back");
            return;
        }
        const dataAccount = {
            email: req.body.email,
            password: (0, md5_1.default)(req.body.password),
            status: req.body.status,
            token: (0, generator_helper_1.generateRandomString)(30),
            roleId: req.body.roleId,
        };
        const record = new accounts_model_1.default(dataAccount);
        yield record.save();
        req.flash("success", "Thêm tài khoản mới thành công");
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/accounts`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postCreate = postCreate;
const getEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const account = yield accounts_model_1.default.findOne({
            _id: id,
            deleted: false,
            status: "active",
        });
        const roles = yield roles_model_1.default.find({ deleted: false });
        res.render("admin/pages/accounts/edit", {
            pageTitle: `Chỉnh sửa tài khoản`,
            account,
            roles,
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
        const dataAccount = {
            email: req.body.email,
            status: req.body.status,
            roleId: req.body.roleId,
        };
        if (req.body.password) {
            dataAccount["password"] = (0, md5_1.default)(req.body.password);
        }
        yield accounts_model_1.default.updateOne({
            _id: id,
        }, dataAccount);
        req.flash("success", "Chỉnh sửa thành công");
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/accounts`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.patchEdit = patchEdit;
