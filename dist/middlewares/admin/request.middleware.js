"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReq = exports.patchReq = exports.postReq = exports.getReq = void 0;
const system_config_1 = require("../../config/system.config");
const getReq = (route) => {
    return (req, res, next) => {
        const role = res.locals.role;
        const permissions = role.permissions.join(",");
        if (permissions.includes(`${route}-view`) ||
            permissions.includes(`${route}-edit`) ||
            permissions.includes(`${route}-create`) ||
            permissions.includes(`${route}-delete`)) {
            next();
        }
        else {
            res.redirect(`${system_config_1.systemConfig.prefixAdmin}/errors/unauthorized`);
        }
    };
};
exports.getReq = getReq;
const postReq = (route) => {
    return (req, res, next) => {
        const role = res.locals.role;
        const permissions = role.permissions.join(",");
        if (permissions.includes(`${route}-create`)) {
            next();
        }
        else {
            res.redirect(`${system_config_1.systemConfig.prefixAdmin}/errors/unauthorized`);
        }
    };
};
exports.postReq = postReq;
const patchReq = (route) => {
    return (req, res, next) => {
        const role = res.locals.role;
        const permissions = role.permissions.join(",");
        if (permissions.includes(`${route}-edit`)) {
            next();
        }
        else {
            res.redirect(`${system_config_1.systemConfig.prefixAdmin}/errors/unauthorized`);
        }
    };
};
exports.patchReq = patchReq;
const deleteReq = (route) => {
    return (req, res, next) => {
        const role = res.locals.role;
        const permissions = role.permissions.join(",");
        if (permissions.includes(`${route}-delete`)) {
            next();
        }
        else {
            res.redirect(`${system_config_1.systemConfig.prefixAdmin}/errors/unauthorized`);
        }
    };
};
exports.deleteReq = deleteReq;
