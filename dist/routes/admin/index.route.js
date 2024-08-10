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
const dashboard_route_1 = require("./dashboard.route");
const songs_route_1 = require("./songs.route");
const system_config_1 = require("../../config/system.config");
const topics_route_1 = require("./topics.route");
const singers_route_1 = require("./singers.route");
const roles_route_1 = require("./roles.route");
const accounts_route_1 = require("./accounts.route");
const auth_route_1 = require("./auth.route");
const permissions_route_1 = require("./permissions.route");
const authMiddleware = __importStar(require("../../middlewares/admin/auth.middleware"));
const users_route_1 = require("./users.route");
const interfaces_route_1 = require("./interfaces.route");
const settings_route_1 = require("./settings.route");
const adminRoutes = (app) => {
    app.use(`${system_config_1.systemConfig.prefixAdmin}/dashboard`, authMiddleware.requireAuth, dashboard_route_1.dashboardRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/songs`, authMiddleware.requireAuth, songs_route_1.songsRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/topics`, authMiddleware.requireAuth, topics_route_1.topicsRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/singers`, authMiddleware.requireAuth, singers_route_1.singersRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/roles`, authMiddleware.requireAuth, roles_route_1.rolesRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/accounts`, authMiddleware.requireAuth, accounts_route_1.accountsRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/auth`, auth_route_1.authRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/permissions`, authMiddleware.requireAuth, permissions_route_1.permissionsRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/users`, authMiddleware.requireAuth, users_route_1.userRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/interfaces`, authMiddleware.requireAuth, interfaces_route_1.interfacesRoutes);
    app.use(`${system_config_1.systemConfig.prefixAdmin}/settings`, authMiddleware.requireAuth, settings_route_1.settingsRoutes);
};
exports.default = adminRoutes;
