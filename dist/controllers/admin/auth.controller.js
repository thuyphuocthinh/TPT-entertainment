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
exports.logout = exports.postLogin = exports.getLogin = void 0;
const system_config_1 = require("../../config/system.config");
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const md5_1 = __importDefault(require("md5"));
const getLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.cookies.token) {
            const checkToken = yield accounts_model_1.default.findOne({
                token: req.cookies.token,
                deleted: false,
            });
            if (checkToken) {
                return res.redirect(`${system_config_1.systemConfig.prefixAdmin}/singers`);
            }
        }
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập",
        });
    }
    catch (error) {
        console.error("Error during login:", error);
    }
});
exports.getLogin = getLogin;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const checkEmail = yield accounts_model_1.default.findOne({ email: email });
        if (!checkEmail) {
            req.flash("error", "Email không tồn tại");
            res.redirect("back");
            return;
        }
        if ((0, md5_1.default)(password) !== checkEmail.password) {
            req.flash("error", "Sai mật khẩu");
            res.render("admin/pages/auth/login", {
                pageTitle: "Đăng nhập",
                email,
            });
            return;
        }
        if (checkEmail.status === "inactive") {
            req.flash("error", "Tài khoản hiện đang bị khóa. Vui lòng liên admin để mở khóa.");
            res.redirect("back");
            return;
        }
        req.flash("success", "Đăng nhập thành công");
        res.cookie("token", checkEmail.token);
        res.redirect(`${system_config_1.systemConfig.prefixAdmin}/dashboard`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postLogin = postLogin;
const logout = (req, res) => {
    try {
        if (req.cookies.token) {
            res.clearCookie("token");
            req.flash("success", "Đăng xuất thành công");
            res.redirect(`${system_config_1.systemConfig.prefixAdmin}/auth/login`);
        }
        else {
            res.redirect(`${system_config_1.systemConfig.prefixAdmin}/auth/login`);
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.logout = logout;
