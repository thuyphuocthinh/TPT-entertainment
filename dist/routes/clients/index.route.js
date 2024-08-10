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
const homepage_route_1 = require("./homepage.route");
const search_route_1 = require("./search.route");
const auth_route_1 = require("./auth.route");
const users_route_1 = require("./users.route");
const singers_route_1 = require("./singers.route");
const songs_route_1 = require("./songs.route");
const topics_route_1 = require("./topics.route");
const ranking_route_1 = require("./ranking.route");
const userMiddlewares = __importStar(require("../../middlewares/clients/userMiddleware.middleware"));
const authMiddlewares = __importStar(require("../../middlewares/clients/authMiddleware.middleware"));
const clientsRoutes = (app) => {
    app.use("/", userMiddlewares.userMiddleware, homepage_route_1.homepageRoutes);
    app.use("/search", userMiddlewares.userMiddleware, search_route_1.searchRoutes);
    app.use("/songs", userMiddlewares.userMiddleware, songs_route_1.songsRoutes);
    app.use("/singers", userMiddlewares.userMiddleware, singers_route_1.singersRoutes);
    app.use("/topics", userMiddlewares.userMiddleware, topics_route_1.topicsRoutes);
    app.use("/ranking", userMiddlewares.userMiddleware, ranking_route_1.rankingRoutes);
    app.use("/users", authMiddlewares.requireAuthNoAuthorization, userMiddlewares.userMiddleware, users_route_1.usersRoutes);
    app.use("/auth", userMiddlewares.userMiddleware, auth_route_1.authRoutes);
};
exports.default = clientsRoutes;
