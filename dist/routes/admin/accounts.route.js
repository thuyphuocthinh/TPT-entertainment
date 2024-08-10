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
exports.accountsRoutes = void 0;
const express_1 = require("express");
const controller = __importStar(require("../../controllers/admin/accounts.controller"));
const requestMiddleware = __importStar(require("../../middlewares/admin/request.middleware"));
const router = (0, express_1.Router)();
router.get("/", requestMiddleware.getReq("accounts"), controller.index);
router.get("/updateStatus/:id/:status", requestMiddleware.patchReq("accounts"), controller.updateStatus);
router.patch("/changeMulti", requestMiddleware.patchReq("accounts"), controller.changeMulti);
router.get("/delete/:id", requestMiddleware.deleteReq("accounts"), controller.deleteItem);
router.get("/create", requestMiddleware.postReq("accounts"), controller.getCreate);
router.post("/create", requestMiddleware.postReq("accounts"), controller.postCreate);
router.get("/edit/:id", requestMiddleware.patchReq("accounts"), controller.getEdit);
router.patch("/edit/:id", requestMiddleware.patchReq("accounts"), controller.patchEdit);
exports.accountsRoutes = router;
