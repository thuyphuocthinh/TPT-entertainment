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
exports.songsRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const controller = __importStar(require("../../controllers/admin/songs.controller"));
const uploadCloud = __importStar(require("../../middlewares/admin/upload.middleware"));
const requestMiddleware = __importStar(require("../../middlewares/admin/request.middleware"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get("/", requestMiddleware.getReq("songs"), controller.index);
router.get("/updateStatus/:id/:status", requestMiddleware.patchReq("songs"), controller.updateStatus);
router.patch("/changeMulti", requestMiddleware.patchReq("songs"), controller.changeMulti);
router.get("/delete/:id", requestMiddleware.deleteReq("songs"), controller.deleteItem);
router.get("/create", requestMiddleware.postReq("songs"), controller.getCreate);
router.post("/create", requestMiddleware.postReq("songs"), upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), uploadCloud.uploadFields, controller.postCreate);
router.get("/edit/:id", requestMiddleware.patchReq("songs"), controller.getEdit);
router.patch("/edit/:id", requestMiddleware.patchReq("songs"), upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), uploadCloud.uploadFields, controller.patchEdit);
router.get("/detail/:id", requestMiddleware.getReq("songs"), controller.getDetail);
exports.songsRoutes = router;
