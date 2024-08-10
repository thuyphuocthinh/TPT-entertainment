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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singersRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const controller = __importStar(require("../../controllers/admin/singers.controller"));
const uploadCloud = __importStar(require("../../middlewares/admin/upload.middleware"));
const requestMiddleware = __importStar(require("../../middlewares/admin/request.middleware"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get("/", requestMiddleware.getReq("singers"), controller.index);
router.get("/updateStatus/:id/:status", requestMiddleware.patchReq("singers"), controller.updateStatus);
router.patch("/changeMulti", requestMiddleware.patchReq("singers"), controller.changeMulti);
router.get("/delete/:id", requestMiddleware.deleteReq("singers"), controller.deleteItem);
router.get("/create", requestMiddleware.postReq("singers"), controller.getCreate);
router.post("/create", requestMiddleware.postReq("singers"), upload.single("avatar"), uploadCloud.uploadSingle, controller.postCreate);
router.get("/edit/:id", requestMiddleware.patchReq("singers"), controller.getEdit);
router.patch("/edit/:id", requestMiddleware.patchReq("singers"), upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), uploadCloud.uploadFields, controller.patchEdit);
router.get("/detail/:id", requestMiddleware.getReq("singers"), controller.getDetail);
exports.singersRoutes = router;
