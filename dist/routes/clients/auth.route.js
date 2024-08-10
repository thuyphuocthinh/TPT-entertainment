"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const controller = __importStar(require("../../controllers/clients/users.controller"));
const router = (0, express_1.Router)();
router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/register", controller.getRegister);
router.post("/register", controller.postRegister);
router.get("/logout", controller.logout);
router.get("/forgotPassword", controller.getForgotPassword);
router.post("/forgotPassword", controller.postForgotPassword);
router.post("/otp", controller.postOtp);
router.post("/resetPassword", controller.postResetPassword);
exports.authRoutes = router;
