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
exports.deleteItem = exports.postCreate = exports.getCreate = exports.index = void 0;
const system_config_1 = require("../../config/system.config");
const carousels_model_1 = __importDefault(require("../../models/carousels.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carousels = yield carousels_model_1.default.find({ deleted: false });
        res.render("admin/pages/interfaces/carousels/index", {
            pageTitle: "Quản lí carousels",
            carousels,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
const getCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("admin/pages/interfaces/carousels/create", {
            pageTitle: "Thêm mới carousel",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCreate = getCreate;
const postCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = req.body.image;
        const record = new carousels_model_1.default({ image });
        yield record.save();
        req.flash("success", "Thêm mới carousel thành công");
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/interfaces/carousels`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postCreate = postCreate;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield carousels_model_1.default.updateOne({ _id: id, deleted: false }, { deleted: true });
        req.flash("success", "Xóa thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteItem = deleteItem;
