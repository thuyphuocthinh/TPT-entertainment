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
exports.updateStatus = exports.index = void 0;
const search_helper_1 = require("../../helpers/search.helper");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const users_model_1 = __importDefault(require("../../models/users.model"));
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
            {
                keyValue: "fullName-desc",
                title: "Sắp xếp tên giàm dần dần",
            },
            {
                keyValue: "fullName-asc",
                title: "Sắp xếp tên tăng dần dần",
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
        const countRecords = yield users_model_1.default.countDocuments({ deleted: false });
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
        const users = yield users_model_1.default.find(find)
            .sort(sortObj)
            .limit(objPagination.limit)
            .skip(objPagination.skip);
        res.render("admin/pages/users/index", {
            pageTitle: "Quản lí tài khoản user",
            users,
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
        yield users_model_1.default.updateOne({
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
