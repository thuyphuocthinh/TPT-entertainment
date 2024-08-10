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
const roles_model_1 = __importDefault(require("../../models/roles.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield roles_model_1.default.find({ deleted: false });
        res.render("admin/pages/permissions/index", {
            pageTitle: "Bảng phân quyền",
            roles,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.index = index;
const patchEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = JSON.parse(req.body.permissionsUpdate);
        for (const permission of permissions) {
            yield roles_model_1.default.updateOne({
                _id: permission.role_id,
            }, {
                permissions: permission.permissions,
            });
        }
        req.flash("success", "Cập nhật thành công");
        res.redirect("back");
    }
    catch (error) {
        console.log(error);
    }
});
exports.patchEdit = patchEdit;
