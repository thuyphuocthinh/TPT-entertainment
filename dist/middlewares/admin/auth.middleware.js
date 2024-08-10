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
exports.requireAuth = void 0;
const system_config_1 = require("../../config/system.config");
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const roles_model_1 = __importDefault(require("../../models/roles.model"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.cookies.token) {
            const token = req.cookies.token;
            const user = yield accounts_model_1.default.findOne({
                token: token,
                deleted: false,
            }).select("-password");
            if (user) {
                const role = yield roles_model_1.default.findOne({ _id: user.roleId, deleted: false });
                res.locals.role = role;
                res.locals.originalUrl = req.originalUrl;
                res.locals.user = user;
                next();
            }
            else {
                res.redirect(`${system_config_1.systemConfig.prefixAdmin}/auth/login`);
            }
        }
        else {
            res.redirect(`${system_config_1.systemConfig.prefixAdmin}/auth/login`);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.requireAuth = requireAuth;
