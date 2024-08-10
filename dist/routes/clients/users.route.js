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
exports.usersRoutes = void 0;
const express_1 = require("express");
const controller = __importStar(require("../../controllers/clients/users.controller"));
const router = (0, express_1.Router)();
router.get("/profile", controller.profile);
router.patch("/profile", controller.updateProfile);
router.get("/updatePassword", controller.getUpdatePassword);
router.patch("/updatePassword", controller.updatePassword);
router.get("/favouriteSongs", controller.favouriteSongs);
router.get("/playlists", controller.getPlaylists);
router.get("/playlists/create", controller.getCreatePlaylists);
router.post("/playlists/create", controller.postCreatePlaylists);
router.get("/playlists/:slug", controller.detailPlaylist);
router.get("/playlists/:id", controller.deletePlaylist);
router.post("/playlists/add", controller.addSongToPlaylist);
router.get("/playlists/table/:slug", controller.getTablePlaylist);
router.get("/playlists/delete/:playlistId/:songId", controller.deleteSong);
exports.usersRoutes = router;
