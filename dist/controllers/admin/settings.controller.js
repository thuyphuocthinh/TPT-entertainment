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
exports.patchEdit = exports.index = void 0;
const settings_model_1 = __importDefault(require("../../models/settings.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield settings_model_1.default.findOne({ deleted: false });
        res.render("admin/pages/settings/index", {
            pageTitle: "Cài đặt chung",
            settings,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
const patchEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            email: req.body.email,
        };
        if (req.body.image) {
            data["image"] = req.body.image;
        }
        yield settings_model_1.default.updateOne({ _id: id }, data);
        req.flash("success", "Cập nhật thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.patchEdit = patchEdit;
